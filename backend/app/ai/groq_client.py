"""
Groq AI High-Throughput Engine — ProdSync Enterprise Intelligence
Utilizes Groq LPU acceleration for large-scale, high-speed batch enrichment tasks,
multi-product classification, and massive attribute extraction (120B & 20B models).
"""

import json
import re
import time
from typing import Any, Dict, List, Optional
import httpx

from app.core.config import settings
from app.core.logging import logger


class GroqService:
    """
    High-speed LLM service powered by Groq LPUs.
    Optimized for large-volume batch processing (up to 300 tokens/sec).
    """

    def __init__(self):
        self.api_key = settings.GROQ_API_KEY
        self.primary_model = settings.GROQ_MODEL or "openai/gpt-oss-120b"
        self.fast_model = settings.GROQ_FAST_MODEL or "openai/gpt-oss-20b"
        self.base_url = "https://api.groq.com/openai/v1/chat/completions"
        if self.api_key:
            logger.info(f"Groq LPU service initialized with models '{self.primary_model}' and '{self.fast_model}'.")
        else:
            logger.warning("GROQ_API_KEY not configured.")

    async def generate_structured_json(
        self,
        system_prompt: str,
        user_content: str,
        model: Optional[str] = None,
        timeout_seconds: float = 12.0,
        temperature: float = 0.1,
    ) -> Dict[str, Any]:
        """
        Executes an ultra-fast structured JSON generation call on Groq LPUs.
        """
        if not self.api_key:
            return {"data": {}, "model": "none", "usage": {}}

        chosen_model = model or self.primary_model
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": chosen_model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_content},
            ],
            "response_format": {"type": "json_object"},
            "temperature": temperature,
            "max_tokens": 1200,
        }

        start = time.time()
        try:
            async with httpx.AsyncClient(timeout=timeout_seconds) as client:
                res = await client.post(self.base_url, headers=headers, json=payload)
                if res.status_code == 200:
                    data = res.json()
                    content = data["choices"][0]["message"]["content"]
                    parsed = json.loads(content)
                    duration = (time.time() - start) * 1000
                    logger.info(f"Groq '{chosen_model}' returned JSON in {duration:.1f}ms.")
                    return {
                        "data": parsed,
                        "model": chosen_model,
                        "usage": data.get("usage", {}),
                        "duration_ms": duration,
                    }
                else:
                    logger.warning(f"Groq API HTTP {res.status_code}: {res.text}. Trying fast model fallback...")
                    # Fallback to fast model
                    payload["model"] = self.fast_model
                    res_fallback = await client.post(self.base_url, headers=headers, json=payload)
                    if res_fallback.status_code == 200:
                        data = res_fallback.json()
                        content = data["choices"][0]["message"]["content"]
                        return {"data": json.loads(content), "model": self.fast_model, "usage": data.get("usage", {})}
                    return {"data": {}, "error": res.text}
        except Exception as e:
            logger.warning(f"Groq API execution notice: {e}")
            return {"data": {}, "error": str(e)}

    async def batch_enrich_archetype_category(
        self,
        category: str,
        sample_items: List[Dict[str, str]],
    ) -> Dict[str, Any]:
        """
        Synthesizes deep industrial archetype parameters for an entire category cluster.
        Takes a cluster of up to 50 items and extracts common technical attribute schemas.
        """
        system_prompt = (
            "You are a Principal Industrial Product Catalog Engineer for an enterprise B2B distributor. "
            "Given a category and sample product titles/MPNs, infer common engineering attributes, standard UOMs, "
            "and compliant feature bullets in strict JSON format."
        )
        sample_text = "\n".join([f"- MPN: {item.get('mpn')}, Name: {item.get('name')}" for item in sample_items[:15]])
        user_content = (
            f"Category: {category}\n"
            f"Sample Products in Batch:\n{sample_text}\n\n"
            f"Output JSON format:\n"
            f'{{\n'
            f'  "common_attributes": [\n'
            f'    {{"name": "Voltage Rating", "uom": "V", "example_value": "120"}},\n'
            f'    {{"name": "Material", "uom": null, "example_value": "Stainless Steel"}}\n'
            f'  ],\n'
            f'  "bullet_features": [\n'
            f'    "Point 1", "Point 2", "Point 3", "Point 4", "Point 5"\n'
            f'  ]\n'
            f'}}'
        )

        res = await self.generate_structured_json(
            system_prompt=system_prompt,
            user_content=user_content,
            model=self.primary_model,
        )
        return res.get("data", {})


groq_service = GroqService()
