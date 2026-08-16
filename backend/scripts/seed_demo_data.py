"""
Demo Data Seeder Script
Populates rich industrial demo catalog data with attributes, sources, validation issues, and enrichment suggestions.
"""

import asyncio
from datetime import datetime, timezone
from app.ai.confidence.confidence_scorer import ConfidenceScorer
from app.db.models.job import (
    AIInsight,
    AuditLog,
    EnrichmentSuggestion,
    Notification,
    ProcessingJob,
    ValidationIssue,
)
from app.db.models.product import Catalog, Product, ProductAttribute, ProductSource
from app.db.models.user import Membership, Organization, User
from app.db.session import async_session_factory, init_db


async def seed():
    print("Initializing database tables...")
    await init_db()

    async with async_session_factory() as db:
        print("Seeding demo organization and user...")
        # 1. User & Org
        user = User(
            id="usr_alex_chen_01",
            firebase_uid="firebase_alex_01",
            email="alex.chen@prodsync.ai",
            display_name="Alex Chen",
            email_verified=True,
            last_login_at=datetime.now(timezone.utc),
        )
        db.add(user)

        org = Organization(
            id="org_industrial_corp_01",
            name="FluidTech & Industrial Systems",
            slug="fluidtech-industrial",
            plan="enterprise",
        )
        db.add(org)

        membership = Membership(
            organization_id=org.id,
            user_id=user.id,
            role="owner",
        )
        db.add(membership)
        await db.flush()

        # 2. Catalogs
        print("Seeding catalogs...")
        cat1 = Catalog(
            id="cat_hydraulics_01",
            organization_id=org.id,
            name="Hydraulics & Fluid Control Q3 2026",
            description="Complete catalog of high-pressure hydraulic pumps, valves, and fluid control systems.",
            product_count=3842,
            data_quality_score=91.0,
            validation_rate=87.0,
            enrichment_rate=62.0,
            completeness_rate=89.0,
        )
        cat2 = Catalog(
            id="cat_drives_02",
            organization_id=org.id,
            name="Electric Drive Systems 2026",
            description="Motors, variable frequency drives, and power transmission catalog.",
            product_count=2156,
            data_quality_score=88.0,
            validation_rate=82.0,
            enrichment_rate=55.0,
            completeness_rate=84.0,
        )
        db.add_all([cat1, cat2])
        await db.flush()

        # 3. Product 1: Industrial Hydraulic Pump HP-4500
        print("Seeding Product 1: HP-4500...")
        p1 = Product(
            id="prod_hp4500_01",
            organization_id=org.id,
            catalog_id=cat1.id,
            sku="HP-4500",
            name="Industrial Hydraulic Pump HP-4500",
            description="High-pressure industrial hydraulic pump designed for continuous operation in demanding manufacturing environments.",
            manufacturer="FluidTech Industries",
            manufacturer_part_number="FT-HP4500-HD",
            category="Hydraulic Equipment",
            status="validated",
            validation_status="verified",
            data_quality_score=94.0,
            ai_confidence_score=96.0,
            completeness_score=94.0,
            raw_attributes={
                "operating_pressure": "250 bar",
                "flow_rate": "120 L/min",
                "material": "Stainless Steel",
                "voltage": "400 V",
                "ip_rating": "IP65",
                "weight": "18.5 kg",
            },
        )
        db.add(p1)
        await db.flush()

        # Attributes for P1
        attrs_p1 = [
            ProductAttribute(product_id=p1.id, attribute_key="operating_pressure", display_name="Operating Pressure", value="250", normalized_value="250", unit="bar", confidence=98.0, status="verified", source_name="Technical Datasheet", source_type="pdf", is_ai_generated=False),
            ProductAttribute(product_id=p1.id, attribute_key="flow_rate", display_name="Flow Rate", value="120", normalized_value="120", unit="L/min", confidence=97.0, status="verified", source_name="Technical Datasheet", source_type="pdf", is_ai_generated=False),
            ProductAttribute(product_id=p1.id, attribute_key="material", display_name="Material", value="Stainless Steel", normalized_value="Stainless Steel", unit=None, confidence=99.0, status="verified", source_name="Product Catalog", source_type="pdf", is_ai_generated=False),
            ProductAttribute(product_id=p1.id, attribute_key="weight", display_name="Weight", value="18.5", normalized_value="18.5", unit="kg", confidence=83.0, status="ai_suggested", source_name="Similar Product Specs", source_type="catalog", ai_reason="Value inferred from related specifications in the same pump family.", is_ai_generated=True, is_enriched=True),
            ProductAttribute(product_id=p1.id, attribute_key="voltage", display_name="Voltage", value="400", normalized_value="400", unit="V", confidence=100.0, status="verified", source_name="Technical Datasheet", source_type="pdf", is_ai_generated=False),
            ProductAttribute(product_id=p1.id, attribute_key="ip_rating", display_name="IP Rating", value="IP65", normalized_value="IP65", unit=None, confidence=95.0, status="verified", source_name="Product Catalog", source_type="pdf", is_ai_generated=False),
        ]
        db.add_all(attrs_p1)

        sources_p1 = [
            ProductSource(product_id=p1.id, name="HP-4500 Technical Datasheet", source_type="pdf", filename="hp4500_datasheet.pdf", page_number=4, section="3.2 Hydraulic Performance", attribute_count=12, confidence=96.0),
            ProductSource(product_id=p1.id, name="FluidTech Product Catalog Q2", source_type="pdf", filename="fluidtech_catalog.pdf", page_number=18, section="Pumps Section", attribute_count=7, confidence=91.0),
        ]
        db.add_all(sources_p1)

        insights_p1 = [
            AIInsight(product_id=p1.id, type="enrichment", title="3 Attributes Enriched by AI", description="Weight, operating temperature range, and mounting dimensions enriched via product family correlation.", confidence=86.0, attribute_names=["Weight", "Operating Temperature", "Mounting"]),
            AIInsight(product_id=p1.id, type="validation", title="Core Specifications Verified", description="Operating pressure and flow rate cross-validated across manufacturer datasheet and catalog.", confidence=97.0, attribute_names=["Operating Pressure", "Flow Rate", "Voltage"]),
        ]
        db.add_all(insights_p1)

        # 4. Product 2: Pressure Control Valve PCV-200 (Has Conflict!)
        print("Seeding Product 2: PCV-200 (Conflict Demonstration)...")
        p2 = Product(
            id="prod_pcv200_02",
            organization_id=org.id,
            catalog_id=cat1.id,
            sku="PCV-200",
            name="Pressure Control Valve PCV-200",
            description="Proportional pressure control valve designed for precise pressure regulation in industrial fluid power systems.",
            manufacturer="ValveMaster Corp",
            category="Control Valves",
            status="needs_review",
            validation_status="needs_review",
            data_quality_score=68.0,
            ai_confidence_score=78.0,
            completeness_score=72.0,
            raw_attributes={"max_pressure": "200 bar", "operating_pressure": "10 bar", "connection_size": "DN50"},
        )
        db.add(p2)
        await db.flush()

        attrs_p2 = [
            ProductAttribute(product_id=p2.id, attribute_key="max_pressure", display_name="Max Pressure", value="200", normalized_value="200", unit="bar", confidence=94.0, status="verified", source_name="PCV-200 Datasheet", source_type="pdf"),
            ProductAttribute(product_id=p2.id, attribute_key="operating_pressure", display_name="Operating Pressure", value="10", normalized_value="10", unit="bar", confidence=62.0, status="needs_review", source_name="Technical Datasheet", source_type="pdf", ai_reason="Conflict detected between Source A (10 bar) and Source B (12 bar). Manual review required."),
            ProductAttribute(product_id=p2.id, attribute_key="connection_size", display_name="Connection Size", value="DN50", normalized_value="DN50", unit=None, confidence=89.0, status="verified", source_name="Product Catalog", source_type="pdf"),
        ]
        db.add_all(attrs_p2)

        issue_p2 = ValidationIssue(
            product_id=p2.id,
            organization_id=org.id,
            attribute_name="Operating Pressure",
            severity="critical",
            title="Conflicting Values Detected Across Sources",
            description="Operating pressure value conflicts between two source documents: 10 bar vs 12 bar.",
            source_a_value="10 bar",
            source_b_value="12 bar",
            source_a_label="Technical Datasheet",
            source_b_label="Product Catalog Q2",
            recommended_action="Review both source documents and select the authoritative value.",
            status="open",
        )
        db.add(issue_p2)

        suggs_p2 = [
            EnrichmentSuggestion(product_id=p2.id, organization_id=org.id, attribute_name="Weight", suggested_value="4.2 kg", confidence=74.0, reason="Inferred from similar valve models in the PCV series.", source="Related Product Database", source_type="similar_products", status="pending"),
            EnrichmentSuggestion(product_id=p2.id, organization_id=org.id, attribute_name="Operating Temperature", suggested_value="-10°C to 60°C", confidence=81.0, reason="Standard operating range for this valve category.", source="Industry Standards DB", source_type="industry_standard", status="pending"),
        ]
        db.add_all(suggs_p2)

        # 5. Notifications and Audit Logs
        print("Seeding notifications and audit logs...")
        notif = Notification(
            organization_id=org.id,
            user_id=user.id,
            type="warning",
            title="Validation Review Required",
            description="PCV-200 has conflicting pressure values across two sources that require review.",
            read=False,
            action_label="Review Conflict",
            action_href="/app/validation",
        )
        db.add(notif)

        audit = AuditLog(
            organization_id=org.id,
            user_id=user.id,
            user_name=user.display_name,
            action="CATALOG_CREATED",
            entity_type="catalog",
            entity_name=cat1.name,
            details={"product_count": 3842},
        )
        db.add(audit)

        await db.commit()
        print("Demo data seeded successfully!")


if __name__ == "__main__":
    asyncio.run(seed())
