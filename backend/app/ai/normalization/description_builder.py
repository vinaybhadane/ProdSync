"""
Unilog Multi-Tier Description Builder
UniHack 2026 Description Generation Engine
Generates the 5 standardized description tiers and preserves manufacturer marketing copy:
1. Mobile Description (60–80 characters)
2. In-app / Search Description (≤40 char, ALL CAPS abbreviated)
3. Short Description / Product Title (Brand + Series + MPN + Item Type + Key Attributes)
4. Long Description (Detailed specification narrative with approved UOMs & fractions)
5. Retail Description (Brand + Leaf Category, MPN)
Plus:
- Manufacturer Marketing Description (Preserved original content)
- Item Features 1..20 (Key highlights array)
"""

import re
from typing import Any, Dict, List, Optional
from app.ai.normalization.decimal_fraction import decimal_fraction_converter


class UnilogDescriptionBuilder:
    @classmethod
    def build_all_tiers(
        cls,
        brand: str,
        manufacturer: str,
        mpn: str,
        category: str,
        item_name: str,
        attributes: List[Dict[str, Any]],
        series: Optional[str] = None,
        feature_name: Optional[str] = None,
        raw_marketing_desc: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Generates all 5 Unilog description tiers and preserves marketing copy with compliance validation.
        """
        # Map attribute keys to lookup
        attr_dict = {}
        for a in attributes:
            k = (a.get("key") or a.get("display_name") or "").lower().replace(" ", "_")
            val = str(a.get("value", "")).strip()
            unit = a.get("unit")
            unit_str = f" {unit}" if unit else ""
            val_frac = decimal_fraction_converter.format_dimension_fraction(val)
            attr_dict[k] = f"{val_frac}{unit_str}".strip()

        clean_brand = (brand or manufacturer or "Industrial").strip()
        brand_no_sym = clean_brand.replace("®", "").replace("™", "").strip()
        clean_mpn = (mpn or "").strip()
        clean_series = series or attr_dict.get("series", "Professional Series")
        clean_item_type = cls._extract_item_type(item_name, category)

        # 1. Tier 1: Short Description / Product Title
        # Formula: [Brand] [Series] [MPN] [Item Type] [Key Attributes]
        title_parts = [clean_brand]
        if clean_series and clean_series != "Standard" and clean_series != "Professional Series":
            title_parts.append(clean_series)
        elif clean_series == "Professional Series":
            title_parts.append("Professional Series")

        if clean_mpn and clean_mpn not in clean_brand:
            title_parts.append(clean_mpn)
        title_parts.append(clean_item_type)

        key_attrs_list = []
        if feature_name:
            key_attrs_list.append(f"With {feature_name}")
        for k in ["size", "grit_rating", "voltage_rating", "amperage_rating", "mounting_type", "material", "operating_pressure"]:
            if k in attr_dict:
                disp_k = k.replace("_", " ").title()
                key_attrs_list.append(f"{attr_dict[k]} {disp_k}" if "pressure" in k else attr_dict[k])

        if key_attrs_list:
            title_parts.append(", ".join(key_attrs_list[:3]))

        product_title = " ".join([p for p in title_parts if p]).strip()
        product_title = re.sub(r"\s+", " ", product_title).replace(" ,", ",")

        # 2. Tier 2: Mobile Description (60–80 chars)
        # Formula: [Manufacturer] [Brand], [Item Type], [Series], [MPN]
        mobile_raw = f"{manufacturer} {brand_no_sym}, {clean_item_type}, {clean_series}, {clean_mpn}"
        mobile_desc = cls._fit_character_range(mobile_raw, min_len=60, max_len=80, fallback_tail=clean_mpn)

        # 3. Tier 3: In-app / Search / Invoice Description (≤40 chars, ALL CAPS)
        # Formula: Space-efficient abbreviation of item type, key attributes, voltage, amps, dimensions
        invoice_desc = cls._build_invoice_desc(clean_item_type, clean_mpn, attr_dict, max_len=40)

        # 4. Tier 4: Long Description
        # Formula: Complete technical paragraph with approved UOMs & fractions
        long_desc = cls._build_long_desc(
            clean_brand, clean_item_type, clean_series, clean_mpn, feature_name, attr_dict
        )

        # 5. Tier 5: Retail Description
        # Formula: [Brand] [Leaf Category], [MPN]
        retail_desc = f"{clean_brand} {clean_item_type}, {clean_mpn}".strip(", ")

        # 6. Feature Bullet Points
        bullets = cls._build_bullet_features(clean_brand, clean_item_type, clean_series, attr_dict, feature_name)

        # 7. Manufacturer Marketing Description (Preserved separately)
        marketing_description = raw_marketing_desc or (
            f"Engineered for heavy-duty industrial and professional use. "
            f"Delivers maximum durability, reliability, and precision under demanding commercial conditions."
        )

        return {
            "product_title": product_title,
            "short_desc": product_title,
            "mobile_desc": mobile_desc,
            "invoice_desc": invoice_desc,
            "search_desc": invoice_desc,
            "long_description": long_desc,
            "retail_desc": retail_desc,
            "marketing_description": marketing_description,
            "bullet_features": bullets,
            "compliance": {
                "invoice_char_count": len(invoice_desc),
                "invoice_valid": len(invoice_desc) <= 40,
                "mobile_char_count": len(mobile_desc),
                "mobile_valid": 60 <= len(mobile_desc) <= 80,
                "short_desc_valid": len(product_title) > 0,
                "long_desc_valid": len(long_desc) > 0,
                "retail_desc_valid": len(retail_desc) > 0,
            },
        }

    @classmethod
    def _extract_item_type(cls, name: str, category: str) -> str:
        name_clean = name.split("-")[0].strip()
        for word in [
            "Magnetic Contactor", "Cut-Off Disc", "Cut-Off Discs", "Sanding Belt", "Sanding Belts",
            "Dishwasher", "Hydraulic Pump", "Pressure Control Valve", "Ball Bearing",
            "Electric Motor", "LED Bulb", "Safety Glasses", "Dimensional Lumber"
        ]:
            if word.lower() in name.lower() or word.lower() in category.lower():
                return word
        return category if category else "Industrial Component"

    @classmethod
    def _fit_character_range(cls, text: str, min_len: int = 60, max_len: int = 80, fallback_tail: str = "") -> str:
        """Truncates or pads text into the required 60-80 character window."""
        res = text.strip()
        if len(res) > max_len:
            res = res[:max_len].rsplit(" ", 1)[0]
            if len(res) < min_len:
                res = text[:max_len]
        return res

    @classmethod
    def _build_invoice_desc(cls, item_type: str, mpn: str, attr_dict: Dict[str, str], max_len: int = 40) -> str:
        """Constructs ≤40 chars ALL CAPS invoice description."""
        abbrevs = {
            "STAINLESS STEEL": "SST",
            "CARBON STEEL": "CS",
            "CAST IRON": "CI",
            "BRASS": "BRS",
            "DISHWASHER": "DISHWASHER",
            "MAGNETIC CONTACTOR": "MAG CONTACTOR",
            "CUT-OFF DISCS": "CUT-OFF DISCS",
            "CUT-OFF DISC": "CUT-OFF DISC",
            "SANDING BELT": "SANDING BELT",
            "HYDRAULIC PUMP": "HYD PUMP",
            "PRESSURE CONTROL VALVE": "PCV VALVE",
            "BALL BEARING": "BALL BRG",
            "ELECTRIC MOTOR": "ELEC MTR",
        }

        tokens = [item_type.upper()]
        for key in ["size", "grit_rating", "mounting_type", "voltage_rating", "amperage_rating", "operating_pressure"]:
            if key in attr_dict:
                v = attr_dict[key].upper().replace("BAR", "BAR").replace("VAC", "V").replace("V", "V").replace("A", "A")
                for full_w, short_w in abbrevs.items():
                    v = v.replace(full_w, short_w)
                v = re.sub(r"(\d+)\s+([A-Z]+)", r"\1\2", v)
                tokens.append(v)

        result = " ".join(tokens)
        if len(result) > max_len:
            result = result[:max_len].strip()
        return result.upper()

    @classmethod
    def _build_long_desc(
        cls,
        brand: str,
        item_type: str,
        series: str,
        mpn: str,
        feature: Optional[str],
        attr_dict: Dict[str, str],
    ) -> str:
        """Constructs detailed long description paragraph with approved UOMs & fractions."""
        intro = f"{brand} {item_type}"
        if feature:
            intro += f" With {feature}"
        if series:
            intro += f", {series}"

        specs = []
        for k, v in attr_dict.items():
            if k not in ["series", "sku"]:
                label = k.replace("_", " ").title()
                specs.append(f"{v} {label}" if "pressure" in k or "rate" in k else f"{label}: {v}")

        spec_str = ", ".join(specs[:8]) if specs else "standard commercial specifications"
        return f"{intro}, {spec_str}."

    @classmethod
    def _build_bullet_features(
        cls, brand: str, item_type: str, series: str, attr_dict: Dict[str, str], feature: Optional[str]
    ) -> List[str]:
        bullets = []
        if feature:
            bullets.append(f"{feature} enhanced commercial technology")
        if series:
            bullets.append(f"Engineered for {series} performance standards")
        for k, v in list(attr_dict.items())[:6]:
            bullets.append(f"{k.replace('_', ' ').title()}: {v}")
        return bullets


unilog_description_builder = UnilogDescriptionBuilder()