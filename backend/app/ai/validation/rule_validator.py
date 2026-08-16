"""
Rule-Based Technical Attribute Validator & Conflict Detector
"""

import re
from typing import Any, Dict, List, Optional
from app.ai.normalization.unit_normalizer import UnitNormalizer


class RuleValidator:
    # Mandatory attributes per industrial category
    CATEGORY_MANDATORY_FIELDS = {
        "Hydraulic Equipment": ["operating_pressure", "flow_rate", "material"],
        "Control Valves": ["max_pressure", "connection_size", "material"],
        "Electric Motors": ["power_output", "speed", "voltage"],
        "Bearings & Seals": ["bore_diameter", "load_rating"],
        "Pneumatics": ["bore", "stroke", "operating_pressure"],
    }

    @classmethod
    def validate_product_attributes(
        cls, category: str, attributes: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        Validates product attributes against physical rules and category requirements.
        Returns a list of detected issues.
        """
        issues = []
        attr_dict = {a["key"]: a for a in attributes if "key" in a}

        # 1. Mandatory category field completeness check
        required_fields = cls.CATEGORY_MANDATORY_FIELDS.get(category, [])
        for field in required_fields:
            if field not in attr_dict or not str(attr_dict[field].get("value", "")).strip():
                issues.append({
                    "attribute_name": field.replace("_", " ").title(),
                    "severity": "warning",
                    "title": f"Missing Mandatory Field: {field.replace('_', ' ').title()}",
                    "description": f"The category '{category}' requires a specified '{field.replace('_', ' ').title()}'.",
                    "recommended_action": "Provide the missing specification via document upload or AI enrichment.",
                    "status": "open",
                })

        # 2. Physical & Engineering validation rules
        for a in attributes:
            key = a.get("key", "").lower()
            val_str = str(a.get("value", "")).strip()
            unit = a.get("unit", "")
            
            # Numeric extraction
            num_match = re.search(r"[-+]?\d*\.?\d+", val_str)
            num_val = float(num_match.group(0)) if num_match else None

            # Pressure checks
            if "pressure" in key and num_val is not None:
                if num_val < 0:
                    issues.append({
                        "attribute_name": a.get("display_name", "Pressure"),
                        "severity": "critical",
                        "title": "Invalid Pressure Value",
                        "description": f"Operating pressure cannot be negative ({num_val} {unit}).",
                        "recommended_action": "Review source document and correct the pressure rating.",
                        "status": "open",
                    })

            # Voltage checks
            if "voltage" in key and num_val is not None:
                if num_val <= 0:
                    issues.append({
                        "attribute_name": a.get("display_name", "Voltage"),
                        "severity": "critical",
                        "title": "Invalid Voltage Value",
                        "description": f"Electrical voltage must be greater than zero ({num_val} {unit}).",
                        "recommended_action": "Verify electrical specification on datasheet.",
                        "status": "open",
                    })

            # Weight checks
            if "weight" in key and num_val is not None:
                if num_val <= 0:
                    issues.append({
                        "attribute_name": a.get("display_name", "Weight"),
                        "severity": "warning",
                        "title": "Invalid Weight Value",
                        "description": f"Product weight must be positive ({num_val} {unit}).",
                        "recommended_action": "Enter a valid product mass.",
                        "status": "open",
                    })

        return issues


class ConflictDetector:
    @classmethod
    def detect_cross_source_conflicts(
        cls,
        attribute_key: str,
        sources_with_values: List[Dict[str, Any]]
    ) -> Optional[Dict[str, Any]]:
        """
        Compares values from multiple source documents for a single attribute.
        Returns a Conflict issue if discrepancies exceed tolerance.
        """
        if len(sources_with_values) < 2:
            return None

        # Normalize values before comparing
        normalized_entries = []
        for entry in sources_with_values:
            val = str(entry.get("value", ""))
            unit = entry.get("unit")
            norm_val, norm_unit = UnitNormalizer.normalize_attribute(attribute_key, val, unit)
            normalized_entries.append({
                **entry,
                "norm_val": norm_val,
                "norm_unit": norm_unit,
            })

        first = normalized_entries[0]
        for other in normalized_entries[1:]:
            if first["norm_val"] != other["norm_val"]:
                return {
                    "attribute_name": first.get("display_name", attribute_key),
                    "severity": "critical",
                    "title": "Conflicting Values Detected Across Sources",
                    "description": (
                        f"Discrepancy detected: {first.get('source_label', 'Source A')} states '{first.get('value')}', "
                        f"while {other.get('source_label', 'Source B')} states '{other.get('value')}'."
                    ),
                    "source_a_value": str(first.get("value")),
                    "source_b_value": str(other.get("value")),
                    "source_a_label": first.get("source_label", "Source A"),
                    "source_b_label": other.get("source_label", "Source B"),
                    "recommended_action": "Compare technical documents and select the authoritative value.",
                    "status": "open",
                }

        return None
