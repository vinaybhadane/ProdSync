"""
Field-Level Provenance Tracker & Multi-Source Conflict Detector
UniHack 2026 Source Verification & Explainability Module
Attaches verifiable provenance to every single product attribute and detects discrepancies across documents.
"""

from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from app.ai.normalization.unit_normalizer import UnitNormalizer


class FieldProvenance:
    def __init__(
        self,
        field_name: str,
        value: str,
        unit: Optional[str] = None,
        source_url: Optional[str] = None,
        source_type: str = "manufacturer",
        source_name: str = "Official Manufacturer Datasheet",
        page_number: Optional[int] = None,
        section: Optional[str] = None,
        evidence_snippet: Optional[str] = None,
        confidence: float = 95.0,
    ):
        self.field_name = field_name
        self.value = value
        self.unit = unit
        self.source_url = source_url
        self.source_type = source_type
        self.source_name = source_name
        self.page_number = page_number
        self.section = section
        self.evidence_snippet = evidence_snippet or f"Extracted from {source_name}: '{value}'"
        self.confidence = round(confidence, 1)
        self.retrieved_at = datetime.now(timezone.utc).isoformat()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "field_name": self.field_name,
            "value": self.value,
            "unit": self.unit,
            "source_url": self.source_url,
            "source_type": self.source_type,
            "source_name": self.source_name,
            "page_number": self.page_number,
            "section": self.section,
            "evidence_snippet": self.evidence_snippet,
            "confidence": self.confidence,
            "retrieved_at": self.retrieved_at,
        }


class ProvenanceTracker:
    """
    Manages field-level provenance records and performs cross-source conflict detection.
    """

    @classmethod
    def create_provenance(
        cls,
        field_name: str,
        value: str,
        unit: Optional[str] = None,
        source_url: Optional[str] = None,
        source_type: str = "manufacturer",
        source_name: str = "Official Manufacturer Datasheet",
        page_number: Optional[int] = None,
        evidence_snippet: Optional[str] = None,
        confidence: float = 95.0,
    ) -> FieldProvenance:
        return FieldProvenance(
            field_name=field_name,
            value=value,
            unit=unit,
            source_url=source_url,
            source_type=source_type,
            source_name=source_name,
            page_number=page_number,
            evidence_snippet=evidence_snippet,
            confidence=confidence,
        )

    @classmethod
    def detect_conflicts(
        cls,
        attribute_key: str,
        source_observations: List[Dict[str, Any]],
    ) -> Optional[Dict[str, Any]]:
        """
        Detects conflicts between multiple source documents for a single attribute.
        Example: Source 1 (Website) says "120 V", Source 2 (Datasheet) says "240 V".
        """
        if len(source_observations) < 2:
            return None

        # Normalize values before comparing
        normalized_entries = []
        for obs in source_observations:
            val = str(obs.get("value", "")).strip()
            unit = obs.get("unit")
            norm_val, norm_unit = UnitNormalizer.normalize_attribute(attribute_key, val, unit)
            normalized_entries.append({
                **obs,
                "norm_val": norm_val,
                "norm_unit": norm_unit,
            })

        first = normalized_entries[0]
        for other in normalized_entries[1:]:
            if first["norm_val"] != other["norm_val"]:
                # Conflict detected!
                source_a_label = first.get("source_name") or first.get("source_url") or "Source A"
                source_b_label = other.get("source_name") or other.get("source_url") or "Source B"
                return {
                    "attribute_name": first.get("display_name", attribute_key),
                    "attribute_key": attribute_key,
                    "severity": "critical",
                    "title": f"Conflicting Values Detected for {first.get('display_name', attribute_key)}",
                    "description": f"Discrepancy: {source_a_label} states '{first.get('value')}', while {source_b_label} states '{other.get('value')}'.",
                    "source_a_value": str(first.get("value")),
                    "source_b_value": str(other.get("value")),
                    "source_a_label": str(source_a_label),
                    "source_b_label": str(source_b_label),
                    "source_a_priority": "Priority 1 (Manufacturer)" if "manufacturer" in first.get("source_type", "") else "Priority 2 (Distributor)",
                    "source_b_priority": "Priority 1 (Manufacturer)" if "manufacturer" in other.get("source_type", "") else "Priority 2 (Distributor)",
                    "resolution_status": "Flagged for Expert Review",
                    "recommended_action": "Review official technical documentation and verify against manufacturer nameplate.",
                    "status": "open",
                }

        return None


provenance_tracker = ProvenanceTracker()
