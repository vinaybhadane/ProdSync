"""
Hierarchical Leaf-Level Taxonomy Engine & Category Attribute Schemas
UniHack 2026 Taxonomy Classification Module
Maps industrial products to specific leaf categories, taxonomy IDs, classpath, and attribute schemas.
"""

from typing import Any, Dict, List, Optional, Tuple


class TaxonomyNode:
    def __init__(
        self,
        taxonomy_id: str,
        dept: str,
        class_name: str,
        fine: str,
        leaf_category: str,
        classpath: str,
        keywords: List[str],
        required_attributes: List[str],
        recommended_attributes: List[str],
        default_unspsc: str = "40151500",
    ):
        self.taxonomy_id = taxonomy_id
        self.dept = dept
        self.class_name = class_name
        self.fine = fine
        self.leaf_category = leaf_category
        self.classpath = classpath
        self.keywords = [k.lower() for k in keywords]
        self.required_attributes = required_attributes
        self.recommended_attributes = recommended_attributes
        self.default_unspsc = default_unspsc


TAXONOMY_REGISTRY: List[TaxonomyNode] = [
    # 1. Magnetic Contactors
    TaxonomyNode(
        taxonomy_id="120441",
        dept="Electrical",
        class_name="Industrial Controls",
        fine="Contactors",
        leaf_category="Magnetic Contactors",
        classpath="Electrical > Industrial Controls > Contactors > Magnetic Contactors",
        keywords=["contactor", "magnetic contactor", "tesys", "lc1d", "switching", "relay contactor", "reversing contactor", "3-pole contactor"],
        required_attributes=["Voltage Rating", "Current Rating", "Number of Poles", "Coil Voltage", "Mounting Type"],
        recommended_attributes=["Power Rating", "Frequency Rating", "Auxiliary Contacts", "Operating Temperature Range", "IP Rating", "Standard/Approvals", "Series"],
        default_unspsc="39121529",
    ),
    # 2. Cut-Off Discs & Wheels
    TaxonomyNode(
        taxonomy_id="301882",
        dept="Tools & Hardware",
        class_name="Abrasives",
        fine="Cut-Off Discs",
        leaf_category="Cut-Off Discs",
        classpath="Abrasives & Cutting Tools > Abrasives > Cut-Off Wheels & Sanding Discs",
        keywords=["cut-off", "cut off", "cutoff", "cutting disc", "metal cut-off", "grinding disc", "wheel cut off", "dko metal cut off"],
        required_attributes=["Size", "Grit Rating", "Package Quantity", "Applicable Material", "Mounting Type"],
        recommended_attributes=["Max Operating Speed", "Arbor Size", "Thickness", "Abrasive Material", "Standard/Approvals", "Series"],
        default_unspsc="31191600",
    ),
    # 3. Sanding Belts & Discs
    TaxonomyNode(
        taxonomy_id="301883",
        dept="Tools & Hardware",
        class_name="Abrasives",
        fine="Sanding Belts",
        leaf_category="Sanding Belts & Strips",
        classpath="Abrasives & Cutting Tools > Abrasives > Sanding Belts & Strips",
        keywords=["sanding belt", "sanding disc", "stikit", "hiolit", "abranet", "cubitron", "grit disc", "film disc", "hook and loop disc"],
        required_attributes=["Size", "Grit Rating", "Package Quantity", "Abrasive Material", "Backing Material"],
        recommended_attributes=["Attachment Type", "Color", "Series", "Grade", "Standard/Approvals"],
        default_unspsc="31191500",
    ),
    # 4. Built-In Dishwashers
    TaxonomyNode(
        taxonomy_id="1515863",
        dept="Appliances",
        class_name="Large Appliances",
        fine="Dishwashers",
        leaf_category="Built-In Dishwashers",
        classpath="Appliances & Consumer Electronics > Kitchen Appliances > Built-In Dishwashers",
        keywords=["dishwasher", "dishwashers", "built-in dishwasher", "cleanboost", "wash cycle", "rheem dishwasher", "whirlpool dishwasher", "frigidaire dishwasher"],
        required_attributes=["Voltage Rating", "Amperage Rating", "Mounting Type", "Sound Level", "Material"],
        recommended_attributes=["Number of Wash Cycles", "Size", "Depth With Door Open", "Minimum Height", "Maximum Height", "Color", "Energy Consumption", "Standard/Approvals", "Series"],
        default_unspsc="52141505",
    ),
    # 5. Pressure Control Valves
    TaxonomyNode(
        taxonomy_id="450122",
        dept="Plumbing & Flow Control",
        class_name="Valves",
        fine="Control Valves",
        leaf_category="Pressure Control Valves",
        classpath="Plumbing & Flow Control > Valves > Control & Check Valves",
        keywords=["valve", "pcv", "pressure control", "relief valve", "check valve", "ball valve", "solenoid valve", "gate valve", "butterfly valve"],
        required_attributes=["Pressure Rating", "Connection Size", "Material", "Operating Temperature Range", "Flow Rate"],
        recommended_attributes=["Body Material", "Seat Material", "Connection Type", "Actuation Type", "Standard/Approvals"],
        default_unspsc="40141600",
    ),
    # 6. Hydraulic Pumps & Motors
    TaxonomyNode(
        taxonomy_id="450123",
        dept="Industrial Supplies",
        class_name="Hydraulics",
        fine="Hydraulic Pumps",
        leaf_category="Hydraulic Gear & Piston Pumps",
        classpath="Industrial Supplies > Hydraulics & Pneumatics > Hydraulic Pumps & Motors",
        keywords=["pump", "hydraulic pump", "gear pump", "piston pump", "fluidtech", "displacement", "fluid power"],
        required_attributes=["Operating Pressure", "Flow Rate", "Displacement", "Shaft Diameter", "Mounting Type"],
        recommended_attributes=["Max Speed", "Rotation Direction", "Port Size", "Fluid Type", "Material", "Standard/Approvals"],
        default_unspsc="40151500",
    ),
    # 7. Ball & Roller Bearings
    TaxonomyNode(
        taxonomy_id="610294",
        dept="Power Transmission",
        class_name="Bearings",
        fine="Ball Bearings",
        leaf_category="Radial Deep Groove Ball Bearings",
        classpath="Mechanical Power Transmission > Bearings > Ball & Roller Bearings",
        keywords=["bearing", "ball bearing", "roller bearing", "pillow block", "skf", "timken", "deep groove", "thrust bearing"],
        required_attributes=["Bore Diameter", "Outer Diameter", "Width", "Dynamic Load Capacity", "Material"],
        recommended_attributes=["Static Load Capacity", "Max RPM", "Closure Type", "Clearance", "Standard/Approvals"],
        default_unspsc="31171504",
    ),
    # 8. Electric Motors
    TaxonomyNode(
        taxonomy_id="120556",
        dept="Electrical",
        class_name="Motors & Drives",
        fine="Electric Motors",
        leaf_category="Three-Phase AC Induction Motors",
        classpath="Electrical > Motors & Drives > AC & DC Electric Motors",
        keywords=["motor", "electric motor", "induction motor", "3-phase motor", "ac motor", "dc motor", "nema motor", "iec motor"],
        required_attributes=["Power Output", "Voltage Rating", "Current Rating", "Speed", "Frame Size"],
        recommended_attributes=["Frequency Rating", "Enclosure Type", "Efficiency Class", "Mounting Type", "Standard/Approvals"],
        default_unspsc="26101100",
    ),
    # 9. Industrial Lighting & LED Lamps
    TaxonomyNode(
        taxonomy_id="710443",
        dept="Electrical",
        class_name="Lighting",
        fine="Lamps & Bulbs",
        leaf_category="Industrial LED Bulbs & Lamps",
        classpath="Electrical & Lighting > Lamps & Bulbs > LED & Incandescent Lamps",
        keywords=["light", "lamp", "led", "bulb", "luminaire", "lighting", "floodlight", "bay light"],
        required_attributes=["Luminous Flux", "Power Rating", "Voltage Rating", "Color Temperature", "Base Type"],
        recommended_attributes=["CRI Rating", "Lifespan", "Beam Angle", "IP Rating", "Standard/Approvals"],
        default_unspsc="39101628",
    ),
    # 10. Dimensional & Structural Lumber
    TaxonomyNode(
        taxonomy_id="820119",
        dept="Building Materials",
        class_name="Lumber",
        fine="Dimensional Lumber",
        leaf_category="Framing & Structural Lumber",
        classpath="Building Materials > Lumber & Composites > Structural Lumber",
        keywords=["lumber", "wood", "plywood", "beam", "stud", "timber", "framing lumber", "dimensional lumber"],
        required_attributes=["Size", "Length", "Wood Species", "Grade", "Treatment Type"],
        recommended_attributes=["Moisture Content", "Application", "Standard/Approvals"],
        default_unspsc="30103600",
    ),
]


class TaxonomyEngine:
    """
    Classifies product text into leaf-level taxonomy and retrieves category-specific schemas.
    """

    @classmethod
    def classify_product(
        cls,
        name: str,
        manufacturer: str,
        mpn: str,
        description: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Classifies product into the most specific leaf-level category.
        Returns:
            taxonomy_id, category_path, leaf_category, classpath, confidence, reason, required_attributes, recommended_attributes
        """
        combined_text = f"{name} {manufacturer} {mpn} {description or ''}".lower()

        best_node: Optional[TaxonomyNode] = None
        best_score = 0
        best_match_reasons = []

        for node in TAXONOMY_REGISTRY:
            score = 0
            matched_words = []
            for kw in node.keywords:
                if kw in combined_text:
                    # Longer keywords carry higher weight
                    weight = len(kw.split()) * 2
                    score += weight
                    matched_words.append(kw)

            if score > best_score:
                best_score = score
                best_node = node
                best_match_reasons = matched_words

        if not best_node:
            # Fallback to general industrial components
            return {
                "taxonomy_id": "990001",
                "dept": "Industrial Supplies",
                "class_name": "General Industrial",
                "fine": "Hardware",
                "leaf_category": "Industrial Hardware & Fasteners",
                "category_path": ["Industrial Supplies", "General Industrial", "Hardware", "Industrial Hardware & Fasteners"],
                "classpath": "Industrial Supplies > General Industrial > Industrial Components",
                "confidence": 0.85,
                "reason": "Classified into General Industrial based on industrial component context.",
                "unspsc": "40151500",
                "required_attributes": ["Size", "Material", "Mounting Type"],
                "recommended_attributes": ["Series", "Standard/Approvals", "Package Quantity"],
            }

        # Calculate confidence
        confidence = min(0.99, max(0.88, 0.85 + (best_score * 0.02)))

        return {
            "taxonomy_id": best_node.taxonomy_id,
            "dept": best_node.dept,
            "class_name": best_node.class_name,
            "fine": best_node.fine,
            "leaf_category": best_node.leaf_category,
            "category_path": [best_node.dept, best_node.class_name, best_node.fine, best_node.leaf_category],
            "classpath": best_node.classpath,
            "confidence": round(confidence, 2),
            "reason": f"Matched authoritative keywords: {', '.join(best_match_reasons[:4])}",
            "unspsc": best_node.default_unspsc,
            "required_attributes": best_node.required_attributes,
            "recommended_attributes": best_node.recommended_attributes,
        }

    @classmethod
    def get_all_categories(cls) -> List[Dict[str, Any]]:
        """Returns all registered leaf taxonomy categories."""
        return [
            {
                "taxonomy_id": n.taxonomy_id,
                "dept": n.dept,
                "class_name": n.class_name,
                "fine": n.fine,
                "leaf_category": n.leaf_category,
                "classpath": n.classpath,
            }
            for n in TAXONOMY_REGISTRY
        ]


taxonomy_engine = TaxonomyEngine()
