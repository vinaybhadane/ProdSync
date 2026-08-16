"""
ProdSync JSON Repair & Sanitization Engine
Recovers valid JSON structures from noisy, partial, or malformed LLM responses
"""

import json
import re
from typing import Any, Dict, Optional


def repair_and_load_json(raw_text: str, default: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """
    Attempts multiple strategies to parse JSON from an LLM response string:
    1. Direct JSON parse
    2. Markdown codeblock extraction
    3. Bracket boundary extraction ({ ... } or [ ... ])
    4. Trailing comma removal & quote fixing
    5. Fallback default
    """
    if not raw_text or not raw_text.strip():
        return default or {}

    text = raw_text.strip()

    # Strategy 1: Direct parse
    try:
        return json.loads(text)
    except Exception:
        pass

    # Strategy 2: Strip Markdown code fences
    # Matches ```json ... ``` or ``` ... ```
    cleaned = re.sub(r"^```(?:json|JSON)?\s*", "", text, flags=re.MULTILINE)
    cleaned = re.sub(r"\s*```$", "", cleaned, flags=re.MULTILINE).strip()
    try:
        return json.loads(cleaned)
    except Exception:
        pass

    # Strategy 3: Find outermost { ... } or [ ... ]
    first_brace = cleaned.find("{")
    last_brace = cleaned.rfind("}")
    if first_brace != -1 and last_brace != -1 and last_brace > first_brace:
        candidate = cleaned[first_brace : last_brace + 1]
        try:
            return json.loads(candidate)
        except Exception:
            # Strategy 4: Clean common LLM formatting flaws
            # Remove trailing commas before } or ]
            repaired = re.sub(r",\s*([\]}])", r"\1", candidate)
            # Fix unquoted single-word keys: { key: "value" } -> { "key": "value" }
            repaired = re.sub(r'(?<=[{,\s])([a-zA-Z0-9_]+)\s*:', r'"\1":', repaired)
            # Replace single quotes with double quotes where safe
            repaired = re.sub(r"'\s*([^']+\S)\s*'", r'"\1"', repaired)
            try:
                return json.loads(repaired)
            except Exception:
                pass

    # Strategy 5: Array wrapper if root is array
    first_bracket = cleaned.find("[")
    last_bracket = cleaned.rfind("]")
    if first_bracket != -1 and last_bracket != -1 and last_bracket > first_bracket:
        candidate = cleaned[first_bracket : last_bracket + 1]
        try:
            parsed = json.loads(candidate)
            if isinstance(parsed, list):
                return {"items": parsed}
            return parsed
        except Exception:
            repaired = re.sub(r",\s*([\]}])", r"\1", candidate)
            try:
                parsed = json.loads(repaired)
                return {"items": parsed} if isinstance(parsed, list) else parsed
            except Exception:
                pass

    return default or {}
