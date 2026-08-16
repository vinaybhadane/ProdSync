"""
Unilog Decimal to Fraction Conversion Engine
Implements the 63 exact fraction conversions (1/64 to 63/64) from Decimal_Fraction.xlsx
Converts industrial decimal dimensions (e.g. 50.25 in -> 50-1/4 in, 0.375 -> 3/8)
"""

import math
import re
from typing import Optional, Tuple


class DecimalFractionConverter:
    # 63 exact fractions from Decimal_Fraction.xlsx
    FRACTION_TABLE = [
        (0.015625, "1/64"), (0.031250, "1/32"), (0.046875, "3/64"), (0.062500, "1/16"),
        (0.078125, "5/64"), (0.093750, "3/32"), (0.109375, "7/64"), (0.125000, "1/8"),
        (0.140625, "9/64"), (0.156250, "5/32"), (0.171875, "11/64"), (0.187500, "3/16"),
        (0.203125, "13/64"), (0.218750, "7/32"), (0.234375, "15/64"), (0.250000, "1/4"),
        (0.265625, "17/64"), (0.281250, "9/32"), (0.296875, "19/64"), (0.312500, "5/16"),
        (0.328125, "21/64"), (0.343750, "11/32"), (0.359375, "23/64"), (0.375000, "3/8"),
        (0.390625, "25/64"), (0.406250, "13/32"), (0.421875, "27/64"), (0.437500, "7/16"),
        (0.453125, "29/64"), (0.468750, "15/32"), (0.484375, "31/64"), (0.500000, "1/2"),
        (0.515625, "33/64"), (0.531250, "17/32"), (0.546875, "35/64"), (0.562500, "9/16"),
        (0.578125, "37/64"), (0.593750, "19/32"), (0.609375, "39/64"), (0.625000, "5/8"),
        (0.640625, "41/64"), (0.656250, "21/32"), (0.671875, "43/64"), (0.687500, "11/16"),
        (0.703125, "45/64"), (0.718750, "23/32"), (0.734375, "47/64"), (0.750000, "3/4"),
        (0.765625, "49/64"), (0.781250, "25/32"), (0.796875, "51/64"), (0.812500, "13/16"),
        (0.828125, "53/64"), (0.843750, "27/32"), (0.859375, "55/64"), (0.875000, "7/8"),
        (0.890625, "57/64"), (0.906250, "29/32"), (0.921875, "59/64"), (0.937500, "15/16"),
        (0.953125, "61/64"), (0.968750, "31/32"), (0.984375, "63/64"),
    ]

    @classmethod
    def decimal_to_fraction(cls, decimal_val: float, tolerance: float = 0.01) -> Optional[str]:
        """
        Finds the closest matching standard 64th fraction for a decimal value between 0 and 1.
        """
        closest_frac = None
        min_diff = float("inf")

        for dec, frac_str in cls.FRACTION_TABLE:
            diff = abs(decimal_val - dec)
            if diff < min_diff:
                min_diff = diff
                closest_frac = frac_str

        if min_diff <= tolerance:
            return closest_frac
        return None

    @classmethod
    def format_dimension_fraction(cls, value_str: str) -> str:
        """
        Converts decimal dimensions to trade fractions:
        e.g. '50.25' -> '50-1/4', '0.5' -> '1/2', '24.0' -> '24', '50.25 in' -> '50-1/4 in'
        """
        if not value_str:
            return value_str

        # Match numbers with optional decimal part
        def _replace_num(match):
            full_num_str = match.group(0)
            try:
                num = float(full_num_str)
                whole = int(math.floor(num))
                fractional = num - whole

                if fractional < 0.005:
                    return str(whole) if "." in full_num_str else full_num_str

                frac_str = cls.decimal_to_fraction(fractional)
                if frac_str:
                    if whole > 0:
                        return f"{whole}-{frac_str}"
                    return frac_str
                return full_num_str
            except Exception:
                return full_num_str

        # Replace standalone decimal numbers (e.g. 50.25, 0.375, 24.125)
        converted = re.sub(r"\b\d+\.\d+\b", _replace_num, value_str)
        return converted


decimal_fraction_converter = DecimalFractionConverter()
