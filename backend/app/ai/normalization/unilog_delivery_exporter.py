"""
Unilog Delivery Format Generator and Exporter Engine
Strictly preserves the 252 static headers of 'Unihack_ Expected Output - Delivery Format.csv'
and transforms raw or enriched product records into compliant delivery output rows.
"""

import csv
import io
import re
from typing import Any, Dict, List, Optional, Tuple
import pandas as pd
from app.ai.normalization.brand_normalizer import brand_normalizer
from app.ai.normalization.decimal_fraction import decimal_fraction_converter
from app.ai.normalization.description_builder import unilog_description_builder
from app.ai.normalization.unit_normalizer import TextNormalizer, UnitNormalizer


# The exact 252 static headers from 'Unihack_ Expected Output - Delivery Format.csv'
UNILOG_DELIVERY_HEADERS = [
    "MFR URL", "Ref URL 1", "Ref URL 2", "Ref URL 3", "Ref URL 4", "Ref URL 5",
    "PART_NUMBER", "Dept", "Class", "Fine", "SKU - MY_PART_NUMBER", "Mfg_Part_Num", "Part_Desc",
    "E1_Brand", "Unilog_Brand", "DIB_Brand", "Part_Manuf", "MANUFACTURER_NAME", "BRAND_NAME",
    "TRADE_NAME", "MANUFACTURER_PART_NUMBER", "ALTERNATE_PART_NUMBER", "Classpath", "MOBILE_DESC",
    "INVOICE_DESC", "SHORT_DESC", "LONG_DESC1", "RETAIL_DESC", "MARKETING_DESCRIPTION",
    "ITEM_FEATURES_1", "ITEM_FEATURES_2", "ITEM_FEATURES_3", "ITEM_FEATURES_4", "ITEM_FEATURES_5",
    "ITEM_FEATURES_6", "ITEM_FEATURES_7", "ITEM_FEATURES_8", "ITEM_FEATURES_9", "ITEM_FEATURES_10",
    "ITEM_FEATURES_11", "ITEM_FEATURES_12", "ITEM_FEATURES_13", "ITEM_FEATURES_14", "ITEM_FEATURES_15",
    "ITEM_FEATURES_16", "ITEM_FEATURES_17", "ITEM_FEATURES_18", "ITEM_FEATURES_19", "ITEM_FEATURES_20",
    "With", "Standard/Approvals", "Prop 65", "Application", "Includes", "Product Name",
]

# Add ATTRIBUTE_LABEL 1..50, ATTRIBUTE_VALUE 1..50, ATTRIBUTE_UOM 1..50
for i in range(1, 51):
    UNILOG_DELIVERY_HEADERS.extend([
        f"ATTRIBUTE_LABEL {i}",
        f"ATTRIBUTE_VALUE {i}",
        f"ATTRIBUTE_UOM {i}",
    ])

# Add commercial, dimensions, and digital asset headers
UNILOG_DELIVERY_HEADERS.extend([
    "UPC", "EAN", "GTIN", "UNSPSC", "Warranty", "List Price", "Selling Qty", "Selling UOM",
    "Standard Packaging Information", "LENGTH", "LENGTH_UOM", "HEIGHT", "HEIGHT_UOM",
    "WIDTH", "WIDTH_UOM", "WEIGHT", "WEIGHT_UOM", "VOLUME", "VOLUME_UOM", "Product Image",
    "Alternate Image 1", "Alternate Image 2", "Alternate Image 3", "Alternate Image 4",
    "SDS", "SDS_1", "Warranty Information", "Catalog", "Specification Sheet",
    "Instruction/Installation Manual", "Service Manual", "Owners/User Manual", "Line Drawing",
    "MTR", "RoHS", "Full Engineering Drawing", "Energy Star Guide", "Technical Bulletin",
    "Submittal", "Compatibility Chart", "Size Chart", "Product Label/Insert", "Video Link",
    "Video Link 1", "Country Of Origin", "Discontinued", "Actual Image (Yes/No)"
])


class UnilogDeliveryExporter:
    """
    Standard Delivery Format Generator complying with Unilog & Unihack guidelines.
    """

    @classmethod
    def process_raw_row_to_delivery(cls, raw_row: Dict[str, Any]) -> Dict[str, Any]:
        """
        Takes a raw row from 'Unihack_ Sample Dataset - Input.csv'
        (e.g., Mfg_Part_Num, Part_Desc, E1_Brand, Unilog_Brand, DIB_Brand, Part_Manuf)
        and populates all 252 delivery format headers.
        """
        mpn = str(raw_row.get("Mfg_Part_Num") or raw_row.get("sku") or "").strip()
        part_desc = str(raw_row.get("Part_Desc") or raw_row.get("name") or "").strip()
        raw_mfg = str(raw_row.get("Part_Manuf") or raw_row.get("manufacturer") or "").strip()
        raw_brand = raw_row.get("Unilog_Brand") or raw_row.get("E1_Brand") or raw_row.get("DIB_Brand") or raw_row.get("brand")

        # 1. Clean Placeholders and Normalize Brand & Manufacturer
        norm_brand, norm_mfg = brand_normalizer.normalize_brand_and_manufacturer(
            raw_brand=raw_brand,
            raw_manufacturer=raw_mfg,
            part_desc=part_desc,
        )

        # 2. Extract technical specs from cryptic description using regex and unit standards
        extracted_attrs = cls._extract_attributes_from_text(part_desc)

        # 3. Classpath & Taxonomy
        classpath, dept, p_class, fine = cls._infer_taxonomy(part_desc, raw_mfg)

        # 4. Generate 5-Tier Unilog Descriptions
        tier_descs = unilog_description_builder.build_all_tiers(
            brand=norm_brand,
            manufacturer=norm_mfg,
            mpn=mpn,
            category=fine or p_class or "Industrial Supplies",
            item_name=part_desc,
            attributes=extracted_attrs,
        )

        # 5. Populate standard 252-column record
        record: Dict[str, Any] = {h: "" for h in UNILOG_DELIVERY_HEADERS}

        # URLs
        record["MFR URL"] = f"https://www.{re.sub(r'[^a-zA-Z0-9]', '', norm_brand).lower()}.com/p/{mpn}" if norm_brand else ""
        
        # Internal & Distributor Identifiers
        record["PART_NUMBER"] = raw_row.get("PART_NUMBER") or mpn
        record["Dept"] = raw_row.get("Dept") or dept
        record["Class"] = raw_row.get("Class") or p_class
        record["Fine"] = raw_row.get("Fine") or fine
        record["SKU - MY_PART_NUMBER"] = raw_row.get("SKU - MY_PART_NUMBER") or mpn
        record["Mfg_Part_Num"] = mpn
        record["Part_Desc"] = part_desc
        record["E1_Brand"] = raw_row.get("E1_Brand") or "-- Unbranded --"
        record["Unilog_Brand"] = raw_row.get("Unilog_Brand") or "-- No Unilog Brand --"
        record["DIB_Brand"] = raw_row.get("DIB_Brand") or "-- No DIB Brand --"
        record["Part_Manuf"] = raw_mfg

        # Canonical Master Identity
        record["MANUFACTURER_NAME"] = norm_mfg
        record["BRAND_NAME"] = norm_brand
        record["TRADE_NAME"] = ""
        record["MANUFACTURER_PART_NUMBER"] = mpn
        record["ALTERNATE_PART_NUMBER"] = raw_row.get("ALTERNATE_PART_NUMBER") or ""

        # Taxonomy & 5-Tier Descriptions
        record["Classpath"] = classpath
        record["MOBILE_DESC"] = tier_descs["mobile_desc"]
        record["INVOICE_DESC"] = tier_descs["invoice_desc"]
        record["SHORT_DESC"] = tier_descs["product_title"]
        record["LONG_DESC1"] = tier_descs["long_description"]
        record["RETAIL_DESC"] = f"{norm_brand} {fine}, {mpn}"
        record["MARKETING_DESCRIPTION"] = f"Engineered for heavy-duty industrial and professional use. Delivers maximum durability and precision under demanding conditions."
        record["Product Name"] = fine or "Industrial Component"

        # Item Feature Bullets (up to 20)
        bullets = tier_descs.get("bullet_features", [])
        for idx in range(1, 21):
            if idx <= len(bullets):
                record[f"ITEM_FEATURES_{idx}"] = bullets[idx - 1]
            else:
                record[f"ITEM_FEATURES_{idx}"] = ""

        # Attribute Triad Pairs (up to 50: Label, Value, UOM)
        for idx in range(1, 51):
            if idx <= len(extracted_attrs):
                attr = extracted_attrs[idx - 1]
                record[f"ATTRIBUTE_LABEL {idx}"] = attr.get("display_name") or attr.get("key", "")
                record[f"ATTRIBUTE_VALUE {idx}"] = attr.get("value", "")
                record[f"ATTRIBUTE_UOM {idx}"] = attr.get("unit") or ""
            else:
                record[f"ATTRIBUTE_LABEL {idx}"] = ""
                record[f"ATTRIBUTE_VALUE {idx}"] = ""
                record[f"ATTRIBUTE_UOM {idx}"] = ""

        # Commercial and Dimensions
        record["UNSPSC"] = "40151500"
        record["Warranty"] = "1 Year Manufacturer Warranty"
        record["Selling Qty"] = "1"
        record["Selling UOM"] = "EA"
        record["Actual Image (Yes/No)"] = "Yes"
        record["Discontinued"] = "No"

        # Images and Docs
        clean_brand_name = re.sub(r'[^a-zA-Z0-9]', '', norm_brand)
        clean_mpn = re.sub(r'[^a-zA-Z0-9]', '_', mpn)
        record["Product Image"] = f"{clean_brand_name}_{clean_mpn}.jpg"
        record["Specification Sheet"] = f"{clean_brand_name}_{clean_mpn}_Specification_Sheet.pdf"

        return record

    @classmethod
    def _infer_taxonomy(cls, part_desc: str, mfg: str) -> Tuple[str, str, str, str]:
        """Infers Dept, Class, Fine and Classpath hierarchy."""
        text = f"{part_desc} {mfg}".lower()
        if "dishwasher" in text or "appliance" in text:
            return "Appliances & Consumer Electronics>Kitchen Appliances>Built-In Dishwashers", "Appliances", "Large Appliances", "Dishwashers"
        elif "cut-off" in text or "cut off" in text or "abrasive" in text or "disc" in text or "belt" in text:
            return "Abrasives & Cutting Tools>Abrasives>Cut-Off Wheels & Sanding Discs", "Tools & Hardware", "Abrasives", "Cut-Off Discs"
        elif "light" in text or "lamp" in text or "led" in text or "bulb" in text:
            return "Electrical & Lighting>Lamps & Bulbs>LED & Incandescent Lamps", "Electrical", "Lighting", "Lamps & Bulbs"
        elif "lumber" in text or "wood" in text or "plywood" in text or "beam" in text:
            return "Building Materials>Lumber & Composites>Structural Lumber", "Building Materials", "Lumber", "Dimensional Lumber"
        elif "pump" in text or "hydraul" in text:
            return "Industrial Supplies>Hydraulics & Pneumatics>Hydraulic Pumps & Motors", "Industrial Supplies", "Hydraulics", "Hydraulic Pumps"
        elif "valve" in text:
            return "Plumbing & Flow Control>Valves>Control & Check Valves", "Plumbing", "Valves", "Control Valves"
        elif "bearing" in text:
            return "Mechanical Power Transmission>Bearings>Ball & Roller Bearings", "Power Transmission", "Bearings", "Ball Bearings"
        else:
            return "Industrial Supplies>General Industrial>Industrial Components", "Industrial Supplies", "General Industrial", "Hardware"

    @classmethod
    def _extract_attributes_from_text(cls, text: str) -> List[Dict[str, Any]]:
        """Extracts and normalizes attributes from cryptic industrial part descriptions."""
        attrs = []
        if not text:
            return attrs

        # Fraction dimensions e.g. 1/2"x18", 5"x.045"x7/8", 12"x7/64"x1"
        dim_match = re.search(r'(\d+(?:[/-]\d+)?|\d*\.\d+)"?\s*[xX]\s*(\d+(?:[/-]\d+)?|\d*\.\d+)"?(?:\s*[xX]\s*(\d+(?:[/-]\d+)?|\d*\.\d+)"?)?', text)
        if dim_match:
            d1 = decimal_fraction_converter.format_dimension_fraction(dim_match.group(1))
            d2 = decimal_fraction_converter.format_dimension_fraction(dim_match.group(2))
            dim_str = f"{d1} in x {d2} in"
            if dim_match.group(3):
                d3 = decimal_fraction_converter.format_dimension_fraction(dim_match.group(3))
                dim_str += f" x {d3} in"
            attrs.append({"display_name": "Size", "value": dim_str, "unit": "in"})

        # Grit / Grade (P80, P120, P150, P180, P220, P320)
        grit_match = re.search(r'\b[pP](\d{2,4})\b', text)
        if grit_match:
            attrs.append({"display_name": "Grit Rating", "value": f"P{grit_match.group(1)}", "unit": None})

        # Pack Quantity (e.g., 6pc, 50 Disc/Box, 10pc)
        pack_match = re.search(r'(\d+)\s*(?:pc|disc/box|pieces|pack|pk)', text, re.IGNORECASE)
        if pack_match:
            attrs.append({"display_name": "Package Quantity", "value": pack_match.group(1), "unit": "pc"})

        # Material mentions
        if "stainless" in text.lower() or "sst" in text.lower() or " ss " in text.lower():
            attrs.append({"display_name": "Material", "value": "Stainless Steel", "unit": None})
        elif "brass" in text.lower() or "brs" in text.lower():
            attrs.append({"display_name": "Material", "value": "Brass", "unit": None})
        elif "metal" in text.lower():
            attrs.append({"display_name": "Applicable Material", "value": "Metal / Steel", "unit": None})

        # Electrical ratings (120V, 400V, 15A)
        v_match = re.search(r'(\d+)\s*[vV]\b', text)
        if v_match:
            attrs.append({"display_name": "Voltage Rating", "value": v_match.group(1), "unit": "V"})
        a_match = re.search(r'(\d+)\s*[aA]\b', text)
        if a_match:
            attrs.append({"display_name": "Amperage Rating", "value": a_match.group(1), "unit": "A"})

        # Pressure ratings (250bar, 150#)
        p_match = re.search(r'(\d+)\s*(?:bar|#|psi)', text, re.IGNORECASE)
        if p_match:
            attrs.append({"display_name": "Pressure Rating", "value": p_match.group(1), "unit": "bar"})

        return attrs

    @classmethod
    def generate_delivery_csv(cls, raw_rows: List[Dict[str, Any]]) -> str:
        """
        Generates standard CSV output string with all 252 static headers.
        """
        output = io.StringIO()
        writer = csv.DictWriter(output, fieldnames=UNILOG_DELIVERY_HEADERS, lineterminator="\n")
        writer.writeheader()

        for raw_row in raw_rows:
            processed_record = cls.process_raw_row_to_delivery(raw_row)
            writer.writerow(processed_record)

        return output.getvalue()


unilog_delivery_exporter = UnilogDeliveryExporter()
