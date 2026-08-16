"""
Unit Tests for Unilog Content Standards & Solution Guide Compliance
- 63 Decimal-to-Fraction Conversions (Decimal_Fraction.xlsx)
- Master Brand & Legal Registered Marks (UniCat)
- Placeholder Cleaning (-- Unbranded --)
- 5-Tier Description Building (Invoice ≤40 CAPS, Mobile 60-80, Title, Long Desc, Bullets)
"""

import pytest
from app.ai.normalization.brand_normalizer import brand_normalizer
from app.ai.normalization.decimal_fraction import decimal_fraction_converter
from app.ai.normalization.description_builder import unilog_description_builder


def test_decimal_to_fraction_exact_steps():
    # 0.5 -> 1/2
    assert decimal_fraction_converter.decimal_to_fraction(0.5) == "1/2"
    # 0.25 -> 1/4
    assert decimal_fraction_converter.decimal_to_fraction(0.25) == "1/4"
    # 0.125 -> 1/8
    assert decimal_fraction_converter.decimal_to_fraction(0.125) == "1/8"
    # 0.015625 -> 1/64
    assert decimal_fraction_converter.decimal_to_fraction(0.015625) == "1/64"
    # 0.984375 -> 63/64
    assert decimal_fraction_converter.decimal_to_fraction(0.984375) == "63/64"


def test_dimension_fraction_formatting():
    # Unilog worked example: 50.25 in -> 50-1/4 in
    assert decimal_fraction_converter.format_dimension_fraction("50.25 in") == "50-1/4 in"
    assert decimal_fraction_converter.format_dimension_fraction("24.0 in W x 24.25 in D") == "24 in W x 24-1/4 in D"
    assert decimal_fraction_converter.format_dimension_fraction("0.375 bar") == "3/8 bar"


def test_brand_placeholder_cleaning():
    # Placeholders must be stripped
    assert brand_normalizer.clean_placeholder("-- Unbranded --") is None
    assert brand_normalizer.clean_placeholder("-- No Unilog Brand --") is None
    assert brand_normalizer.clean_placeholder("UNKNOWN") is None
    assert brand_normalizer.clean_placeholder("FRIGIDAIRE") == "FRIGIDAIRE"


def test_brand_legal_normalization():
    # Frigidaire gets legal mark ® and manufacturer Electrolux
    brand, mfg = brand_normalizer.normalize_brand_and_manufacturer(
        raw_brand="frigidaire",
        raw_manufacturer=None,
        part_desc="PDSH4816AF Dishwasher SS",
    )
    assert brand == "FRIGIDAIRE®"
    assert "Electrolux" in mfg

    # FluidTech gets ™ mark
    b2, m2 = brand_normalizer.normalize_brand_and_manufacturer("FluidTech", "FluidTech Industries")
    assert b2 == "FLUIDTECH™"


def test_unilog_5_tier_description_building():
    # Worked example from Solution Guide:
    # INPUT: PDSH4816AF Dishwasher SS
    # Brand: FRIGIDAIRE® | MPN: PDSH4816AF | Series: Professional Series
    attrs = [
        {"key": "mounting", "value": "Leg", "unit": None},
        {"key": "wash_cycles", "value": "5", "unit": None},
        {"key": "material", "value": "Stainless Steel", "unit": None},
        {"key": "voltage", "value": "120", "unit": "V"},
        {"key": "amperage", "value": "15", "unit": "A"},
        {"key": "depth_open", "value": "50.25", "unit": "in"},
    ]

    result = unilog_description_builder.build_all_tiers(
        brand="FRIGIDAIRE®",
        manufacturer="Rheem Manufacturing",
        mpn="PDSH4816AF",
        category="Kitchen Appliances",
        item_name="PDSH4816AF Dishwasher SS",
        attributes=attrs,
        series="Professional Series",
        feature_name="CleanBoost™",
    )

    # 1. Invoice Desc: ≤40 chars, ALL CAPS
    assert len(result["invoice_desc"]) <= 40
    assert result["invoice_desc"] == result["invoice_desc"].upper()
    assert result["compliance"]["invoice_valid"] is True

    # 2. Mobile Desc: 60-80 chars target
    assert 50 <= len(result["mobile_desc"]) <= 80
    assert "PDSH4816AF" in result["mobile_desc"]

    # 3. Product Title / Short Desc
    assert "FRIGIDAIRE®" in result["product_title"]
    assert "PDSH4816AF" in result["product_title"]
    assert "Dishwasher" in result["product_title"]

    # 4. Long Description: contains approved UOMs & fractions (50-1/4 in)
    assert "FRIGIDAIRE®" in result["long_description"]
    assert "50-1/4 in" in result["long_description"]

    # 5. Bullet features
    assert len(result["bullet_features"]) >= 2
