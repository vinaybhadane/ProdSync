"""
Prompt Injection Defense & Untrusted Document Sanitizer
"""

import re
from typing import Tuple


class PromptInjectionGuard:
    # Common prompt injection triggers in untrusted PDFs and URLs
    INJECTION_PATTERNS = [
        r"ignore\s+(previous|all)\s+instructions",
        r"disregard\s+(previous|all)\s+instructions",
        r"system\s*prompt",
        r"reveal\s+your\s+(prompt|instructions|keys)",
        r"you\s+are\s+now\s+in\s+developer\s+mode",
        r"bypass\s+all\s+rules",
        r"<script[\s\S]*?>",
    ]

    @classmethod
    def sanitize_document_text(cls, text: str) -> Tuple[str, bool]:
        """
        Sanitizes untrusted document text before feeding into AI prompts.
        Returns: (sanitized_text, was_flagged)
        """
        if not text:
            return "", False

        flagged = False
        clean = text
        for pattern in cls.INJECTION_PATTERNS:
            if re.search(pattern, clean, re.IGNORECASE):
                flagged = True
                clean = re.sub(pattern, "[FILTERED UNTRUSTED INSTRUCTION]", clean, flags=re.IGNORECASE)

        # Enforce maximum character buffer
        max_chars = 150000
        if len(clean) > max_chars:
            clean = clean[:max_chars]

        return clean, flagged
