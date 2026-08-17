# UniHack 2026 — Existing Prototype Audit, Compliance & Implementation Prompt

You are working on an existing AI-powered product intelligence/enrichment prototype for **UniHack 2026: Decode the Challenge by Hack2skill × Unilog**.

## IMPORTANT CONTEXT

The frontend/UI/design has already been created.

**DO NOT redesign the application from scratch.**

Your job is to:

1. Thoroughly inspect the existing application.
2. Understand the current architecture, UI, components, APIs, database, AI pipeline, and data flow.
3. Verify the implementation against the complete UniHack 2026 requirements provided below.
4. Identify every missing, incomplete, mocked, hardcoded, non-dynamic, or technically incorrect feature.
5. Implement the missing functionality directly into the existing application.
6. Preserve the existing visual design, branding, layout, navigation, and UX wherever possible.
7. Only modify UI where a hackathon requirement cannot be satisfied without the modification.
8. After implementation, perform a complete end-to-end verification using realistic test data.

The final result must be a **real working dynamic prototype**, not a static demo.

---

# 1. HACKATHON OBJECTIVE

The solution must implement an AI-powered automated product enrichment pipeline.

The system receives minimal product information, primarily:

- Manufacturer Name
- Manufacturer Part Number / MPN

It should then automatically:

1. Identify the correct product.
2. Find authoritative product information.
3. Prefer the official manufacturer's website and technical documentation.
4. Extract product information.
5. Classify the product into the appropriate taxonomy/category.
6. Extract category-specific attributes.
7. Normalize attribute values and units.
8. Validate values against the applicable List of Values (LOV).
9. Detect newly discovered valid values that are outside the LOV.
10. Generate standardized product descriptions.
11. Preserve manufacturer-provided marketing content/features without unauthorized modification.
12. Attach source/provenance information to every extracted field.
13. Present the enriched product data in a commerce-ready format.
14. Allow the evaluator to upload their own unseen dataset and process it dynamically.

---

# 2. FIRST TASK — AUDIT THE EXISTING APPLICATION

Before changing anything, inspect the entire project.

Analyze:

- Frontend
- Backend
- API routes
- Database
- Authentication if present
- File upload functionality
- AI/LLM integration
- Web search/scraping
- PDF processing
- OCR
- Product extraction
- Taxonomy classification
- Attribute extraction
- Normalization
- LOV validation
- Description generation
- Source/provenance handling
- Export functionality
- Error handling
- Loading states
- Retry mechanisms
- Logging
- Environment variables
- Deployment configuration

Do not assume that a feature exists just because there is a UI element for it.

For every UI feature, verify that it is connected to actual backend logic.

For example:

If the UI has:

> "Enrich Product"

verify that clicking it actually executes the enrichment pipeline.

If the UI displays:

> Manufacturer → Product → Category → Attributes → Sources

verify that these values are dynamically generated from the current product and are not hardcoded.

---

# 3. CREATE AN INTERNAL REQUIREMENT COMPLIANCE MATRIX

Before implementation, compare the existing application against every requirement.

Use these statuses internally:

- PASS — correctly implemented
- PARTIAL — partially implemented
- FAIL — missing/incorrect
- MOCKED — UI exists but uses fake/static data
- HARDCODED — output is manually fixed
- NEEDS VALIDATION — implementation exists but correctness cannot yet be confirmed

Check every requirement listed in this prompt.

Do not stop after finding a few issues.

Perform a complete audit.

---

# 4. INPUT REQUIREMENTS

The system must support minimal product input.

At minimum support:

```text
Manufacturer Name
Manufacturer Part Number / MPN
```

Example:

```text
Manufacturer: Schneider Electric
MPN: LC1D09M7
```

The application must also support batch processing where the evaluator can upload a dataset containing multiple products.

Support common formats where practical:

- CSV
- XLSX
- JSON

If the existing application already supports a particular format, preserve it.

For uploaded datasets:

- Automatically detect columns where possible.
- Allow mapping of Manufacturer Name and MPN columns if column names differ.
- Validate required fields.
- Show invalid rows clearly.
- Do not crash because one row is malformed.

---

# 5. NO MOCK DATA / NO HARDCODED OUTPUT

This is one of the most important requirements.

Remove or replace:

- Hardcoded product names
- Hardcoded specifications
- Fake source URLs
- Static category results
- Fake confidence scores
- Fake enrichment progress
- Fake AI responses
- Dummy product images
- Mock provenance
- Static tables pretending to contain live enrichment data

The application must process the actual uploaded/input product.

If sample/demo data is included, clearly separate it from the actual processing pipeline.

The evaluator must be able to replace the sample data with their own dataset.

---

# 6. PRODUCT DATA SOURCING

The sourcing pipeline must follow this priority:

## Priority 1 — Official Manufacturer Sources

Search and retrieve information from:

- Official manufacturer product pages
- Official manufacturer catalogs
- Official technical documentation
- Official datasheets
- Official specification PDFs
- Official manuals
- Official warranty documents
- Official product images/assets

The manufacturer's website should always be the preferred source.

## Priority 2 — Reputed Distributor

If the manufacturer's website is inaccessible or product information cannot reasonably be obtained from the manufacturer, use a reputable distributor as a fallback.

The system must clearly mark this as:

```text
Source Type: Distributor / Fallback
```

## PROHIBITED SOURCES

Do NOT use general e-commerce marketplaces such as:

- Amazon
- eBay
- Walmart
- Generic shopping marketplaces

Do not use them as authoritative product sources.

If search results contain such websites, filter them out.

---

# 7. SOURCE VALIDATION

Every source should be evaluated before being used.

For each source store information such as:

```json
{
  "url": "...",
  "domain": "...",
  "sourceType": "manufacturer",
  "title": "...",
  "retrievedAt": "...",
  "reliability": "high"
}
```

The system should prefer:

```text
Official Manufacturer > Official Technical PDF > Reputed Distributor
```

The source selection logic should be visible/explainable where appropriate.

---

# 8. DIGITAL ASSET SOURCING

Product assets must come from the manufacturer website whenever available.

This includes:

- Product images
- Datasheets
- Technical PDFs
- Manuals
- Warranty documents
- Product documentation

Do not silently use random internet images.

For every digital asset, preserve its source URL.

Example:

```text
Product Image
Source: https://manufacturer.com/...
```

---

# 9. PRODUCT IDENTIFICATION

The system must use:

```text
Manufacturer Name
+
Manufacturer Part Number
```

to identify the correct product.

Do not rely only on semantic similarity.

The pipeline should verify that the discovered product actually matches the MPN.

Where possible, validate:

- Exact MPN
- Manufacturer
- Product family
- Product title
- Technical specifications

If conflicting products are found, flag the conflict instead of silently selecting incorrect information.

---

# 10. TAXONOMY CLASSIFICATION

The system must classify each product into the most appropriate **leaf-level taxonomy/category**.

The challenge references Unilog's taxonomy of approximately 14,000 categories.

Do NOT simply classify products into broad categories such as:

```text
Electrical
Mechanical
Tools
Industrial
```

The system should attempt to reach the most specific applicable leaf category.

Example:

Instead of:

```text
Electrical → Switches
```

prefer something similar to:

```text
Electrical
→ Industrial Controls
→ Contactors
→ Magnetic Contactors
```

The actual category must be based on the available taxonomy.

---

# 11. TAXONOMY ARCHITECTURE

If the project already contains a taxonomy dataset, use it.

If taxonomy files are available in the repository, inspect them and integrate them into the classification pipeline.

Do not invent thousands of categories.

If a full taxonomy is not available, architect the system so that a taxonomy dataset can be uploaded/configured without changing application code.

The classifier should return:

```text
Taxonomy ID
Category Path
Leaf Category
Classification Confidence
Reason / Evidence
```

Example:

```json
{
  "taxonomyId": "12345",
  "categoryPath": [
    "Electrical",
    "Industrial Controls",
    "Contactors",
    "Magnetic Contactors"
  ],
  "leafCategory": "Magnetic Contactors",
  "confidence": 0.94
}
```

---

# 12. CATEGORY-SPECIFIC ATTRIBUTE EXTRACTION

This is a critical requirement.

After taxonomy classification, dynamically determine the attributes required for that category.

Different categories may require:

- 10 attributes
- 20 attributes
- 30 attributes
- 40+ attributes

Do NOT use one universal hardcoded attribute list for every product.

The pipeline should work like:

```text
Product
↓
Taxonomy Classification
↓
Leaf Category
↓
Category Attribute Schema
↓
Extract Required Attributes
```

For each attribute capture:

```text
Attribute Name
Attribute Value
UOM
Original Value
Normalized Value
Source
Confidence
Validation Status
```

Example:

```text
Voltage
Value: 120
UOM: V
Original: "120 volts"
Source: Manufacturer Datasheet
Confidence: 98%
```

---

# 13. VALUE + UOM SEPARATION

Normalize technical specifications into separate value and unit fields.

Incorrect:

```text
Voltage = "120 V"
```

Correct:

```text
Voltage Value = 120
Voltage UOM = V
```

Examples:

```text
Current Value = 10
Current UOM = A

Frequency Value = 50
Frequency UOM = Hz

Length Value = 120
Length UOM = mm

Weight Value = 2.5
Weight UOM = kg
```

Preserve the original extracted value as well.

Example:

```text
Original: "2.5 kg"
Normalized Value: 2.5
Normalized UOM: kg
```

Do not lose source information during normalization.

---

# 14. UNIT NORMALIZATION

Implement a robust normalization layer.

Examples:

```text
120 volts → 120 V
0.5 amp → 0.5 A
1000 mm → 1000 mm
1 meter → 1 m
2 kilograms → 2 kg
```

Do not perform unsafe conversions.

Preserve the original value.

If conversion is ambiguous, flag it for validation rather than guessing.

---

# 15. LIST OF VALUES — LOV

If LOV data is available in the repository, integrate it into the validation system.

For each applicable attribute:

```text
Extracted Value
↓
Normalize
↓
Compare with LOV
↓
Valid / Invalid / New Value
```

Example:

```text
Attribute: Mounting Type

LOV:
- DIN Rail
- Panel Mount
- Surface Mount

Extracted:
DIN Rail

Status:
VALID
```

If the system discovers a valid value that is not present in the LOV:

```text
Status: NEW_VALUE
```

Do NOT silently force it into an existing LOV value.

The UI should clearly communicate:

```text
New valid value discovered outside current LOV
```

---

# 16. ATTRIBUTE VALIDATION

Each attribute should have a validation state.

Recommended statuses:

```text
VALID
INVALID
MISSING
NEW_VALUE
CONFLICT
LOW_CONFIDENCE
UNVERIFIED
```

Where possible, provide the reason.

Example:

```text
Voltage: 120 V
Status: VALID
Source: Manufacturer Datasheet
Confidence: 97%
```

---

# 17. CONFLICT DETECTION

If multiple authoritative sources provide conflicting values:

Example:

```text
Manufacturer Page:
Voltage = 120 V

Manufacturer PDF:
Voltage = 240 V
```

Do NOT blindly select one.

Detect and display:

```text
CONFLICT DETECTED
```

Show:

- Source 1
- Value 1
- Source 2
- Value 2
- Source priority
- Resolution status

The system may select the higher-authority source if the logic is defensible, but the conflict should remain traceable.

---

# 18. DESCRIPTION GENERATION

Implement the five required standardized description types:

1. Mobile
2. In-app/Search
3. Short
4. Long
5. Retail

The generation pipeline must follow the hackathon's provided style guide and exact sequence/character requirements if the style guide is available in the repository or project files.

Do NOT randomly generate five generic descriptions.

Each description should be generated from the verified enriched product data.

Use only verified facts.

Do not hallucinate specifications.

---

# 19. DESCRIPTION SAFETY

Generated descriptions must not introduce unsupported claims.

For example, if the source says:

```text
Rated voltage: 120 V
```

the AI must not generate:

```text
High-performance 120 V industrial contactor designed for extreme environments
```

unless the manufacturer source actually supports those claims.

Generated descriptions should be grounded in extracted product information.

---

# 20. MANUFACTURER MARKETING CONTENT

Marketing descriptions and manufacturer-provided item features must be treated separately from AI-generated descriptions.

If the manufacturer provides:

```text
Product Description
Features
Marketing Copy
Benefits
```

capture it as manufacturer content.

Do not unnecessarily rewrite or alter manufacturer-provided marketing content.

Store:

```text
Content Type
Original Content
Source URL
```

Example:

```text
Content Type: Manufacturer Feature
Original: ...
Source: Manufacturer URL
```

---

# 21. PROVENANCE / SOURCE LINK FOR EVERY FIELD

This is a critical evaluation requirement.

Every extracted field must have provenance.

Example:

```text
Attribute: Voltage
Value: 120
UOM: V
Source: Manufacturer Datasheet
URL: https://manufacturer.com/...
Confidence: 98%
```

This should apply to:

- Product name
- MPN
- Manufacturer
- Category
- Taxonomy
- Attributes
- Specifications
- Descriptions where applicable
- Marketing content
- Product image
- PDF
- Warranty
- Other extracted information

Do NOT show a single generic "Sources" section and assume that is enough.

The provenance should be associated with individual data fields wherever possible.

---

# 22. PROVENANCE UI

Improve the existing UI only if necessary.

For each attribute, provide a way to inspect the source.

Possible UX:

```text
Voltage      120 V     ✓ Valid    [Source]
Current      9 A       ✓ Valid    [Source]
Frequency    50 Hz     ✓ Valid    [Source]
```

Clicking `[Source]` should show:

```text
Source Type
Manufacturer
Document/Page
URL
Extracted Text / Evidence
Confidence
```

If possible, show the exact supporting snippet from the source.

---

# 23. CONFIDENCE & EXPLAINABILITY

Every AI-generated/extracted result should have a confidence indicator where technically meaningful.

Example:

```text
High confidence
Medium confidence
Low confidence
```

or:

```text
98%
82%
61%
```

Do not fabricate confidence scores.

If confidence is generated by an LLM, clearly treat it as model confidence rather than verified statistical probability.

---

# 24. END-TO-END PIPELINE

The application should implement the following pipeline:

```text
Input Dataset
      ↓
Validate Input
      ↓
Identify Manufacturer + MPN
      ↓
Search Official Manufacturer Sources
      ↓
Validate Product Identity
      ↓
Collect Product Page / PDFs / Technical Documents
      ↓
Extract Raw Product Information
      ↓
Taxonomy Classification
      ↓
Determine Category-Specific Attributes
      ↓
Extract Attributes
      ↓
Normalize Values + UOM
      ↓
Validate Against LOV
      ↓
Detect New Values
      ↓
Detect Conflicts
      ↓
Generate Standardized Descriptions
      ↓
Attach Field-Level Provenance
      ↓
Quality Validation
      ↓
Commerce-Ready Enriched Product
      ↓
Export / Review
```

---

# 25. BATCH PROCESSING

The evaluator may upload multiple products.

Implement a robust batch workflow.

Show:

```text
Total Products: 100
Processed: 63
Successful: 58
Warnings: 4
Failed: 1
```

Each row should have a status:

```text
Queued
Processing
Completed
Warning
Failed
```

Do not allow one failed product to crash the entire batch.

---

# 26. ERROR HANDLING

Implement graceful error handling for:

- Invalid MPN
- Manufacturer not found
- Manufacturer website unavailable
- PDF unavailable
- Search failure
- Website timeout
- AI timeout
- Rate limits
- Invalid PDF
- OCR failure
- Missing taxonomy
- Missing attributes
- LOV mismatch
- Conflicting data
- Unsupported file format

Show human-readable errors.

Never expose raw stack traces to the normal user interface.

Provide retry functionality where appropriate.

---

# 27. PIPELINE PROGRESS

The existing UI should show real pipeline progress.

Example:

```text
✓ Input validated
✓ Manufacturer identified
✓ Official source found
✓ Product verified
✓ Technical documents collected
✓ Product classified
✓ Attributes extracted
✓ Values normalized
✓ LOV validation completed
✓ Descriptions generated
✓ Provenance attached
✓ Quality checks completed
```

Do not fake progress with timers.

Progress should correspond to actual backend stages.

---

# 28. PRODUCT REVIEW SCREEN

The enriched product screen should make it easy for an evaluator to understand the result.

Preserve the existing design, but ensure the screen contains the important information:

### Product Identity

- Manufacturer
- MPN
- Product name
- Product family
- Product image

### Classification

- Taxonomy path
- Leaf category
- Confidence

### Attributes

- Attribute
- Value
- UOM
- Validation status
- Source
- Confidence

### Descriptions

- Mobile
- In-app/Search
- Short
- Long
- Retail

### Manufacturer Content

- Manufacturer description
- Features
- Marketing content

### Sources

- Manufacturer website
- Technical PDFs
- Supporting documents
- Distributor fallback if used

### Quality

- Completeness
- Validation
- Missing attributes
- Conflicts
- New LOV values

---

# 29. EXPORT

If export functionality exists, verify that the enriched output can be exported.

Prefer formats such as:

- CSV
- XLSX
- JSON

The export should contain structured fields.

Example:

```text
Manufacturer
MPN
Product Name
Taxonomy ID
Category
Attribute Name
Attribute Value
Attribute UOM
Validation Status
Source URL
Source Type
Confidence
Mobile Description
Search Description
Short Description
Long Description
Retail Description
```

Do not export only the visually displayed subset.

---

# 30. PERFORMANCE & COST OPTIMIZATION

The hackathon explicitly values cost effectiveness.

Optimize API usage.

Implement where appropriate:

- Caching
- Deduplication
- Search result caching
- Document caching
- Reuse of extracted content
- Batch processing
- Limited LLM calls
- Structured prompts
- Smaller models for simple tasks
- Larger models only for complex reasoning
- Avoid repeated processing of identical MPNs

Do not sacrifice correctness merely to reduce cost.

---

# 31. CACHING

If the same product is processed multiple times:

```text
Manufacturer + MPN
```

should be usable as a cache key.

Before performing expensive operations, check whether verified information already exists.

However, cached data must still preserve:

- Source
- Retrieval timestamp
- Validation status

---

# 32. SECURITY

Inspect the application for obvious security issues.

Never expose:

- API keys
- Secrets
- Database credentials
- Private environment variables

in frontend code.

Use environment variables for sensitive configuration.

Validate uploaded files.

Prevent malicious file uploads where possible.

Sanitize URLs and external content before processing.

---

# 33. UI/UX RULE

IMPORTANT:

The current design is already approved.

Therefore:

### DO NOT

- Completely redesign the application
- Replace the existing color scheme
- Replace the entire navigation
- Change the branding unnecessarily
- Remove useful existing components
- Replace the current layout without reason

### DO

- Preserve existing components
- Preserve visual hierarchy
- Preserve existing responsive behavior
- Add missing functionality naturally
- Add validation indicators
- Add source/provenance UI
- Add error states
- Add progress states
- Add batch processing where missing
- Improve usability only where it supports the hackathon requirements

The final UI should look like an improved version of the current product, not a completely different application.

---

# 34. RESPONSIVE DESIGN

Verify:

- Desktop
- Laptop
- Tablet
- Mobile

The core enrichment workflow must remain usable on smaller screens.

Do not introduce horizontal overflow unnecessarily.

---

# 35. ACCESSIBILITY

Check:

- Button labels
- Form labels
- Keyboard navigation
- Color contrast
- Loading states
- Error messages
- Accessible tables
- Tooltips
- Source links

Do not communicate validation only through color.

For example:

```text
✓ Valid
⚠ Warning
✕ Invalid
```

should accompany visual styling.

---

# 36. DYNAMIC DATA REQUIREMENT

This is mandatory.

The evaluator should be able to do:

```text
Upload CSV
      ↓
Select / Map MPN column
      ↓
Select / Map Manufacturer column
      ↓
Start Enrichment
      ↓
Real pipeline executes
      ↓
Results generated
```

Do not assume the evaluator will use your demo products.

The system must work with unseen products.

---

# 37. TEST WITH MULTIPLE PRODUCT TYPES

After implementation, test with several realistic industrial product examples.

Use products from different categories, such as:

- Electrical components
- Industrial automation
- Mechanical components
- Tools
- Sensors
- Safety equipment

Verify that the system does not assume one fixed category or attribute schema.

---

# 38. TEST FAILURE CASES

Test at least:

1. Valid MPN + valid manufacturer
2. Invalid MPN
3. Manufacturer website unavailable
4. Product found only through distributor
5. Multiple search results
6. Conflicting specifications
7. Missing attribute
8. Unknown LOV value
9. Multiple products in CSV
10. Malformed CSV row
11. PDF extraction failure
12. API timeout

The application must remain stable.

---

# 39. REMOVE DEMO-ONLY BEHAVIOR

Search the codebase for indicators of prototype-only behavior, including:

```text
mock
dummy
sample
demo
hardcoded
fake
placeholder
static
TODO
FIXME
```

Inspect each occurrence.

If it affects the real enrichment workflow, replace it with production-like dynamic logic.

Do not remove legitimate development utilities blindly.

---

# 40. ENVIRONMENT CONFIGURATION

Review `.env`, environment variables, deployment configuration, and API integrations.

Document required variables.

Example:

```text
LLM_API_KEY=
SEARCH_API_KEY=
DATABASE_URL=
STORAGE_URL=
```

Use the project's existing provider wherever already configured.

Do not unnecessarily replace working infrastructure.

---

# 41. LOGGING & DEBUGGING

Implement useful backend logs for:

```text
Product received
Source search started
Source selected
Document downloaded
Extraction started
Taxonomy classification
Attribute extraction
Normalization
LOV validation
Description generation
Quality validation
Completed
Failed
```

Do not log sensitive credentials.

---

# 42. QUALITY SCORE

If the existing application has a product quality/completeness score, verify that it is based on real data.

It should consider factors such as:

- Required attributes completed
- Source availability
- Validation status
- Confidence
- Missing data
- Conflicts
- LOV compliance
- Provenance coverage

Do NOT display an arbitrary hardcoded score such as:

```text
98%
```

for every product.

---

# 43. FINAL VALIDATION CHECKLIST

Before declaring the implementation complete, verify every item below.

## Input

- [ ] Manufacturer + MPN supported
- [ ] CSV supported
- [ ] XLSX supported if practical
- [ ] Batch input supported
- [ ] Column mapping supported
- [ ] Invalid rows handled

## Data Sourcing

- [ ] Official manufacturer source prioritized
- [ ] Manufacturer technical PDFs supported
- [ ] Manufacturer images supported
- [ ] Manufacturer documentation supported
- [ ] Distributor fallback supported
- [ ] E-commerce marketplaces excluded
- [ ] Source type stored

## Product Identification

- [ ] MPN validated
- [ ] Manufacturer validated
- [ ] Product identity verified
- [ ] Conflicting products handled

## Taxonomy

- [ ] Taxonomy classification implemented
- [ ] Leaf-level category targeted
- [ ] Taxonomy ID stored
- [ ] Category path stored
- [ ] Confidence/evidence available

## Attributes

- [ ] Category-specific attributes
- [ ] Dynamic attribute schema
- [ ] Value extraction
- [ ] UOM extraction
- [ ] Value/UOM separation
- [ ] Normalization
- [ ] LOV validation
- [ ] New value detection
- [ ] Missing value detection
- [ ] Conflict detection

## Descriptions

- [ ] Mobile description
- [ ] In-app/Search description
- [ ] Short description
- [ ] Long description
- [ ] Retail description
- [ ] Style guide followed where available
- [ ] Character limits followed
- [ ] No unsupported claims

## Provenance

- [ ] Field-level source URLs
- [ ] Source type
- [ ] Manufacturer source prioritized
- [ ] PDF reference
- [ ] Evidence/snippet where possible
- [ ] Source for digital assets

## Dynamic Execution

- [ ] No hardcoded output
- [ ] No fake enrichment progress
- [ ] No mock API response
- [ ] No static demo result used in production flow
- [ ] Unseen products supported
- [ ] Batch processing stable

## Reliability

- [ ] Timeouts handled
- [ ] API failures handled
- [ ] Search failures handled
- [ ] PDF failures handled
- [ ] AI failures handled
- [ ] Partial failures handled
- [ ] Retry functionality where useful

## Cost

- [ ] Caching
- [ ] Deduplication
- [ ] Avoid unnecessary LLM calls
- [ ] Avoid repeated document processing
- [ ] Efficient batch processing

## Security

- [ ] API keys hidden
- [ ] Secrets not exposed
- [ ] Upload validation
- [ ] URL validation
- [ ] Safe external content processing

---

# 44. IMPORTANT IMPLEMENTATION RULE

Do not simply tell me what is missing.

**IMPLEMENT IT.**

If something is partially implemented:

```text
Existing implementation
        ↓
Identify limitation
        ↓
Fix limitation
        ↓
Test
```

If something is completely missing:

```text
Design the smallest robust implementation
        ↓
Integrate into existing architecture
        ↓
Connect frontend + backend
        ↓
Test
```

If an existing implementation is already correct:

**Do not unnecessarily rewrite it.**

---

# 45. DO NOT BREAK EXISTING FEATURES

Before modifying any component:

Understand:

- Who uses it
- What API it calls
- What data structure it expects
- What other components depend on it

After modification, verify that existing functionality still works.

---

# 46. FINAL OUTPUT AFTER IMPLEMENTATION

After completing the work, provide a concise implementation report containing:

## A. Compliance Summary

```text
Total Requirements Checked: XX
PASS: XX
PARTIAL → FIXED: XX
MISSING → IMPLEMENTED: XX
MOCKED → REPLACED: XX
```

## B. Features Implemented

List all major features added or fixed.

## C. Architecture Changes

Explain important backend/pipeline changes.

## D. UI Changes

Mention only the UI changes made to support requirements.

## E. Dynamic Pipeline

Explain the actual end-to-end flow from:

```text
MPN
→ Search
→ Source Validation
→ Extraction
→ Taxonomy
→ Attributes
→ Normalization
→ LOV
→ Descriptions
→ Provenance
→ Final Output
```

## F. Testing

Mention:

- Test products
- Batch testing
- Failure cases
- Source validation
- Dynamic processing

## G. Remaining Limitations

Be completely honest.

Do not claim a requirement is implemented if it is not.

---

# 47. FINAL SUCCESS CRITERIA

Consider this task successful ONLY if the existing application can demonstrate:

```text
Evaluator uploads unseen product dataset
             ↓
System identifies MPN + Manufacturer
             ↓
System searches authoritative sources
             ↓
Manufacturer source prioritized
             ↓
Product verified
             ↓
Technical information extracted
             ↓
Correct leaf taxonomy selected
             ↓
Category-specific attributes identified
             ↓
Attributes extracted
             ↓
Values + UOM normalized
             ↓
LOV validated
             ↓
New values detected
             ↓
Conflicts detected
             ↓
Five descriptions generated
             ↓
Manufacturer content preserved
             ↓
Every field has provenance
             ↓
Quality validation
             ↓
Commerce-ready enriched product
             ↓
Export / Review
```

The application must perform this using **real dynamic data**, not mocked data.

---

# MOST IMPORTANT INSTRUCTION

**Do not optimize for making the UI look impressive while the backend is fake.**

For UniHack 2026, prioritize:

**Correctness → Dynamic Pipeline → Source Authenticity → Data Quality → Explainability → Robustness → Cost Efficiency → UI Polish**

The existing design is already available.

**Keep the design. Upgrade the intelligence behind it.**

Start by auditing the existing codebase and creating the requirement compliance matrix internally. Then implement all missing/partial requirements and finally run an end-to-end verification.