"""
ProdSync Deterministic Confidence & Data Quality Scoring Engine
"""

from typing import Any, Dict, List, Optional


class ConfidenceScorer:
    # Source reliability priors (0.0 to 1.0)
    SOURCE_RELIABILITY = {
        "datasheet": 0.98,
        "pdf": 0.95,
        "catalog": 0.92,
        "url": 0.88,
        "website": 0.88,
        "csv": 0.85,
        "xlsx": 0.85,
        "manual": 0.80,
        "user_input": 0.80,
        "ai_inference": 0.70,
        "ai_suggestion": 0.65,
    }

    @classmethod
    def calculate_attribute_confidence(
        cls,
        source_type: Optional[str] = None,
        extraction_confidence: float = 0.90,
        source_count: int = 1,
        has_conflicts: bool = False,
        is_user_approved: bool = False,
    ) -> float:
        """
        Calculates a calibrated confidence score (0.0 to 1.0) for an attribute.
        """
        st = (source_type or "pdf").lower()
        source_score = cls.SOURCE_RELIABILITY.get(st, 0.80)

        # Baseline: weighted combination of source reliability and extraction certainty
        base_confidence = (source_score * 0.5) + (extraction_confidence * 0.5)

        # Multi-source agreement boost (+5% per additional corroborating source, max +10%)
        if source_count > 1:
            base_confidence += min(0.10, (source_count - 1) * 0.05)

        # Penalty for detected conflicts (-30%)
        if has_conflicts:
            base_confidence -= 0.30

        # Human approval guarantee (sets minimum confidence to 0.98)
        if is_user_approved:
            base_confidence = max(base_confidence, 0.98)

        # Clamp between 0.05 and 1.00
        return round(max(0.05, min(1.00, base_confidence)), 2)

    @classmethod
    def calculate_product_scores(
        cls,
        attributes: List[Dict[str, Any]],
        expected_attribute_count: int = 10,
        unresolved_issue_count: int = 0,
        source_types: Optional[List[str]] = None,
    ) -> Dict[str, float]:
        """
        Calculates completeness score, AI confidence score, and composite Data Quality Score.
        Returns:
            {
                "completeness_score": float (0-100),
                "ai_confidence_score": float (0-100),
                "data_quality_score": float (0-100)
            }
        """
        # 1. Completeness Score (filled attributes / expected)
        filled_count = len([a for a in attributes if str(a.get("value", "")).strip()])
        completeness = min(100.0, (filled_count / max(1, expected_attribute_count)) * 100.0)

        # 2. Average Attribute Confidence
        confidences = [a.get("confidence", 0.85) for a in attributes if a.get("confidence")]
        avg_conf = (sum(confidences) / len(confidences) * 100.0) if confidences else 75.0

        # 3. Validation Pass Rate
        total_attrs = max(1, len(attributes))
        validation_rate = max(0.0, 100.0 - ((unresolved_issue_count / total_attrs) * 100.0))

        # 4. Source Reliability Average
        sources = source_types or ["pdf"]
        source_rel_avg = (
            sum(cls.SOURCE_RELIABILITY.get(s.lower(), 0.80) for s in sources) / len(sources)
        ) * 100.0

        # 5. Composite Data Quality Formula (Spec Section 61):
        # 35% Completeness + 30% Validation + 20% Source Reliability + 15% Confidence
        quality_score = (
            (completeness * 0.35)
            + (validation_rate * 0.30)
            + (source_rel_avg * 0.20)
            + (avg_conf * 0.15)
        )

        return {
            "completeness_score": round(completeness, 1),
            "ai_confidence_score": round(avg_conf, 1),
            "data_quality_score": round(max(0.0, min(100.0, quality_score)), 1),
        }
