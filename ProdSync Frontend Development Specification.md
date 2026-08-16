# ProdSync — Frontend Development Specification

## 1. Project Overview

Build a production-quality, modern, responsive frontend for **ProdSync**, an AI-powered Product Intelligence platform designed for industrial commerce.

### Product Name

**ProdSync**

### Product Category

AI-Powered Product Intelligence for Industrial Commerce

### Core Product Idea

ProdSync transforms scattered, incomplete, and unstructured industrial product information into accurate, structured, validated, enriched, and commerce-ready product intelligence.

Industrial companies may have product information distributed across:

- Websites
- Product catalogs
- PDFs
- Technical documents
- Datasheets
- Manuals
- Images
- Spreadsheets
- Supplier documents
- Existing product databases

ProdSync provides a centralized interface where users can upload or provide limited product information and use AI to:

1. Extract product information
2. Structure the information
3. Detect missing fields
4. Validate existing information
5. Enrich incomplete product data
6. Identify inconsistencies
7. Explain AI-generated decisions
8. Generate commerce-ready product records
9. Manage large product catalogs

The frontend must communicate these capabilities visually and clearly.

---

# 2. Primary Design Goal

The interface should immediately communicate:

> **"Turn scattered industrial product information into reliable, structured product intelligence."**

The design should feel:

- Professional
- Enterprise-grade
- Technical
- Intelligent
- Reliable
- Clean
- Modern
- Fast
- Data-focused
- Trustworthy

Avoid making it look like a generic chatbot or consumer AI application.

The application should feel comparable to a modern enterprise SaaS platform used by product managers, catalog managers, procurement teams, industrial suppliers, and technical sales teams.

---

# 3. Recommended Frontend Stack

Use a modern production-ready stack.

### Core

- Next.js
- React
- TypeScript

### Styling

- Tailwind CSS
- CSS variables for design tokens

### UI

Use reusable, accessible UI components.

Recommended:

- shadcn/ui
- Radix UI where appropriate
- Lucide icons

Do NOT use emojis as UI icons.

Use SVG-based icons consistently.

### Animation

Use:

- Framer Motion / Motion
- CSS transitions
- CSS keyframes where appropriate

Animations must be subtle and purposeful.

Do not overload the application with unnecessary animations.

### Authentication

Use Firebase Authentication.

Supported authentication methods:

- Email + Password
- Google
- Microsoft

Authentication UI must include:

- Login
- Register
- Forgot Password
- Email verification state
- Authentication loading state
- Authentication error state
- Logout
- Protected application routes

### Backend Compatibility

The frontend should be designed so that the backend can later provide:

- AI processing
- Product extraction
- Product validation
- Product enrichment
- Catalog management
- File processing
- Analytics
- User management

Do not tightly couple the UI to mock/static data structures.

Create clean service/API abstraction layers.

---

# 4. Design Language

## Visual Direction

Use a premium enterprise SaaS aesthetic.

The visual language should combine:

- Industrial technology
- AI intelligence
- Data systems
- Product catalogs
- Technical documentation

Avoid:

- Excessive gradients
- Neon cyberpunk styling
- Gaming-style UI
- Excessive glassmorphism
- Huge decorative illustrations
- Emoji-based UI
- Cartoon-like visuals

Use restrained gradients only where they improve hierarchy.

---

# 5. Color System

Create a professional light-first design system.

### Primary

Use a strong blue/indigo family representing:

- Intelligence
- Technology
- Trust
- Enterprise software

### Secondary

Use neutral slate/gray tones for:

- Tables
- Metadata
- Secondary text
- Borders
- Backgrounds

### Semantic Colors

Green:

- Valid
- Verified
- Successful
- Complete

Yellow/amber:

- Warning
- Needs review
- Missing information

Red:

- Invalid
- Critical issue
- Validation failure

Blue:

- AI generated
- Processing
- Information

Do not use colors arbitrarily.

Every color should have a semantic purpose.

---

# 6. Typography

Use a modern professional sans-serif font.

Recommended:

- Inter
- Geist
- Manrope

Use clear hierarchy:

### Display

Large headings for landing page sections.

### H1

Main page titles.

### H2

Section headings.

### H3

Card titles.

### Body

Readable product descriptions and explanations.

### Metadata

Small but highly readable technical information.

Avoid excessively small text.

---

# 7. Logo

Create a clean SVG-based **ProdSync** logo.

The logo should communicate:

- Products
- Synchronization
- Intelligence
- Structured data

Possible visual direction:

A minimal abstract symbol combining:

- Product/data nodes
- Synchronization arrows
- Structured grid
- AI intelligence

Use an SVG logo.

Do NOT use emoji symbols.

The logo should work in:

- Navbar
- Login page
- Dashboard sidebar
- Favicon
- Loading screen
- Mobile header

---

# 8. Application Structure

The application should have two major experiences.

## Public Website

Routes:

```text
/
 /features
 /how-it-works
 /solutions
 /about
 /login
 /register
 /forgot-password
```

## Authenticated Application

Routes:

```text
/app
/app/dashboard
/app/products
/app/products/[id]
/app/catalogs
/app/catalogs/[id]
/app/import
/app/validation
/app/enrichment
/app/processing
/app/analytics
/app/activity
/app/settings
```

---

# 9. Landing Page

The landing page must immediately explain the problem and solution.

## Navbar

Left:

ProdSync logo

Center/right:

- Product
- Features
- How it Works
- Solutions

Right:

- Sign In
- Get Started

Navbar should become sticky after scrolling.

Use subtle backdrop blur.

---

# 10. Hero Section

Hero headline:

## Transform Product Data Into Product Intelligence

Supporting text:

ProdSync uses AI to transform scattered industrial product information into structured, validated, enriched, and commerce-ready data.

Primary CTA:

**Start Building Your Catalog**

Secondary CTA:

**See How It Works**

Add a visually impressive product intelligence dashboard preview.

The hero visual should show a transformation pipeline:

```text
Unstructured Information
        ↓
AI Extraction
        ↓
Validation
        ↓
Enrichment
        ↓
Structured Product
        ↓
Commerce Ready
```

Animate the pipeline subtly.

Use SVG graphics and UI components instead of stock illustrations.

---

# 11. Problem Section

Create a section explaining the industrial data problem.

Heading:

## Product Information Is Everywhere. Intelligence Isn't.

Show different information sources:

- PDF
- Website
- Datasheet
- Spreadsheet
- Product Image
- Technical Manual

These should visually converge into ProdSync.

Use animated connection lines.

Explain:

Industrial product information is often fragmented across multiple sources, making manual catalog creation slow, inconsistent, and difficult to validate.

---

# 12. Solution Section

Heading:

## From Scattered Data to Structured Intelligence

Show four major capabilities.

### 01 — Extract

Extract product attributes from limited or unstructured information.

### 02 — Validate

Detect inconsistencies, missing values, suspicious values, and conflicting information.

### 03 — Enrich

Use AI to intelligently complete missing product information.

### 04 — Structure

Convert raw information into standardized commerce-ready product records.

Each capability should have an SVG icon.

Add hover animation.

---

# 13. AI Intelligence Visualization

Create an interactive section demonstrating AI processing.

Example:

```text
Product Datasheet
       ↓
AI Extraction
       ↓
Attribute Detection
       ↓
Validation Engine
       ↓
AI Enrichment
       ↓
Confidence Scoring
       ↓
Structured Product
```

Each stage should animate when entering the viewport.

Use subtle Motion animations.

---

# 14. Explainable AI Section

This is extremely important because the challenge explicitly asks for explainable outputs.

Heading:

## AI That Explains Its Decisions

Show a product attribute card.

Example:

```text
Operating Temperature

Value:
-20°C to 80°C

Status:
Verified

Confidence:
94%

Source:
Technical Datasheet

AI Reason:
"Value extracted directly from the manufacturer's
technical specification section."
```

Show:

- Confidence score
- Source
- Validation reason
- AI reasoning summary
- Data provenance

Do NOT expose hidden chain-of-thought or private internal reasoning.

Instead show concise, user-facing explanations such as:

- "Extracted from technical datasheet"
- "Matched against manufacturer specification"
- "Detected conflicting values across two sources"
- "Value inferred from related product specifications"

---

# 15. Product Intelligence Dashboard

The authenticated dashboard is the core of the product.

Layout:

```text
------------------------------------------------
Sidebar       Top Navigation
------------------------------------------------
              Dashboard Content
------------------------------------------------
```

## Sidebar

Logo

Navigation:

- Dashboard
- Products
- Catalogs
- Import Data
- AI Processing
- Validation
- Enrichment
- Analytics
- Activity

Bottom:

- Settings
- Help
- User Profile

Sidebar should be collapsible.

---

# 16. Dashboard Overview

Display high-level product intelligence metrics.

Cards:

### Total Products

Example:

12,480

### AI Processed

Example:

10,842

### Validated

Example:

9,421

### Needs Review

Example:

327

### Enrichment Opportunities

Example:

1,284

### Data Quality Score

Example:

94.2%

Use animated number counters.

Do not hardcode fake values into production.

Create data interfaces and loading states so backend data can be connected later.

---

# 17. Dashboard Data Quality Visualization

Create charts for:

- Product completeness
- Validation success rate
- AI enrichment rate
- Products requiring review
- Data quality trend

Use a clean charting library such as Recharts.

Charts should be responsive.

Avoid unnecessarily complex visualizations.

---

# 18. Product Catalog Page

Route:

```text
/app/products
```

This page should provide a professional enterprise data table.

Columns:

- Product
- SKU
- Category
- Manufacturer
- Completeness
- Validation
- AI Confidence
- Last Updated
- Status
- Actions

Features:

- Search
- Filter
- Sort
- Pagination
- Column visibility
- Bulk selection
- Bulk validation
- Bulk enrichment
- Export
- Import

Use skeleton loaders.

Do not render large datasets inefficiently.

Use pagination or virtualization when appropriate.

---

# 19. Product Detail Page

Route:

```text
/app/products/[id]
```

This is one of the most important pages.

Structure:

### Product Header

Show:

- Product image
- Product name
- SKU
- Manufacturer
- Category
- Status
- AI confidence

Actions:

- Edit
- Validate
- Enrich
- Export
- Delete

---

# 20. Product Information Sections

Use tabs:

```text
Overview
Specifications
AI Intelligence
Validation
Sources
History
```

## Overview

Display core product information.

## Specifications

Display technical attributes in a structured table.

Example:

| Attribute      | Value           | Status       |
| -------------- | --------------- | ------------ |
| Material       | Stainless Steel | Verified     |
| Voltage        | 220V            | Verified     |
| Operating Temp | -20°C to 80°C   | AI Validated |
| Weight         | 12.4 kg         | Verified     |

Use badges instead of excessive colors.

---

# 21. AI Intelligence Tab

Show:

### Completeness

Example:

87%

### Confidence

Example:

93%

### Enriched Fields

List fields enriched by AI.

### Missing Fields

List fields requiring additional information.

### AI Suggestions

Show suggested values with:

- Confidence
- Source
- Explanation
- Accept
- Reject
- Edit

This allows human-in-the-loop validation.

---

# 22. Validation Interface

Create a dedicated validation workspace.

Show issues grouped by severity.

### Critical

Conflicting or invalid information.

### Warning

Potential inconsistency.

### Information

Recommended improvements.

Example:

```text
Operating Pressure

Source A:
10 bar

Source B:
12 bar

AI Detection:
Conflict detected

Recommended Action:
Review source documents
```

Actions:

- Accept
- Reject
- Resolve
- View Source

---

# 23. AI Enrichment Interface

Create an enrichment workspace.

Show:

```text
Current Product Data
        ↓
Missing Attributes
        ↓
AI Enrichment
        ↓
Suggested Values
        ↓
Human Review
        ↓
Approved Product Data
```

Each AI suggestion must include:

- Suggested value
- Confidence
- Reason/source summary
- Accept
- Reject
- Edit

Do not silently modify important product data.

---

# 24. Import Data Page

Route:

```text
/app/import
```

Allow users to add product information through:

- Upload PDF
- Upload CSV
- Upload Excel
- Upload product catalog
- Enter URL
- Paste product information
- Add manual product

Create a drag-and-drop upload interface.

Example:

```text
Drop product documents here

PDF
CSV
XLSX

or

Browse Files
```

Show upload progress.

After upload:

```text
File Uploaded
      ↓
Processing
      ↓
Extracting
      ↓
Validating
      ↓
Ready for Review
```

---

# 25. Processing Page

Create a visual AI processing experience.

Show stages:

```text
Document Received        ✓
Text Extraction          ✓
Product Detection        ✓
Attribute Extraction     ✓
Normalization            ✓
Validation               ●
Enrichment               ○
Final Structuring        ○
```

Use animated progress indicators.

Do not use fake indefinite loading.

Frontend must be prepared for real backend processing states.

---

# 26. Catalog Management

Route:

```text
/app/catalogs
```

Display catalog cards/table.

Each catalog should show:

- Catalog name
- Product count
- Data quality
- Validation rate
- Last updated
- Processing status

Actions:

- Open
- Import
- Validate
- Export
- Delete

---

# 27. Catalog Detail

Show:

### Catalog Overview

- Total products
- Completeness
- Validation rate
- Enrichment rate

### Product Distribution

Display categories and manufacturers.

### Quality Overview

Display:

- Missing fields
- Invalid fields
- Conflicting fields
- AI-generated fields

### Recent Activity

Show catalog changes.

---

# 28. Analytics

Create an enterprise analytics page.

Metrics:

- Total products processed
- Processing time
- Data completeness
- Validation accuracy
- Enrichment rate
- Human review rate

Visualizations:

- Quality trend
- Processing volume
- Validation distribution
- Completeness distribution

---

# 29. Search

Implement global search UI.

Search should eventually support:

- Product names
- SKU
- Manufacturer
- Category
- Technical attributes
- Catalogs

Use a command palette style interface.

Keyboard shortcut:

```text
Ctrl + K
```

Use SVG icons.

---

# 30. Notifications

Create notification center.

Notification examples:

- Catalog processing completed
- Validation requires review
- AI enrichment completed
- Import failed
- Product conflict detected

Use clear semantic icons.

---

# 31. Authentication

Use Firebase Authentication.

## Login

Provide:

### Email

- Email input
- Password input
- Show/hide password
- Remember session

### Google

Use official Google SVG logo.

### Microsoft

Use official Microsoft SVG logo.

Do NOT use emojis.

### Additional

- Forgot password
- Register
- Email verification
- Authentication errors
- Loading states

---

# 32. Registration

Fields:

- Full Name
- Work Email
- Password
- Confirm Password

Optional onboarding:

```text
What best describes your role?

Product Manager
Catalog Manager
Procurement
Sales
Engineering
Administrator
Other
```

This should be stored through the backend later.

---

# 33. Onboarding

After first login, show a short onboarding experience.

Step 1:

## Welcome to ProdSync

Step 2:

## Add Your First Product

Step 3:

## Upload Product Data

Step 4:

## Let AI Structure and Validate It

Step 5:

## Review Your Product Intelligence

Keep onboarding short.

Allow skipping.

---

# 34. Empty States

Every major page must have meaningful empty states.

Example:

## No Products Yet

Upload your first product document and let ProdSync transform it into structured product intelligence.

Button:

**Import Product Data**

Do not leave blank screens.

---

# 35. Loading States

Implement skeleton loading for:

- Dashboard cards
- Tables
- Product details
- Catalogs
- Analytics
- Notifications

Use shimmer animations sparingly.

Never show a blank white screen while data is loading.

---

# 36. Error States

Create professional error UI.

Example:

## Something Went Wrong

We couldn't load your product data. Please try again.

Buttons:

- Retry
- Go to Dashboard

Also handle:

- Network errors
- Authentication errors
- File upload errors
- API errors
- Permission errors
- Validation errors

---

# 37. Responsive Design

The entire application must be responsive.

### Desktop

Full sidebar + dashboard.

### Tablet

Collapsible sidebar.

### Mobile

Bottom navigation or mobile drawer where appropriate.

Tables should transform into:

- Horizontal scrolling
- Cards
- Stacked information

Do not simply shrink desktop layouts.

---

# 38. Accessibility

Follow accessibility best practices.

Requirements:

- Semantic HTML
- Keyboard navigation
- Visible focus states
- Accessible form labels
- ARIA labels where needed
- Good contrast
- Reduced-motion support
- Screen-reader-friendly buttons
- Accessible dialogs
- Accessible dropdowns

Respect:

```text
prefers-reduced-motion
```

---

# 39. Animation Guidelines

Use animations to communicate state and hierarchy.

Good animations:

- Page transitions
- Card hover
- Sidebar expansion
- Modal appearance
- Table filtering
- AI processing
- Progress indicators
- Number counters
- Data pipeline animation
- Scroll reveal

Avoid:

- Excessive bouncing
- Constant movement
- Distracting backgrounds
- Long animation durations

Recommended duration:

```text
150ms – 400ms
```

Use spring animations for interactive components where appropriate.

---

# 40. AI Processing Visual Language

AI-related UI should have a consistent visual language.

For example:

```text
AI Generated
AI Validated
AI Suggested
AI Enriched
AI Confidence
```

Use a small AI indicator/icon.

Never rely only on color.

---

# 41. Data Provenance

Because this is an industrial product intelligence system, data provenance should be visible.

Every important AI-generated or validated field should be able to show:

- Source
- Source type
- Source location
- Confidence
- Validation status
- Last updated
- AI-generated indicator

This is important for trust and explainability.

---

# 42. Human-in-the-Loop Design

Do not design the system as a fully automatic black box.

The UI should communicate:

```text
AI Suggests
      ↓
User Reviews
      ↓
User Approves
      ↓
Product Becomes Trusted
```

Important product data should allow human approval.

---

# 43. SEO

The public website must be SEO-friendly.

Implement:

- Proper metadata
- Semantic HTML
- Open Graph metadata
- Twitter/X metadata
- Sitemap
- Robots configuration
- Canonical URLs
- Descriptive page titles
- Proper heading hierarchy

Suggested homepage title:

```text
ProdSync — AI-Powered Product Intelligence for Industrial Commerce
```

Suggested description:

```text
Transform scattered industrial product information into structured,
validated, enriched, and commerce-ready product intelligence with AI.
```

The authenticated dashboard does not need public SEO optimization.

---

# 44. Performance

Performance is a major requirement.

Optimize for:

- Fast initial load
- Code splitting
- Lazy loading
- Image optimization
- SVG optimization
- Minimal JavaScript
- Efficient API calls
- Pagination
- Virtualized large tables
- Memoization where useful

Avoid unnecessary dependencies.

Do not load large libraries for simple functionality.

Use Next.js optimization features.

Target excellent Lighthouse scores.

---

# 45. Component Architecture

Use reusable components.

Suggested structure:

```text
components/
  ui/
  layout/
  navigation/
  dashboard/
  products/
  catalogs/
  validation/
  enrichment/
  import/
  analytics/
  ai/
  charts/
  forms/
  auth/
  feedback/
```

Example reusable components:

```text
ProductCard
ProductTable
ProductStatusBadge
ConfidenceBadge
ValidationIssue
AIInsightCard
SourceCard
MetricCard
DataQualityCard
UploadZone
ProcessingTimeline
EmptyState
ErrorState
Skeleton
SearchCommand
```

---

# 46. API Architecture

Do not directly call APIs from every component.

Create an API/service layer.

Example:

```text
services/
  auth.service.ts
  product.service.ts
  catalog.service.ts
  validation.service.ts
  enrichment.service.ts
  import.service.ts
  analytics.service.ts
```

This allows the backend to be integrated later without rewriting the UI.

---

# 47. Type Safety

Use TypeScript interfaces/types for:

```text
Product
ProductAttribute
Catalog
ValidationResult
ValidationIssue
EnrichmentSuggestion
AIInsight
ProductSource
ProcessingJob
User
Organization
Analytics
Notification
```

Avoid:

```typescript
any
```

wherever practical.

---

# 48. State Management

Use lightweight state management.

Use:

- React state for local UI
- Server state/query library for API data
- Context only when appropriate

Avoid putting everything into one global state.

---

# 49. Security Considerations

Frontend must never expose:

- Firebase private credentials
- Backend secrets
- API keys that should remain server-side
- LLM provider secrets

Use environment variables appropriately.

Implement protected routes.

Unauthenticated users must not access `/app/*`.

---

# 50. Demo / Hackathon Optimization

Because ProdSync will be evaluated as a hackathon project, the frontend should make the complete value proposition visible within a few minutes.

The judge should easily understand:

```text
Problem
   ↓
Input
   ↓
AI Processing
   ↓
Structured Data
   ↓
Validation
   ↓
Enrichment
   ↓
Explainability
   ↓
Commerce-ready Product
```

The main dashboard should make these capabilities immediately discoverable.

---

# 51. Core Challenge Alignment

The UI must directly represent the four expected outcomes.

## Structured Data Generation

Represent through:

- Product extraction
- Structured product tables
- Product attribute management
- Catalog creation

## Accuracy & Consistency

Represent through:

- Validation dashboard
- Conflict detection
- Data quality scores
- Confidence scores
- Validation statuses

## AI Validation & Enrichment

Represent through:

- AI suggestions
- Enrichment workspace
- Validation workspace
- AI confidence
- Source attribution

## Scalable Catalog Engine

Represent through:

- Catalog management
- Bulk import
- Bulk processing
- Pagination
- Bulk validation
- Bulk enrichment
- Analytics

---

# 52. Main User Journey

The primary journey should be:

```text
Landing Page
      ↓
Get Started
      ↓
Authentication
      ↓
Dashboard
      ↓
Import Product Data
      ↓
Upload PDF / CSV / XLSX / URL
      ↓
AI Processing
      ↓
Structured Product Generated
      ↓
Validation
      ↓
AI Enrichment
      ↓
Human Review
      ↓
Approved Product
      ↓
Catalog
      ↓
Analytics
```

Make this journey extremely smooth.

---

# 53. Product Detail Example

A product page should visually communicate something like:

```text
Industrial Hydraulic Pump
--------------------------------------------

SKU: HP-4500
Manufacturer: Example Industries
Category: Hydraulic Equipment

Data Quality          AI Confidence
94%                   96%

--------------------------------------------

Specifications

Pressure        250 bar       ✓ Verified
Flow Rate       120 L/min     ✓ Verified
Material        Stainless     ✓ Verified
Weight          18.5 kg       AI Suggested
Temperature     -20–80°C      AI Validated

--------------------------------------------

AI Insights

3 attributes enriched
1 attribute requires review
12 attributes verified

--------------------------------------------

Sources

Technical Datasheet
Manufacturer Website
Product Catalog
```

This is only a UI reference. Do not hardcode this information into the application.

---

# 54. No Static Product Data

Do not build the final application around static fake product data.

Mock data may be temporarily used during UI development only.

Create clean mock/service adapters so that mock data can later be replaced with real backend APIs.

The architecture must clearly separate:

```text
UI
 ↓
Service Layer
 ↓
API
 ↓
Backend
 ↓
AI / Database
```

---

# 55. Visual Quality Requirements

The final interface must look polished enough for:

- Hackathon judging
- Product demonstrations
- Screenshots
- Portfolio
- Future SaaS development

Avoid anything that looks like a template.

Focus heavily on:

- Spacing
- Typography
- Alignment
- Consistent borders
- Card hierarchy
- Data density
- Empty states
- Loading states
- Micro-interactions

---

# 56. Final Quality Checklist

Before considering the frontend complete, verify:

- [ ] ProdSync branding is consistent
- [ ] No emojis are used as UI icons
- [ ] SVG icons/logos are used
- [ ] Firebase email authentication works
- [ ] Google authentication is prepared
- [ ] Microsoft authentication is prepared
- [ ] Protected routes work
- [ ] Landing page is responsive
- [ ] Dashboard is responsive
- [ ] Product catalog works
- [ ] Product detail page works
- [ ] Validation UI works
- [ ] Enrichment UI works
- [ ] Import workflow works
- [ ] AI processing workflow exists
- [ ] Explainable AI UI exists
- [ ] Data provenance is represented
- [ ] Confidence scoring is represented
- [ ] Human review workflow exists
- [ ] Catalog management exists
- [ ] Analytics exists
- [ ] Search exists
- [ ] Notifications exist
- [ ] Loading states exist
- [ ] Error states exist
- [ ] Empty states exist
- [ ] Mobile responsive layout exists
- [ ] Accessibility is considered
- [ ] SEO metadata exists
- [ ] Performance is optimized
- [ ] No unnecessary dependencies are used
- [ ] API/service abstraction exists
- [ ] TypeScript types are properly defined
- [ ] No sensitive keys are exposed
- [ ] No unnecessary static data is embedded
- [ ] Backend integration can be added without major UI rewrites

---

# 57. Overall Design Principle

The final product should communicate one simple idea:

> **ProdSync turns fragmented industrial product information into trusted product intelligence.**

Every major UI decision should reinforce one or more of these concepts:

**Extract → Structure → Validate → Enrich → Explain → Scale**

The result should feel like a real enterprise AI product, not a hackathon prototype.
