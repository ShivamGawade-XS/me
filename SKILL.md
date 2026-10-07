---
name: design-system-shivam-gawade-portfolio
description: >
  Apply the Shivam_Gawade · Portfolio design system when building or updating UI.
  Use when creating components, choosing colors or typography,
  or reviewing designs for dashboard interfaces.
---

# Shivam_Gawade · Portfolio — Design System Skill

## When to Use

- Building new UI components for Shivam_Gawade · Portfolio.
- Reviewing or updating existing component styles.
- Choosing colors, typography, or spacing for dashboard pages.
- Checking designs against the extracted token set.

## Context

- **Product:** Shivam_Gawade · Portfolio — https://www.gitskins.com/portfolio-templates/sameera-material/runtime/?username=ShivamGawade-XS
- **Surface:** dashboard
- **Audience:** Business users and internal teams
- **Character:** Data-driven application interface with a rich, diverse color palette and 5 typefaces.

## Tokens

### Colors

| Token | Value | Role |
|-------|-------|------|
| color-1 | `#10251F` | Text Primary |
| color-2 | `#53645D` | Text Primary |
| color-4 | `#9E9EFF` | Text Secondary |
| color-3 | `#1E705F` | Accent |
| color-5 | `#4AFFBD` | Accent |
| color-6 | `#D9E8DF` | Text Light |
| color-7 | `#F5F7F3` | Text Light |
| color-8 | `#FFFFFF` | Text Light |

### Typography

**Font stack:** Google Sans Flex, ui-monospace, system-ui, Font Awesome 7 Free, Times New Roman

| Level | Size | Usage |
|-------|------|-------|
| text-xs | 11px | Captions, metadata |
| text-sm | 13px | Labels, secondary text |
| text-base | 15px | Body text (default) |
| text-lg | 16px | Subheadings, emphasis |
| text-xl | 18px | Section headings |
| text-2xl | 37px | Section headings |
| text-3xl | 48px | Section headings |

**Weight scale:** 400 · 600 · 700 · 900
**Line heights:** 21.12px · 43.2px · 24px · 55.2px · 21.344px · 19.2px · 13.824px · 26.88px · 22.8px · 18px · 13.2px · 12px · 12.8px · 15.2px · 16px

### Spacing

**Base unit:** 4px

`space-1: 2px` · `space-2: 4px` · `space-3: 6px` · `space-4: 7px` · `space-5: 8px` · `space-6: 10px` · `space-7: 12px` · `space-8: 14px` · `space-9: 16px` · `space-10: 18px` · `space-11: 20px` · `space-12: 26px` · `space-13: 32px` · `space-14: 34px` · `space-15: 78px`

### Shapes

**Border radius:** `radius-sm: 16px` · `radius-md: 17px` · `radius-lg: 20px` · `radius-xl: 22px` · `radius-full: 26px` · `radius-6: 999px`

### Elevation

- **shadow-sm:** `rgba(30, 70, 55, 0.07) 0px 18px 44px 0px`
- **shadow-md:** `rgba(25, 70, 55, 0.12) 0px 18px 46px 0px`

### Motion

- **duration-fast:** `all`
- **duration-fast:** `none`
- **duration-fast:** `transform 0.12s linear`
- **duration-base:** `transform 0.22s`
- **duration-base:** `transform 0.22s, border-color 0.22s, box-shadow 0.22s`
- **duration-base:** `0.3s`
- **duration-slow:** `0.5s ease-in-out`
- **duration-slow:** `0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.1s`
- **duration-slow:** `opacity 0.65s 0.42s, transform 0.65s cubic-bezier(0.2, 0.75, 0.25, 1) 0.42s`
- **duration-slow:** `opacity 0.7s 0.065s, transform 0.7s cubic-bezier(0.2, 0.75, 0.25, 1) 0.065s`
- **duration-slow:** `opacity 0.7s 0.13s, transform 0.7s cubic-bezier(0.2, 0.75, 0.25, 1) 0.13s`

## Component Inventory

- **Links:** 17 detected
- **Navigation:** 1 elements
- **Lists:** 1 detected

## Constraints

### Always

- Use tokens from the tables above — do not introduce new values.
- Include hover, focus-visible, and disabled states for interactive elements.
- Follow the 4px spacing grid.
- Meet WCAG 2.2 AA contrast minimums.

### Never

- Do not introduce colors outside the extracted palette.
- Do not use arbitrary spacing values — stick to the scale.
- Do not mix border-radius values. Pin to the detected set (16px, 17px, 20px, 22px, 26px, 999px).
- Do not use decorative shadows on data-dense layouts.
- Do not hide critical status information behind interactions.
- Do not ship components without defining hover, focus-visible, and disabled states.

## Tone

Efficient, data-forward, action-oriented. Labels over sentences.

## Authoring Workflow

When creating or documenting a component for this system:

1. State intent — one sentence on purpose.
2. Map tokens — list every token the component uses.
3. Define anatomy — named parts with token assignments.
4. Specify states — default, hover, focus-visible, active, disabled, loading, error, empty.
5. Describe interactions — keyboard, pointer, touch, edge cases.
6. Add a11y criteria — testable pass/fail checks.
7. List anti-patterns — concrete misuse examples.
8. Close with the Definition of Done checklist.

## Output Structure

Component guidelines must contain, in order:

1. Overview (purpose, when to use, when not to use)
2. Tokens and foundations
3. Anatomy, variants, responsive behavior
4. States and interactions
5. Accessibility (ARIA, contrast, focus, screen reader)
6. Content guidelines (copy rules, tone)
7. Anti-patterns with reasoning

## Component Requirements

- Reference only tokens from the tables above.
- Define all states: default, hover, focus-visible, active, disabled, loading, error.
- Handle edge cases: empty, overflow, truncation, max content.
- Include keyboard navigation behavior.
- Document ARIA roles and labels.

## Definition of Done

- Default state renders (smoke test).
- All states visually verified.
- Zero hardcoded visual values — tokens only.
- Keyboard navigation works without pointer.
- No critical a11y violations.
- Tested at min and max breakpoint.
- At least one anti-pattern documented.
- Purpose, usage, and limitations documented.
