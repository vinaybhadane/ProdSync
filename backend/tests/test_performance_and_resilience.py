"""
Unit & Integration Tests for Performance & Resilience Components
- In-memory async cache & tag invalidation
- Resilient JSON repair from LLMs
- Deep health readiness probe
- GZip response compression
"""

import asyncio
import pytest
from httpx import AsyncClient, ASGITransport
from app.core.cache import AsyncInMemoryCache
from app.main import app
from app.utils.json_repair import repair_and_load_json


def test_json_repair_clean_json():
    raw = '{"products": [{"name": "Hydraulic Pump", "sku": "HP-100"}]}'
    result = repair_and_load_json(raw)
    assert "products" in result
    assert result["products"][0]["sku"] == "HP-100"


def test_json_repair_markdown_codeblock():
    raw = """```json
    {
      "products": [{"name": "Valve PCV-200"}]
    }
    ```"""
    result = repair_and_load_json(raw)
    assert "products" in result
    assert result["products"][0]["name"] == "Valve PCV-200"


def test_json_repair_trailing_commas():
    raw = '{"name": "Motor", "power": 45, "attributes": ["voltage", "current",],}'
    result = repair_and_load_json(raw)
    assert result["name"] == "Motor"
    assert result["power"] == 45


def test_json_repair_with_preamble_and_outro():
    raw = 'Here is the extracted data:\n```json\n{"name": "Bearing"}\n```\nHope this helps!'
    result = repair_and_load_json(raw)
    assert result.get("name") == "Bearing"


@pytest.mark.asyncio
async def test_in_memory_cache_operations():
    cache = AsyncInMemoryCache(max_size=100)
    
    # 1. Set & Get
    await cache.set("test_key", {"data": 123}, ttl_seconds=60, tags=["test_tag"])
    val = await cache.get("test_key")
    assert val == {"data": 123}
    
    # 2. Tag invalidation
    await cache.invalidate_tags(["test_tag"])
    val_after = await cache.get("test_key")
    assert val_after is None

    # 3. Telemetry stats
    stats = await cache.get_stats()
    assert stats["hits"] == 1
    assert stats["misses"] == 1


@pytest.mark.asyncio
async def test_deep_readiness_health():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/v1/health/ready")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] in ["ready", "degraded"]
        assert "database" in data
        assert data["database"]["status"] == "healthy"
        assert "latency_ms" in data["database"]
        assert "cache" in data
