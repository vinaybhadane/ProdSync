"""
Unilog Master Brand & Manufacturer Normalization Registry
Cleans placeholders (-- Unbranded --, -- No Unilog Brand --) and enriches canonical brands with legal marks (®, ™)
"""

import re
from typing import Optional, Tuple


class BrandNormalizer:
    # Common Unilog placeholder strings that must be treated as empty
    PLACEHOLDERS = {
        "-- unbranded --",
        "-- no unilog brand --",
        "-- no dib brand --",
        "-- no brand --",
        "-- none --",
        "unbranded",
        "no brand",
        "unknown",
        "n/a",
        "na",
        "none",
        "generic",
        "--",
        "-",
    }

    CANONICAL_BRANDS = {
        "frigidaire": ("FRIGIDAIRE®", "Electrolux Home Products, Inc."),
        "whirlpool": ("Whirlpool®", "Whirlpool Corporation"),
        "rheem": ("RHEEM®", "Rheem Manufacturing Company"),
        "diablo": ("Diablo®", "Freud America, Inc."),
        "freud": ("Freud®", "Freud America, Inc."),
        "milwaukee": ("MILWAUKEE®", "Milwaukee Electric Tool Corporation"),
        "milw": ("MILWAUKEE®", "Milwaukee Electric Tool Corporation"),
        "dewalt": ("DEWALT®", "Stanley Black & Decker, Inc."),
        "black & decker": ("BLACK+DECKER®", "Stanley Black & Decker, Inc."),
        "3m": ("3M™", "3M Company"),
        "cubitron": ("3M™", "3M Company"),
        "stikit": ("3M™", "3M Company"),
        "mirka": ("Mirka®", "Mirka USA Inc."),
        "abranet": ("Mirka®", "Mirka USA Inc."),
        "hiolit": ("Mirka®", "Mirka USA Inc."),
        "philips": ("PHILIPS®", "Signify North America Corporation"),
        "phillips": ("PHILIPS®", "Signify North America Corporation"),
        "kichler": ("KICHLER®", "Kichler Lighting LLC"),
        "boise cascade": ("BOISE CASCADE®", "Boise Cascade Company"),
        "satco": ("SATCO®", "Satco Products, Inc."),
        "nuvo": ("NUVO®", "Satco Products, Inc."),
        "fluidtech": ("FLUIDTECH™", "FluidTech Industries, Inc."),
        "valvemaster": ("VALVEMASTER™", "ValveMaster Control Systems LLC"),
        "bosch": ("BOSCH®", "Robert Bosch Tool Corporation"),
        "square d": ("SQUARE D®", "Schneider Electric SE"),
        "eaton": ("EATON™", "Eaton Corporation plc"),
        "parker": ("PARKER HANNIFIN®", "Parker Hannifin Corporation"),
        "parker hannifin": ("PARKER HANNIFIN®", "Parker Hannifin Corporation"),
        "skf": ("SKF®", "AB SKF"),
        "timken": ("TIMKEN®", "The Timken Company"),
        "baldor": ("BALDOR®", "ABB Motors and Mechanical Inc."),
        "moen": ("MOEN®", "Moen Incorporated"),
        "kohler": ("KOHLER®", "Kohler Co."),
        "delta": ("DELTA®", "Delta Faucet Company"),
    }

    @classmethod
    def clean_placeholder(cls, value: Optional[str]) -> Optional[str]:
        """Returns None if the value is a known empty placeholder."""
        if not value:
            return None
        clean = value.strip().lower()
        if clean in cls.PLACEHOLDERS or clean.startswith("--"):
            return None
        return value.strip()

    @classmethod
    def normalize_brand_and_manufacturer(
        cls,
        raw_brand: Optional[str],
        raw_manufacturer: Optional[str],
        part_desc: Optional[str] = None,
    ) -> Tuple[str, str]:
        """
        Normalizes brand and manufacturer strings:
        1. Strips placeholders.
        2. Detects brand in part description if missing.
        3. Assigns canonical brand with legal mark (®/™) and manufacturer.
        4. If brand is missing, uses manufacturer as brand name.
        """
        brand = cls.clean_placeholder(raw_brand)
        manufacturer = cls.clean_placeholder(raw_manufacturer)

        # Check part description for brand mentions if brand is empty
        if not brand and part_desc:
            desc_lower = part_desc.lower()
            for key, (canon_brand, canon_mfg) in cls.CANONICAL_BRANDS.items():
                if key in desc_lower:
                    brand = canon_brand
                    if not manufacturer:
                        manufacturer = canon_mfg
                    break

        # Match known canonical brands
        if brand:
            brand_key = brand.lower().replace("®", "").replace("™", "").strip()
            if brand_key in cls.CANONICAL_BRANDS:
                canon_brand, canon_mfg = cls.CANONICAL_BRANDS[brand_key]
                brand = canon_brand
                if not manufacturer:
                    manufacturer = canon_mfg

        if manufacturer:
            mfg_key = manufacturer.lower().replace("®", "").replace("™", "").strip()
            if mfg_key in cls.CANONICAL_BRANDS:
                canon_brand, canon_mfg = cls.CANONICAL_BRANDS[mfg_key]
                manufacturer = canon_mfg
                if not brand:
                    brand = canon_brand

        # Fallback: if no brand, use manufacturer
        if not brand and manufacturer:
            brand = manufacturer
        elif not manufacturer and brand:
            manufacturer = brand
        elif not brand and not manufacturer:
            brand = "Industrial Standard"
            manufacturer = "Industrial Manufacturer"

        return brand, manufacturer


brand_normalizer = BrandNormalizer()
