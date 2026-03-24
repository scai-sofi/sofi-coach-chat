---
name: normalize
description: Normalize design to match your design system and ensure consistency
user-invocable: true
args:
  - name: feature
    description: The page, route, or feature to normalize (optional)
    required: false
---

Analyze and redesign the feature to perfectly match our design system standards, aesthetics, and established patterns.

## MANDATORY PREPARATION

Use the frontend-design skill — it contains design principles, anti-patterns, and the **Context Gathering Protocol**. Follow the protocol before proceeding — if no design context exists yet, you MUST run teach-impeccable first.

---

## Plan

Before making changes, deeply understand the context:

1. **Discover the design system**: Search for design system documentation, UI guidelines, component libraries, or style guides (grep for "design system", "ui guide", "style guide", etc.). Study it thoroughly until you understand:
   - Core design principles and aesthetic direction
   - Target audience and personas
   - Component patterns and conventions
   - Design tokens (colors, typography, spacing)
   
   **CRITICAL**: If something isn't clear, ask. Don't guess at design system principles.

2. **Analyze the current feature**: Assess what works and what doesn't:
   - Where does it deviate from design system patterns?
   - Which inconsistencies are cosmetic vs. functional?
   - What's the root cause—missing tokens, one-off implementations, or conceptual misalignment?

3. **Create a normalization plan**: Define specific changes that will align the feature with the design system:
   - Which components can be replaced with design system equivalents?
   - Which styles need to use design tokens instead of hard-coded values?
   - How can UX patterns match established user flows?
   
   **IMPORTANT**: Great design is effective design. Prioritize UX consistency and usability over visual polish alone. Think through the best possible experience for your use case and personas first.

## Execute

Systematically address all inconsistencies across these dimensions:

- **Typography**: Use design system fonts, sizes, weights, and line heights. Replace hard-coded values with typographic tokens or classes.
- **Color & Theme**: Apply design system color tokens. Remove one-off color choices that break the palette.
- **Spacing & Layout**: Use spacing tokens (margins, padding, gaps). Align with grid systems and layout patterns used elsewhere.
- **Components**: Replace custom implementations with design system components. Ensure props and variants match established patterns. When a Figma reference is available, cross-reference all component properties against it — icons are the highest-priority area, but every component should be verified against design tokens and Figma specs.
- **Icons**: Audit every icon for correct size, color, and stroke width against the project's icon definitions (design tokens, custom SVG components, Feather icon usage patterns). Icons at the same semantic level (e.g., all header action icons, all list item icons) must use identical size and stroke width. Flag and fix any icon using a hard-coded color instead of a design token. Custom SVG icons must follow the same stroke width conventions as the rest of the icon set. When a Figma file or frame is referenced, use Figma MCP tools to verify icon properties match exactly.
- **Shadows, Radii & Elevation**: Audit all box shadows, border radii, and elevation values against design tokens. Replace hard-coded values with the corresponding token or shared style. Components at the same hierarchy level (e.g., all cards, all modals, all buttons) must use consistent shadow and radius values. When a Figma reference is available, verify shadow spread/blur/offset and corner radius values match the spec exactly.
- **Motion & Interaction**: Match animation timing, easing, and interaction patterns to other features.
- **Responsive Behavior**: Ensure breakpoints and responsive patterns align with design system standards.
- **Accessibility**: Verify contrast ratios, focus states, ARIA labels match design system requirements.
- **Progressive Disclosure**: Match information hierarchy and complexity management to established patterns.

**NEVER**:
- Create new one-off components when design system equivalents exist
- Hard-code values that should use design tokens
- Introduce new patterns that diverge from the design system
- Compromise accessibility for visual consistency
- Use inconsistent icon sizes, colors, or stroke widths for icons at the same hierarchy level
- Hard-code shadow, border-radius, or elevation values when design tokens exist
- Apply different corner radii or shadow styles to components at the same semantic level

This is not an exhaustive list—apply judgment to identify all areas needing normalization.

## Clean Up

After normalization, ensure code quality:

- **Consolidate reusable components**: If you created new components that should be shared, move them to the design system or shared UI component path.
- **Remove orphaned code**: Delete unused implementations, styles, or files made obsolete by normalization.
- **Verify quality**: Lint, type-check, and test according to repository guidelines. Ensure normalization didn't introduce regressions.
- **Ensure DRYness**: Look for duplication introduced during refactoring and consolidate.

Remember: You are a brilliant frontend designer with impeccable taste, equally strong in UX and UI. Your attention to detail and eye for end-to-end user experience is world class. Execute with precision and thoroughness.