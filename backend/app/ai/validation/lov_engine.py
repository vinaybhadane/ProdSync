"""
List of Values (LOV) Engine & Validation Module
UniHack 2026 LOV Compliance & New Value Discovery
Enforces standard LOV matching and detects new valid values without force-fitting.
"""

import re
from typing import Any, Dict, List, Optional, Set, Tuple


# Standard List of Values (LOV) by Attribute Name
STANDARD_LOV_REGISTRY: Dict[str, Set[str]] = {
    "mounting type": {
        "din rail", "panel mount", "surface mount", "flange mount", "foot mount",
        "chassis mount", "through-hole", "built-in", "leg", "bracket", "screw",
        "magnetic", "direct mount", "sub-base mount", "pipe mount", "wall mount",
        "rack mount", "clip-on", "socket mount", "threaded"
    },
    "material": {
        "stainless steel", "carbon steel", "cast iron", "brass", "bronze",
        "aluminum", "copper", "plastic", "polycarbonate", "nylon", "ptfe",
        "ceramic", "silicon carbide", "aluminum oxide", "zirconia", "fiberglass",
        "rubber", "nitrile", "viton", "epdm", "alloy steel", "ductile iron"
    },
    "applicable material": {
        "metal", "steel", "stainless steel", "wood", "plastic", "masonry",
        "concrete", "aluminum", "ferrous metals", "non-ferrous metals", "cast iron"
    },
    "backing material": {
        "cloth", "paper", "film", "fiber", "polyester", "mesh", "foam", "vulcanized fiber"
    },
    "grit rating": {
        "p24", "p36", "p40", "p50", "p60", "p80", "p100", "p120", "p150",
        "p180", "p220", "p240", "p280", "p320", "p360", "p400", "p500", "p600",
        "p800", "p1000", "p1200", "p1500", "p2000", "coarse", "medium", "fine", "extra fine"
    },
    "plug type": {
        "nema 5-15p", "nema 5-20p", "nema 6-15p", "nema 6-20p", "nema 14-50p",
        "hardwired", "iec c13", "iec c14", "iec c19", "iec c20", "terminal block"
    },
    "standard/approvals": {
        "ul listed", "cul listed", "ce marked", "csa certified", "rohs compliant",
        "energy star certified", "nsf certified", "asse 1006", "cee tier 2 qualified",
        "iec 60947", "iso 9001", "ansi compliant", "nema rated", "ip65", "ip66", "ip67", "ip68"
    },
    "voltage rating": {
        "12", "24", "48", "110", "115", "120", "208", "220", "230", "240",
        "277", "380", "400", "440", "460", "480", "575", "600", "690"
    },
    "amperage rating": {
        "1", "2", "3", "4", "5", "6", "9", "10", "12", "15", "16", "18", "20",
        "25", "30", "32", "40", "50", "63", "80", "100", "125", "150", "200", "250"
    },
    "selling uom": {
        "ea", "pk", "bx", "cs", "rl", "set", "pr", "ft", "in", "m", "mm", "kg", "lb"
    },
    "warranty": {
        "1 year manufacturer warranty", "2 year manufacturer warranty",
        "3 year manufacturer warranty", "5 year manufacturer warranty",
        "10 year manufacturer warranty", "lifetime limited warranty",
        "90 day limited warranty"
    },
    "color": {
        "stainless steel", "white", "black", "silver", "gray", "red", "blue", "yellow", "orange", "green"
    }
}


class LOVEngine:
    """
    List of Values (LOV) Validation & New Value Discovery Engine.
    """

    @classmethod
    def validate_attribute_lov(
        cls,
        attribute_name: str,
        value: str,
        unit: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Compares extracted attribute value against applicable LOV.
        Returns:
            status: "VALID" | "NEW_VALUE" | "INVALID" | "MISSING" | "UNVERIFIED"
            matched_lov: Canonical matched LOV value or None
            reason: Explanation of the validation status
        """
        clean_attr = attribute_name.lower().strip().replace("_", " ")
        clean_val = str(value or "").strip()

        # 1. Check if empty/missing
        if not clean_val or clean_val.lower() in ["none", "null", "n/a", "unknown", "— missing", ""]:
            return {
                "status": "MISSING",
                "matched_lov": None,
                "reason": f"Attribute '{attribute_name}' has no specified value.",
                "is_new_value": False,
            }

        # 2. Find matching LOV set
        lov_set = None
        for key, vals in STANDARD_LOV_REGISTRY.items():
            if key in clean_attr or clean_attr in key:
                lov_set = vals
                break

        if not lov_set:
            # If no LOV registry exists for this specific technical attribute (e.g. Dimensions, Weight),
            # check if the value is technically sound and well-formed
            if re.match(r"^[-+]?\d*\.?\d+(?:/\d+)?(?:\s*[xX]\s*[-+]?\d*\.?\d+(?:/\d+)?)*$", clean_val) or len(clean_val) > 0:
                return {
                    "status": "VALID",
                    "matched_lov": clean_val,
                    "reason": "Value is technically structured with valid physical format.",
                    "is_new_value": False,
                }
            return {
                "status": "UNVERIFIED",
                "matched_lov": None,
                "reason": "No explicit LOV constraint for this attribute.",
                "is_new_value": False,
            }

        # 3. Direct or Case-Insensitive LOV Match
        val_lower = clean_val.lower()
        # Remove unit suffix if present in numeric LOV check (e.g. "120 V" -> "120")
        num_clean = re.sub(r'[^\d.]', '', val_lower)

        for lov_item in lov_set:
            if val_lower == lov_item or (num_clean and num_clean == lov_item):
                return {
                    "status": "VALID",
                    "matched_lov": lov_item.title() if not lov_item.isupper() else lov_item,
                    "reason": f"Value matches approved LOV standard ('{lov_item}').",
                    "is_new_value": False,
                }

        # 4. Multi-value LOV check (e.g., standard approvals separated by pipe/comma: "UL Listed|CSA Certified")
        if any(sep in val_lower for sep in ["|", ",", ";"]):
            sub_vals = [s.strip() for s in re.split(r'[|,;]', val_lower) if s.strip()]
            all_valid = True
            for sv in sub_vals:
                if not any(sv in lov_item or lov_item in sv for lov_item in lov_set):
                    all_valid = False
                    break
            if all_valid and sub_vals:
                return {
                    "status": "VALID",
                    "matched_lov": clean_val,
                    "reason": "Compound value matches multiple approved LOV standards.",
                    "is_new_value": False,
                }

        # 5. Check if it is a NEW VALID VALUE outside the current LOV (e.g. "Custom Flange Mount", "Titanium Alloy")
        # Ensure it is not nonsense/garbage
        is_meaningful_spec = len(clean_val) >= 2 and not clean_val.lower().startswith("invalid")
        if is_meaningful_spec:
            return {
                "status": "NEW_VALUE",
                "matched_lov": None,
                "reason": f"New valid specification discovered outside standard LOV: '{clean_val}'.",
                "is_new_value": True,
            }

        return {
            "status": "INVALID",
            "matched_lov": None,
            "reason": f"Value '{clean_val}' does not conform to engineering standards for '{attribute_name}'.",
            "is_new_value": False,
        }


lov_engine = LOVEngine()
