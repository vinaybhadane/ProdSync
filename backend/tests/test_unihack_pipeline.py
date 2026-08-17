"""
UniHack 2026 Compliance Test Suite
Tests:
  1. Authoritative Manufacturer Sourcing & Prohibited Marketplace Filtering
  2. Leaf-Level Taxonomy Classification (Taxonomy ID, Classpath)
  3. List of Values (LOV) Validation & NEW_VALUE Discovery
  4. 5-Tier Standardized Unilog Descriptions & Marketing Copy Preservation
  5. Field-Level Provenance & Multi-Source Conflict Detection
  6. 252-Column Unilog Delivery Exporter (CSV, XLSX, JSON)
"""

import pytest
import io
import csv
from app.services.manufacturer_lookup_engine import manufacturer_lookup_engine
from app.ai.taxonomy.taxonomy_engine import taxonomy_engine
from app.ai.validation.lov_engine import lov_engine
from app.ai.validation.provenance_tracker import provenance_tracker
from app.ai.normalization.description_builder import unilog_description_builder
from app.ai.normalization.unilog_delivery_exporter import unilog_delivery_exporter, UNILOG_DELIVERY_HEADERS


def test_prohibited_marketplace_filtering():
    """Verify that generic shopping marketplaces are strictly prohibited."""
    assert manufacturer_lookup_engine.is_prohibited_domain("https://www.amazon.com/dp/B08N5WRWNW") is True
    assert manufacturer_lookup_engine.is_prohibited_domain("https://www.ebay.com/itm/123456") is True
    assert manufacturer_lookup_engine.is_prohibited_domain("https://www.walmart.com/ip/contactor/98765") is True
    assert manufacturer_lookup_engine.is_prohibited_domain("https://www.aliexpress.com/item/40012.html") is True
    assert manufacturer_lookup_engine.is_prohibited_domain("https://www.se.com/us/en/product/LC1D09M7") is False
    assert manufacturer_lookup_engine.is_prohibited_domain("https://www.digikey.com/en/products/detail/123") is False


def test_source_domain_classification():
    """Verify classification priority: Manufacturer (Priority 1) vs Distributor (Priority 2)."""
    # Schneider Electric official domain
    stype, sname, rel = manufacturer_lookup_engine.classify_source_domain(
        "https://www.se.com/us/en/product/LC1D09M7", "Schneider Electric"
    )
    assert stype == "manufacturer"
    assert rel == "high"

    # DigiKey distributor
    stype, sname, rel = manufacturer_lookup_engine.classify_source_domain(
        "https://www.digikey.com/en/products/detail/schneider-electric/LC1D09M7/1234", "Schneider Electric"
    )
    assert stype == "distributor"
    assert "DigiKey" in sname

    # Prohibited marketplace
    stype, sname, rel = manufacturer_lookup_engine.classify_source_domain(
        "https://www.amazon.com/Schneider-Electric-LC1D09M7/dp/B000", "Schneider Electric"
    )
    assert stype == "prohibited"


def test_leaf_taxonomy_classification():
    """Verify classification reaches specific leaf categories with Taxonomy IDs and Classpaths."""
    # Test Contactor -> Magnetic Contactors
    res = taxonomy_engine.classify_product(
        name="TeSys D Contactor 3P AC-3 440V 9A 220V AC coil",
        manufacturer="Schneider Electric",
        mpn="LC1D09M7",
    )
    assert res["leaf_category"] == "Magnetic Contactors"
    assert res["taxonomy_id"] == "120441"
    assert "Contactors" in res["classpath"]
    assert "Voltage Rating" in res["required_attributes"]
    assert res["confidence"] >= 0.85

    # Test Cut-Off Disc -> Cut-Off Discs
    res2 = taxonomy_engine.classify_product(
        name="Diablo 12x20mm Speed Demon Metal Cut-Off Disc",
        manufacturer="Freud Inc (2435)",
        mpn="DBDS12125G01F",
    )
    assert res2["leaf_category"] == "Cut-Off Discs"
    assert res2["taxonomy_id"] == "301882"
    assert "Abrasives" in res2["classpath"]

    # Test Dishwasher -> Built-In Dishwashers
    res3 = taxonomy_engine.classify_product(
        name="Frigidaire Professional Series Dishwasher Stainless Steel",
        manufacturer="Rheem Manufacturing",
        mpn="PDSH4816AF",
    )
    assert res3["leaf_category"] == "Built-In Dishwashers"
    assert res3["taxonomy_id"] == "1515863"


def test_lov_validation_and_new_value_discovery():
    """Verify standard LOV matching and NEW_VALUE detection without force-fitting."""
    # 1. Exact LOV match -> VALID
    res_valid = lov_engine.validate_attribute_lov("Mounting Type", "DIN Rail")
    assert res_valid["status"] == "VALID"
    assert res_valid["is_new_value"] is False

    # 2. Material LOV match -> VALID
    res_mat = lov_engine.validate_attribute_lov("Material", "Stainless Steel")
    assert res_mat["status"] == "VALID"

    # 3. New valid value outside standard LOV -> NEW_VALUE
    res_new = lov_engine.validate_attribute_lov("Mounting Type", "Custom Heavy-Duty Flange Bracket")
    assert res_new["status"] == "NEW_VALUE"
    assert res_new["is_new_value"] is True
    assert "outside standard LOV" in res_new["reason"]

    # 4. Missing value -> MISSING
    res_missing = lov_engine.validate_attribute_lov("Voltage Rating", "")
    assert res_missing["status"] == "MISSING"


def test_five_tier_descriptions_and_marketing_preservation():
    """Verify the 5 standardized description tiers and marketing content preservation."""
    attrs = [
        {"display_name": "Voltage Rating", "value": "120", "unit": "V"},
        {"display_name": "Amperage Rating", "value": "15", "unit": "A"},
        {"display_name": "Mounting Type", "value": "Built-in", "unit": None},
        {"display_name": "Sound Level", "value": "41", "unit": "dBA"},
    ]

    tier_res = unilog_description_builder.build_all_tiers(
        brand="Whirlpool®",
        manufacturer="Whirlpool Corporation",
        mpn="WDTS7024RZ",
        category="Built-In Dishwashers",
        item_name="Eco Series Dishwasher Built-in Mounting Stainless Steel",
        attributes=attrs,
        series="Eco Series",
        raw_marketing_desc="Original manufacturer marketing copy describing quiet 41 dBA operation.",
    )

    # 1. Mobile Description (60–80 chars)
    assert 60 <= len(tier_res["mobile_desc"]) <= 80
    assert "Whirlpool" in tier_res["mobile_desc"]

    # 2. Invoice Description (≤40 chars, ALL CAPS)
    assert len(tier_res["invoice_desc"]) <= 40
    assert tier_res["invoice_desc"].isupper()

    # 3. Short Description / Product Title
    assert len(tier_res["short_desc"]) > 0
    assert "Whirlpool®" in tier_res["short_desc"]

    # 4. Long Description
    assert len(tier_res["long_description"]) > 0
    assert "120 V" in tier_res["long_description"] or "15 A" in tier_res["long_description"]

    # 5. Retail Description
    assert len(tier_res["retail_desc"]) > 0
    assert "WDTS7024RZ" in tier_res["retail_desc"]

    # 6. Preserved Manufacturer Marketing Copy
    assert "Original manufacturer marketing copy" in tier_res["marketing_description"]


def test_conflict_detection_across_sources():
    """Verify that conflicting values across multiple sources are accurately flagged."""
    source_obs = [
        {
            "display_name": "Voltage Rating",
            "value": "120 V",
            "unit": "V",
            "source_name": "Manufacturer Official Product Page",
            "source_type": "manufacturer",
        },
        {
            "display_name": "Voltage Rating",
            "value": "240 V",
            "unit": "V",
            "source_name": "Distributor Catalog Spec Sheet",
            "source_type": "distributor",
        }
    ]

    conflict = provenance_tracker.detect_conflicts("voltage_rating", source_obs)
    assert conflict is not None
    assert conflict["severity"] == "critical"
    assert conflict["source_a_value"] == "120 V"
    assert conflict["source_b_value"] == "240 V"
    assert "Manufacturer" in conflict["source_a_priority"]


def test_252_column_unilog_delivery_export():
    """Verify that the delivery exporter creates exact 252 static headers matching Unihack delivery format."""
    assert len(UNILOG_DELIVERY_HEADERS) == 252
    assert "MFR URL" in UNILOG_DELIVERY_HEADERS
    assert "ATTRIBUTE_LABEL 1" in UNILOG_DELIVERY_HEADERS
    assert "ATTRIBUTE_VALUE 50" in UNILOG_DELIVERY_HEADERS
    assert "ITEM_FEATURES_20" in UNILOG_DELIVERY_HEADERS
    assert "Actual Image (Yes/No)" in UNILOG_DELIVERY_HEADERS

    sample_row = {
        "Mfg_Part_Num": "LC1D09M7",
        "Part_Desc": "TeSys D Contactor 3P 9A 220V AC",
        "Part_Manuf": "Schneider Electric",
        "Unilog_Brand": "Schneider Electric",
    }
    csv_str = unilog_delivery_exporter.generate_delivery_csv([sample_row])
    reader = csv.reader(io.StringIO(csv_str))
    header_row = next(reader)
    data_row = next(reader)

    assert len(header_row) == 252
    assert len(data_row) == 252
    assert header_row[0] == "MFR URL"
    assert "LC1D09M7" in data_row[header_row.index("Mfg_Part_Num")]
