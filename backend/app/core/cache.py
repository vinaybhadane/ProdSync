"""
ProdSync High-Performance In-Memory Async Cache
Supports TTL expiration, tag-based invalidation, and sub-millisecond response times
"""

import asyncio
import time
from typing import Any, Callable, Dict, List, Optional, Set, Tuple
from app.core.logging import logger


class CacheEntry:
    __slots__ = ("value", "expires_at", "tags")

    def __init__(self, value: Any, ttl_seconds: float, tags: Optional[Set[str]] = None):
        self.value = value
        self.expires_at = time.time() + ttl_seconds if ttl_seconds > 0 else float("inf")
        self.tags = tags or set()

    @property
    def is_expired(self) -> bool:
        return time.time() > self.expires_at


class AsyncInMemoryCache:
    """Thread-safe, async in-memory cache with TTL and tag-based invalidation."""

    def __init__(self, max_size: int = 5000):
        self._store: Dict[str, CacheEntry] = {}
        self._tag_map: Dict[str, Set[str]] = {}
        self._lock = asyncio.Lock()
        self._max_size = max_size
        self._hits = 0
        self._misses = 0

    async def get(self, key: str) -> Optional[Any]:
        """Retrieves a cached value if present and unexpired."""
        async with self._lock:
            entry = self._store.get(key)
            if entry is None:
                self._misses += 1
                return None
            if entry.is_expired:
                del self._store[key]
                self._misses += 1
                return None
            self._hits += 1
            return entry.value

    async def set(
        self, key: str, value: Any, ttl_seconds: float = 60.0, tags: Optional[List[str]] = None
    ):
        """Sets a cache value with an optional TTL in seconds and tags."""
        async with self._lock:
            # Simple eviction if max size reached
            if len(self._store) >= self._max_size:
                now = time.time()
                # Evict expired first
                expired_keys = [k for k, v in self._store.items() if now > v.expires_at]
                for k in expired_keys:
                    del self._store[k]
                # If still full, drop oldest 10%
                if len(self._store) >= self._max_size:
                    to_remove = list(self._store.keys())[: max(1, self._max_size // 10)]
                    for k in to_remove:
                        self._store.pop(k, None)

            tag_set = set(tags) if tags else set()
            self._store[key] = CacheEntry(value, ttl_seconds, tag_set)

            for tag in tag_set:
                if tag not in self._tag_map:
                    self._tag_map[tag] = set()
                self._tag_map[tag].add(key)

    async def invalidate(self, key: str):
        """Invalidates a specific cache key."""
        async with self._lock:
            self._store.pop(key, None)

    async def invalidate_tags(self, tags: List[str]):
        """Invalidates all cached items associated with any of the provided tags."""
        async with self._lock:
            for tag in tags:
                keys = self._tag_map.pop(tag, set())
                for k in keys:
                    self._store.pop(k, None)

    async def clear(self):
        """Clears all cached entries."""
        async with self._lock:
            self._store.clear()
            self._tag_map.clear()

    async def get_stats(self) -> Dict[str, Any]:
        """Returns cache telemetry stats."""
        async with self._lock:
            total = self._hits + self._misses
            hit_ratio = round((self._hits / total) * 100.0, 1) if total > 0 else 0.0
            return {
                "size": len(self._store),
                "max_size": self._max_size,
                "hits": self._hits,
                "misses": self._misses,
                "hit_ratio_percent": hit_ratio,
            }


cache = AsyncInMemoryCache()
