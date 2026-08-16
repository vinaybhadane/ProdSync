"""
Sample Data Generator for ProdSync Testing
Generates realistic industrial CSVs, JSONs, and PDF datasheets.
"""

import os
import json
import pandas as pd
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "sample_data")
os.makedirs(OUTPUT_DIR, exist_ok=True)


def create_csv_sample():
    csv_path = os.path.join(OUTPUT_DIR, "industrial_products_catalog.csv")
    products = [
        {
            "sku": "HP-4500",
            "name": "Industrial Hydraulic Pump HP-4500",
            "manufacturer": "FluidTech Industries",
            "category": "Hydraulic Equipment",
            "operating_pressure": "250 bar",
            "flow_rate": "120 L/min",
            "power_rating": "45 kW",
            "material": "Stainless Steel 316",
            "weight": "18.5 kg",
            "voltage": "400 V",
            "ip_rating": "IP65",
            "operating_temp": "-20°C to 80°C"
        },
        {
            "sku": "PCV-200",
            "name": "Pressure Control Valve PCV-200",
            "manufacturer": "ValveMaster Corp",
            "category": "Control Valves",
            "operating_pressure": "200 bar",
            "flow_rate": "45 L/min",
            "power_rating": "1.5 kW",
            "material": "Forged Brass",
            "weight": "4.2 kg",
            "voltage": "24 V DC",
            "ip_rating": "IP67",
            "operating_temp": "-10°C to 60°C"
        },
        {
            "sku": "VFD-750",
            "name": "Variable Frequency Drive VFD-750",
            "manufacturer": "ElectroDrive Systems",
            "category": "Electric Motors & Drives",
            "operating_pressure": "N/A",
            "flow_rate": "N/A",
            "power_rating": "75 kW",
            "material": "Aluminum / Polycarbonate",
            "weight": "28 lbs",
            "voltage": "480 V AC",
            "ip_rating": "IP54",
            "operating_temp": "-10°C to 50°C"
        },
        {
            "sku": "CYL-80-500",
            "name": "Heavy Duty Hydraulic Cylinder CYL-80",
            "manufacturer": "HydroPneumatic Ltd",
            "category": "Hydraulic Equipment",
            "operating_pressure": "3000 psi",
            "flow_rate": "80 L/min",
            "power_rating": "N/A",
            "material": "Chrome-Plated Carbon Steel",
            "weight": "62 kg",
            "voltage": "N/A",
            "ip_rating": "IP68",
            "operating_temp": "-30°C to 90°C"
        },
        {
            "sku": "BRG-6208-2RS",
            "name": "Deep Groove Ball Bearing 6208-2RS",
            "manufacturer": "Apex Bearings",
            "category": "Bearings & Seals",
            "operating_pressure": "N/A",
            "flow_rate": "N/A",
            "power_rating": "N/A",
            "material": "High-Carbon Chromium Steel",
            "weight": "0.36 kg",
            "voltage": "N/A",
            "ip_rating": "Sealed (2RS)",
            "operating_temp": "-30°C to 120°C"
        }
    ]
    df = pd.DataFrame(products)
    df.to_csv(csv_path, index=False)
    print(f"Created CSV sample: {csv_path}")


def create_json_sample():
    json_path = os.path.join(OUTPUT_DIR, "industrial_products_catalog.json")
    data = {
        "catalog_name": "FluidTech Q3 2026 Industrial Catalog",
        "version": "2.4",
        "products": [
            {
                "sku": "HP-4500-HD",
                "name": "Heavy Duty Industrial Hydraulic Pump HP-4500",
                "manufacturer": "FluidTech Industries",
                "category": "Hydraulic Equipment",
                "description": "High-pressure industrial hydraulic pump engineered for continuous 24/7 heavy manufacturing operation.",
                "attributes": {
                    "operating_pressure": "250 bar",
                    "max_intermittent_pressure": "280 bar",
                    "flow_rate": "120 L/min",
                    "displacement": "65 cm3/rev",
                    "speed_range": "500 - 3000 RPM",
                    "power": "45 kW",
                    "material": "Stainless Steel 316",
                    "shaft_diameter": "32 mm",
                    "weight": "18.5 kg",
                    "mounting": "SAE-B 2-Bolt Flange"
                }
            },
            {
                "sku": "PCV-200-PROP",
                "name": "Proportional Pressure Control Valve PCV-200",
                "manufacturer": "ValveMaster Corp",
                "category": "Control Valves",
                "description": "Direct-operated proportional pressure relief valve with integrated digital electronics.",
                "attributes": {
                    "max_operating_pressure": "200 bar",
                    "nominal_flow": "45 L/min",
                    "supply_voltage": "24 V DC",
                    "control_signal": "4-20 mA",
                    "connection_size": "G 1/2 BSPP",
                    "seal_material": "FKM (Viton)",
                    "weight": "4.2 kg"
                }
            }
        ]
    }
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
    print(f"Created JSON sample: {json_path}")


def create_pdf_datasheet(filename, title, sku, specs, conflict_note=None):
    pdf_path = os.path.join(OUTPUT_DIR, filename)
    doc = SimpleDocTemplate(pdf_path, pagesize=letter, leftMargin=40, rightMargin=40, topMargin=40, bottomMargin=40)
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#0f172a'),
        spaceAfter=10
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Heading3'],
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#2563eb'),
        spaceAfter=15
    )

    body_style = ParagraphStyle(
        'DocBody',
        parent=styles['Normal'],
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#334155'),
        spaceAfter=12
    )

    elements = []
    elements.append(Paragraph(title, title_style))
    elements.append(Paragraph(f"TECHNICAL SPECIFICATION & DATASHEET — MODEL: <b>{sku}</b>", subtitle_style))
    elements.append(Spacer(1, 10))
    
    elements.append(Paragraph(
        "<b>Product Overview:</b> This industrial-grade component is engineered and manufactured to ISO 9001 and CE compliance standards. "
        "Designed for harsh environmental operating conditions in heavy hydraulic and mechanical automated systems.",
        body_style
    ))
    elements.append(Spacer(1, 10))

    # Technical specifications table
    table_data = [["Technical Parameter", "Specification", "Standard / Unit", "Tolerance"]]
    for k, v, u, t in specs:
        table_data.append([k, v, u, t])

    t = Table(table_data, colWidths=[180, 140, 110, 100])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1e293b')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
        ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f8fafc')),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 9),
        ('PADDING', (0, 0), (-1, -1), 6),
    ]))
    elements.append(t)
    elements.append(Spacer(1, 20))

    if conflict_note:
        elements.append(Paragraph(f"<b>Notice:</b> {conflict_note}", body_style))

    doc.build(elements)
    print(f"Created PDF datasheet: {pdf_path}")


if __name__ == "__main__":
    create_csv_sample()
    create_json_sample()
    
    # PDF 1: FluidTech HP-4500
    create_pdf_datasheet(
        filename="fluidtech_hp4500_datasheet.pdf",
        title="FluidTech Industries — HP-4500 Hydraulic Pump",
        sku="HP-4500-HD",
        specs=[
            ["Operating Pressure", "250", "bar", "±2%"],
            ["Max Intermittent Pressure", "280", "bar", "Peak max"],
            ["Rated Flow Rate", "120", "L/min", "at 1500 RPM"],
            ["Displacement", "65", "cm³/rev", "Nominal"],
            ["Shaft Power", "45", "kW", "Rated continuous"],
            ["Body Material", "Stainless Steel 316", "AISI Grade", "Cast"],
            ["Supply Voltage", "400", "V AC (3-Phase)", "50/60 Hz"],
            ["Enclosure Protection", "IP65", "IEC 60529", "Standard"],
            ["Net Weight", "18.5", "kg", "Dry weight"],
            ["Fluid Viscosity Range", "10 to 300", "mm²/s (cSt)", "ISO VG 46"]
        ]
    )

    # PDF 2: ValveMaster PCV-200
    create_pdf_datasheet(
        filename="valvemaster_pcv200_datasheet.pdf",
        title="ValveMaster Corp — PCV-200 Pressure Control Valve",
        sku="PCV-200",
        specs=[
            ["Max Regulating Pressure", "200", "bar", "±1.5%"],
            ["Continuous Operating Pressure", "10", "bar", "Nominal (Datasheet A)"],
            ["Nominal Flow Rate", "45", "L/min", "at Δp=5 bar"],
            ["Connection Port Size", "DN50 (G 1/2 BSPP)", "ISO 228-1", "Standard"],
            ["Electrical Control Signal", "4 - 20", "mA", "Proportional"],
            ["Body Material", "Forged Brass CW617N", "EN 12165", "Machined"],
            ["Seal Material", "FKM Viton", "ASTM D1418", "-10°C to 120°C"],
            ["Supply Voltage", "24", "V DC", "18-30 V range"],
            ["Net Weight", "4.2", "kg", "±0.1 kg"]
        ]
    )
