"""
Industrial Unit & Text Normalization Engine
Standardizes units of measurement and canonical technical terms without destroying source data
"""

import re
from typing import Optional, Tuple


class UnitNormalizer:
    # Pressure mappings to bar
    PRESSURE_FACTORS = {
        "bar": 1.0,
        "psi": 0.0689476,
        "mpa": 10.0,
        "kpa": 0.01,
        "pa": 0.00001,
    }

    # Weight mappings to kg
    WEIGHT_FACTORS = {
        "kg": 1.0,
        "g": 0.001,
        "lb": 0.453592,
        "lbs": 0.453592,
        "oz": 0.0283495,
    }

    # Length mappings to mm
    LENGTH_FACTORS = {
        "mm": 1.0,
        "cm": 10.0,
        "m": 1000.0,
        "inch": 25.4,
        "in": 25.4,
    }

    # Power mappings to kW
    POWER_FACTORS = {
        "kw": 1.0,
        "w": 0.001,
        "hp": 0.7457,
    }

    @classmethod
    def normalize_attribute(cls, key: str, value: str, unit: Optional[str] = None) -> Tuple[str, Optional[str]]:
        """
        Normalizes numeric values and units into canonical units.
        Returns: (normalized_value, normalized_unit)
        """
        if not value:
            return value, unit

        clean_val = value.strip().lower()
        clean_unit = (unit or "").strip().lower()

        # Extract embedded unit if unit param is empty
        if not clean_unit:
            for u in list(cls.PRESSURE_FACTORS.keys()) + list(cls.WEIGHT_FACTORS.keys()) + list(cls.LENGTH_FACTORS.keys()) + list(cls.POWER_FACTORS.keys()):
                if clean_val.endswith(u):
                    clean_unit = u
                    clean_val = clean_val[:-len(u)].strip()
                    break

        # Try to parse numeric value
        numeric_match = re.search(r"[-+]?\d*\.?\d+", clean_val)
        if not numeric_match:
            return value, unit

        try:
            num = float(numeric_match.group(0))
        except ValueError:
            return value, unit

        # Pressure
        if clean_unit in cls.PRESSURE_FACTORS:
            bar_val = round(num * cls.PRESSURE_FACTORS[clean_unit], 2)
            return str(bar_val), "bar"

        # Weight
        if clean_unit in cls.WEIGHT_FACTORS:
            kg_val = round(num * cls.WEIGHT_FACTORS[clean_unit], 2)
            return str(kg_val), "kg"

        # Length
        if clean_unit in cls.LENGTH_FACTORS:
            mm_val = round(num * cls.LENGTH_FACTORS[clean_unit], 2)
            return str(mm_val), "mm"

        # Power
        if clean_unit in cls.POWER_FACTORS:
            kw_val = round(num * cls.POWER_FACTORS[clean_unit], 2)
            return str(kw_val), "kW"

        # Temperature
        if "c" in clean_unit or "°c" in clean_unit:
            return clean_val, "°C"
        elif "f" in clean_unit or "°f" in clean_unit:
            c_val = round((num - 32) * 5.0 / 9.0, 1)
            return str(c_val), "°C"

        return value, unit


class TextNormalizer:
    MATERIAL_CANONICAL = {
        "ss": "Stainless Steel",
        "ss304": "Stainless Steel 304",
        "ss316": "Stainless Steel 316",
        "stainless steel": "Stainless Steel",
        "ci": "Cast Iron",
        "cast iron": "Cast Iron",
        "di": "Ductile Iron",
        "cs": "Carbon Steel",
        "carbon steel": "Carbon Steel",
        "al": "Aluminum",
        "brass": "Brass",
        "bronze": "Bronze",
    }

    @classmethod
    def normalize_material(cls, material_text: str) -> str:
        clean = material_text.strip().lower()
        return cls.MATERIAL_CANONICAL.get(clean, material_text.title())

    @classmethod
    def normalize_sku(cls, sku: str) -> str:
        return re.sub(r"[\s_]+", "-", sku.strip().upper())
