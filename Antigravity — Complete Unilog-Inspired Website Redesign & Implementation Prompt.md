# Complete Website UI/UX Transformation — Unilog-Inspired Enterprise B2B SaaS Design

You are working on an **existing website/codebase**. Your task is to completely review, redesign, refine, and implement the website according to the requirements below.

## IMPORTANT WORKING PRINCIPLE

Do **not** simply create a new website from scratch.

First:

1. Inspect the complete existing codebase.
2. Understand the current architecture, pages, components, routing, functionality, data flow, and existing design system.
3. Identify what already satisfies the requirements.
4. Identify what partially satisfies the requirements.
5. Identify what is completely missing.
6. Preserve existing business logic, functionality, content, integrations, APIs, authentication, database logic, and working features unless a change is absolutely required for the new UI/UX.
7. Implement all required design changes directly into the existing project.
8. Do not remove useful existing functionality just to simplify the implementation.
9. Maintain responsive behavior across desktop, tablet, and mobile.
10. After implementation, perform a final visual and functional audit against every requirement in this prompt.

The final website should feel like a **premium enterprise B2B SaaS / industrial technology platform**, inspired by the visual language described below.

Do NOT make it look like a generic startup template.

---

# 1. OVERALL DESIGN DIRECTION

Transform the website into a:

**Modern Enterprise B2B SaaS + Industrial Technology + Product Intelligence platform**

The visual language should communicate:

- Enterprise credibility
- Technical sophistication
- Reliability
- Industrial/B2B professionalism
- Modern SaaS product quality
- Trust
- Scalability
- Data intelligence
- AI-powered technology

Use a clean, structured, premium visual system.

Avoid:

- Excessive gradients
- Overly rounded cards
- Cartoonish illustrations
- Excessive glassmorphism
- Neon cyberpunk styling
- Unnecessary animations
- Huge decorative elements
- Cluttered layouts
- Low-contrast text
- Generic AI-generated startup aesthetics

The design should be **clean, confident, technical, and enterprise-grade**.

---

# 2. DESIGN SYSTEM

Create or refactor the existing design system so that colors, typography, spacing, borders, shadows, buttons, cards, and interactions remain consistent throughout the entire application.

Use CSS variables/design tokens where appropriate.

## Primary Color Palette

### Deep Navy

Use primarily for:

- Headings
- Dark sections
- Footer
- Hero accents
- Important enterprise elements

Preferred:

`#0A192F`
`#0F172A`

### Electric Teal / Cyan

Use for:

- Icons
- Highlights
- Small accents
- Badges
- Active states
- Important visual indicators

Preferred:

`#00A896`
`#00C2CB`

### Royal / Cobalt Blue

Use for:

- Primary CTA buttons
- Important links
- Interactive controls
- Focus states

Preferred:

`#1D4ED8`
`#2563EB`

### Coral / Amber

Use sparingly for:

- Notifications
- Awards
- Important secondary highlights
- Status indicators

Preferred:

`#FF6B4A`
`#F59E0B`

### Light Background

Use:

`#FFFFFF`
`#F8FAFC`

### Borders

Use:

`#E2E8F0`
`#CBD5E1`

### Body Text

Use:

`#334155`
`#475569`

Do not randomly introduce unrelated colors.

---

# 3. TYPOGRAPHY

Use a modern professional sans-serif.

Preferred font:

**Inter**

Alternative:

**Plus Jakarta Sans**

Use the font consistently across the application.

## Headings

H1:

- 600–700 weight
- Deep navy
- Tight letter spacing
- Strong visual hierarchy
- Responsive font sizing

H2:

- 600–700 weight
- Deep navy

H3:

- 600 weight

## Body

- 400 weight
- Comfortable line height
- Slate/charcoal color
- Excellent readability

## Small Labels / Eyebrows

Use:

- 11–13px
- 600–700 weight
- Uppercase where appropriate
- Increased letter spacing
- Teal or blue accent

Avoid excessive uppercase text.

---

# 4. GLOBAL SPACING & LAYOUT

Use a consistent spacing system.

The website should have:

- Generous whitespace
- Clear section separation
- Strong alignment
- Consistent content widths
- Professional grid layouts

Use a maximum content width approximately around:

`1200px–1280px`

depending on the existing layout.

Avoid content touching the screen edges.

Desktop:

- Spacious horizontal padding
- Clear grid alignment

Tablet:

- Reduce spacing proportionally

Mobile:

- Comfortable side padding
- No horizontal overflow
- Proper stacking

---

# 5. HEADER / NAVIGATION

Redesign the existing header to match the enterprise SaaS aesthetic.

## Header

Use:

- White background
- Sticky positioning
- Subtle bottom border
- Very subtle shadow after scrolling

Header should feel clean and lightweight.

## Logo

Keep the existing brand logo if one already exists.

Do not unnecessarily redesign the brand identity.

Ensure:

- Correct sizing
- Proper alignment
- Good whitespace
- High-resolution rendering

## Navigation Links

Use:

`#1E293B` / `#334155`

Font:

400–500

Hover:

Transition toward:

`#2563EB`

or

`#00A896`

Transitions should be smooth.

## Header CTA

Place the primary CTA on the right side.

Examples:

- Get Started
- Schedule a Demo
- Request Demo
- Contact Sales

Use the existing website's actual CTA/content where applicable.

Style:

- Blue background
- White text
- 6–8px radius
- Medium/semibold font
- Subtle hover elevation

---

# 6. MEGA MENU / DROPDOWNS

If the website has dropdown navigation, redesign it as a premium enterprise mega-menu.

Use:

- White background
- Rounded 8–12px container
- Large soft shadow
- Thin border
- Multi-column structure where appropriate

Dropdown animation:

- Fade in
- Slight vertical movement
- Around 150–250ms
- Smooth easing

Do not use aggressive animations.

Ensure dropdowns work properly on:

- Desktop
- Keyboard navigation
- Mobile

---

# 7. HERO SECTION

Redesign the hero section to create an immediate enterprise-level impression.

Hero should have:

- Strong H1
- Supporting paragraph
- Primary CTA
- Secondary CTA where appropriate
- Relevant visual/product representation
- Excellent whitespace
- Clear information hierarchy

Example visual hierarchy:

Eyebrow

↓

Large H1

↓

Supporting paragraph

↓

CTA group

↓

Product/platform visual

The H1 should communicate the actual product value proposition rather than generic marketing language.

Do not invent unnecessary claims.

Use the existing website's actual content wherever possible.

---

# 8. BUTTON SYSTEM

Create a reusable button system.

## Primary Button

Appearance:

- `#1D4ED8` or `#2563EB`
- White text
- 6–8px radius
- Medium/semibold typography

Hover:

- Slightly darker blue
- `translateY(-1px)`
- Subtle shadow

Active:

`scale(0.98)`

Transition:

approximately 150–200ms.

---

## Secondary Button

Appearance:

- Transparent
- 1px border
- Slate border
- Dark slate text

Hover:

- Light slate background
- Or navy background with white text where contextually appropriate

---

## Text Link

Use:

`Learn more →`

or equivalent.

On hover:

- Arrow moves 3–4px to the right
- Optional subtle underline
- Color transition

Example interaction:

Text → Learn more
Arrow → shifts slightly right

---

# 9. CARDS

Redesign cards throughout the website.

Cards should feel:

- Premium
- Structured
- Lightweight
- Enterprise-oriented

Use:

- White background
- `#E2E8F0` border
- 8–12px radius
- Very subtle shadow

Avoid giant rounded cards.

## Card Hover

On hover:

- Slight elevation
- Border color transition
- Subtle shadow increase
- Optional 1–2px vertical movement

Never make cards jump aggressively.

---

# 10. DARK SECTIONS

Introduce or refine alternating light/dark sections where appropriate.

Dark sections should use:

Background:

`#0A192F`
or
`#0F172A`

Text:

White / `#E2E8F0`

Accent:

Teal / blue

Use dark sections for:

- Product highlights
- Enterprise value propositions
- Statistics
- CTA sections
- Footer
- Technology sections

Do not make the entire website dark.

---

# 11. SECTION STRUCTURE

Review every page and section.

Improve section hierarchy using combinations of:

- Eyebrow
- H2
- Supporting paragraph
- Grid
- Cards
- Metrics
- Product visuals
- CTA

Every section should have a clear purpose.

Avoid sections that look visually identical.

---

# 12. PRODUCT / PLATFORM SECTIONS

For product/platform-related sections, use an enterprise SaaS structure.

Possible structure:

Left:

- Eyebrow
- Heading
- Description
- Benefits
- CTA

Right:

- Product UI
- Dashboard representation
- Data visualization
- Platform screenshot
- Technical visual

Use the existing product visuals where available.

Do not fabricate fake product capabilities.

---

# 13. METRICS / STATISTICS

If the existing website contains statistics such as:

- SKUs processed
- Customers
- Products
- Revenue impact
- Accuracy
- Growth
- Time saved

Present them using clean enterprise metric cards.

Example structure:

`10M+`
Products processed

`99%`
Data accuracy

`40%`
Time saved

Use animation only when the number enters the viewport.

Counter animations should be:

- Smooth
- Short
- Professional

Do not endlessly animate numbers.

---

# 14. TABS / TOGGLES

If the website contains customer/product categories such as:

- Distributors
- Manufacturers
- Specialty Retailers

or similar categories, redesign them as professional interactive tabs.

Requirements:

- Clear active state
- Teal/blue accent
- Smooth transition
- No page reload
- Accessible keyboard navigation
- Responsive mobile behavior

Content transitions should be subtle and fast.

---

# 15. ANIMATIONS

Use animation strategically.

The website should feel alive but not distracting.

## Scroll Reveal

Implement subtle:

`fade-in-up`

for:

- Cards
- Sections
- Metrics
- Content blocks
- Product showcases

Use approximately:

- 300–600ms duration
- Ease-out
- Small vertical movement

Avoid animating every tiny element.

---

## Dropdown Animation

Use:

- opacity
- translateY

Duration:

150–250ms

---

## Card Hover

Use:

- border-color transition
- box-shadow transition
- small translateY

---

## Button Hover

Use:

- background transition
- subtle elevation
- arrow movement where applicable

---

# 16. ACCESSIBILITY

Do not sacrifice accessibility for visual design.

Ensure:

- Proper semantic HTML
- Keyboard navigation
- Visible focus states
- Sufficient color contrast
- Accessible buttons
- Accessible dropdowns
- Proper heading hierarchy
- Alt text for meaningful images
- Reduced motion support

Respect:

`prefers-reduced-motion`

When reduced motion is enabled, minimize or disable non-essential animations.

---

# 17. RESPONSIVE DESIGN

This is mandatory.

Audit every page at:

### Desktop

1920px
1440px
1280px

### Tablet

1024px
768px

### Mobile

430px
390px
375px

Ensure:

- No horizontal scrolling
- No overlapping elements
- No clipped text
- No broken grids
- Buttons remain usable
- Navigation becomes mobile-friendly
- Cards stack properly
- Images scale correctly
- Typography scales responsively

Do not simply shrink the desktop layout.

Create intentional responsive layouts.

---

# 18. MOBILE NAVIGATION

Implement/refine a professional mobile navigation.

Use:

- Hamburger menu
- Full-width or slide-down menu
- Clear navigation hierarchy
- CTA
- Proper spacing
- Smooth open/close animation

Ensure the mobile menu cannot cause page overflow.

---

# 19. FOOTER

Redesign the footer as a premium enterprise footer.

Use deep navy background.

Include existing relevant:

- Navigation
- Product links
- Company links
- Contact information
- Social links
- Legal links
- Copyright

Use teal/blue accents sparingly.

Maintain excellent spacing.

---

# 20. FORMS

If forms exist:

Redesign inputs using:

- White/light backgrounds
- Slate borders
- 6–8px radius
- Clear labels
- Proper focus rings

Focus:

`#2563EB`

Validation states should be clear.

Error:

Coral/red family

Success:

Teal/green family

Do not rely only on color to communicate errors.

---

# 21. IMAGES & VISUAL ASSETS

Review all existing images.

Use existing assets whenever appropriate.

Do not replace important brand/product imagery unnecessarily.

Ensure:

- Proper aspect ratio
- Correct object-fit
- No distortion
- Consistent border radius
- Proper loading behavior

Use lazy loading where appropriate.

---

# 22. PERFORMANCE

While redesigning, do not negatively affect performance.

Check:

- Image optimization
- Lazy loading
- Unnecessary JavaScript
- Animation performance
- Component rendering
- CSS duplication
- Bundle size where applicable

Prefer:

CSS transforms and opacity for animations.

Avoid expensive layout-triggering animations.

---

# 23. CODE QUALITY

Do not solve the redesign by creating one huge component.

Maintain:

- Reusable components
- Reusable button variants
- Reusable card variants
- Reusable typography styles
- Reusable spacing
- Centralized design tokens
- Clean responsive CSS

If Tailwind is already being used, leverage Tailwind properly.

If another styling architecture is already established, work within it instead of unnecessarily migrating the entire project.

---

# 24. EXISTING FUNCTIONALITY MUST REMAIN WORKING

Before modifying anything, identify all existing functionality.

Examples:

- Authentication
- Forms
- API calls
- Database operations
- Search
- Filters
- Dashboard functionality
- Navigation
- Routing
- Modals
- Uploads
- Integrations
- Animations
- Existing interactive components

Do not break them.

UI changes should not alter business logic unless explicitly required.

---

# 25. DO NOT FABRICATE CONTENT

Very important:

Do not invent:

- Customers
- Statistics
- Certifications
- Awards
- Testimonials
- Product capabilities
- Integrations
- Business claims

If the current website has content, preserve and improve its presentation.

If content is missing but a UI component requires content, use neutral placeholders only where necessary and clearly structure them so they can be replaced later.

---

# 26. VISUAL CONSISTENCY AUDIT

After implementation, inspect the entire website.

Check:

### Typography

- Are all headings consistent?
- Are font weights consistent?
- Are body texts readable?

### Colors

- Are colors from the defined palette?
- Are accents used consistently?
- Are random colors removed?

### Buttons

- Are all CTA buttons consistent?
- Do hover/active states work?

### Cards

- Are radius, borders and shadows consistent?

### Spacing

- Are sections properly spaced?
- Are cards aligned?

### Navigation

- Does desktop navigation work?
- Does mobile navigation work?

### Animations

- Are animations subtle?
- Are they consistent?
- Do they respect reduced motion?

---

# 27. FINAL REQUIREMENT MATRIX

Before considering the task complete, verify each item:

- [ ] Enterprise B2B SaaS visual identity
- [ ] White sticky header
- [ ] Professional navigation
- [ ] Mega menu/dropdowns where applicable
- [ ] Enterprise CTA
- [ ] Inter/modern sans-serif typography
- [ ] Deep navy heading system
- [ ] Electric teal accents
- [ ] Royal blue CTAs
- [ ] Controlled coral/amber accents
- [ ] Consistent borders
- [ ] Consistent cards
- [ ] Primary button states
- [ ] Secondary button states
- [ ] Text-link arrow interactions
- [ ] Hero redesign
- [ ] Product/platform sections
- [ ] Metric sections
- [ ] Interactive tabs where applicable
- [ ] Dark/light alternating sections where appropriate
- [ ] Scroll reveal animations
- [ ] Dropdown animations
- [ ] Card hover interactions
- [ ] Responsive desktop layout
- [ ] Responsive tablet layout
- [ ] Responsive mobile layout
- [ ] Mobile navigation
- [ ] Accessible focus states
- [ ] Reduced motion support
- [ ] Footer redesign
- [ ] Forms redesigned where applicable
- [ ] Existing functionality preserved
- [ ] No fake business claims
- [ ] No horizontal overflow
- [ ] No broken routes
- [ ] No console errors
- [ ] No obvious visual inconsistencies

---

# 28. FINAL QA PROCESS

After making the changes:

1. Run the project.
2. Check all routes/pages.
3. Check browser console.
4. Check for runtime errors.
5. Test navigation.
6. Test buttons.
7. Test dropdowns.
8. Test forms.
9. Test interactive components.
10. Test mobile navigation.
11. Test responsive layouts.
12. Verify typography.
13. Verify colors.
14. Verify spacing.
15. Verify animations.
16. Verify accessibility.
17. Fix any issues found.
18. Perform one final visual pass.

Do not stop after making the first set of changes.

Continue iterating until the website looks cohesive and production-ready.

---

# 29. DESIGN QUALITY BAR

The final result should look like a website that could realistically belong to a serious:

**Enterprise B2B SaaS / Industrial Technology / Product Intelligence company.**

Think:

**Unilog-inspired enterprise design language + modern SaaS usability + industrial technology credibility.**

Do not copy Unilog's website directly.

Use the **design principles and visual language** described in this prompt while maintaining the website's own brand identity, content, and functionality.

The final result should feel:

**Clean → Technical → Premium → Trustworthy → Enterprise → Modern**

rather than:

**Flashy → Over-animated → Generic → Template-like**

---

## FINAL INSTRUCTION

Start by auditing the existing project.

Then create a clear internal checklist of:

**Existing → Needs Modification → Missing → Implemented**

After that, implement the required changes across the entire website.

Do not merely explain what should be changed.

**Actually modify the codebase and complete the redesign.**

When finished, perform the complete QA checklist above and fix all issues you discover.