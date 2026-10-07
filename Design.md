# Shivam_Gawade · Portfolio

## Overview

**Product:** Shivam_Gawade · Portfolio
**URL:** https://www.gitskins.com/portfolio-templates/sameera-material/runtime/?username=ShivamGawade-XS
**Surface type:** dashboard
**Audience:** Business users and internal teams
**Brand character:** Data-driven application interface with a rich, diverse color palette and 6 typefaces.

> **Note:** Surface detection confidence is low. Verify the inferred audience and brand context before relying on this file.

### Design Principles

- Data visibility — the most important metric should be visible without interaction.
- Progressive disclosure — surface summaries, reveal detail on demand.
- Efficiency over decoration — every pixel should communicate state or enable action.

## Colors

| Token | Value | Role |
|-------|-------|------|
| color-8 | `#FFFFFF` | Background |
| color-1 | `#10251F` | Text Primary |
| color-2 | `#53645D` | Text Primary |
| color-4 | `#9E9EFF` | Text Secondary |
| color-3 | `#1E705F` | Accent |
| color-5 | `#4AFFBD` | Accent |
| color-6 | `#D9E8DF` | Text Light |
| color-7 | `#F5F7F3` | Text Light |

## Typography

**Font stack:** Google Sans Flex, ui-monospace, system-ui, Font Awesome 7 Free, Font Awesome 7 Brands, Times New Roman

| Level | Size | Usage |
|-------|------|-------|
| text-xs | 10px | Captions, metadata |
| text-sm | 11px | Labels, secondary text |
| text-base | 12px | Body text (default) |
| text-lg | 15px | Subheadings, emphasis |
| text-xl | 16px | Section headings |
| text-2xl | 18px | Section headings |
| text-3xl | 37px | Section headings |
| text-4xl | 48px | Section headings |
| text-9 | 76px | General use |

**Weight scale:** 400 · 600 · 700 · 900
**Line heights:** 63.3456px · 43.2px · 21.12px · 24px · 15.808px · 26.04px · 22.8px · 19.5px · 19.2px · 13.824px · 55.2px · 21.344px · 18px · 11.904px · 13.2px · 15px · 12px · 12.8px · 18.4px

## Spacing

**Base unit:** 4px

`space-1: 2px` · `space-2: 4px` · `space-3: 5px` · `space-4: 6px` · `space-5: 7px` · `space-6: 8px` · `space-7: 9px` · `space-8: 10px` · `space-9: 12px` · `space-10: 14px` · `space-11: 16px` · `space-12: 18px` · `space-13: 20px` · `space-14: 26px` · `space-15: 28px` · `space-16: 30px` · `space-17: 40px` · `space-18: 78px` · `space-19: 102px` · `space-20: 150px`

## Shapes

**Border radius:** `radius-sm: 16px` · `radius-md: 20px` · `radius-lg: 22px` · `radius-full: 50%` · `radius-full: 999px`

## Elevation

- **shadow-sm:** `rgba(30, 112, 95, 0.18) 0px 12px 26px 0px`
- **shadow-md:** `rgba(25, 70, 55, 0.12) 0px 18px 46px 0px`
- **shadow-lg:** `rgba(40, 76, 64, 0.24) 0px 24px 80px 0px`

## Motion

- **duration-fast:** `all`
- **duration-fast:** `none`
- **duration-fast:** `transform 0.12s linear`
- **duration-base:** `transform 0.2s, border-color 0.2s, background 0.2s`
- **duration-base:** `transform 0.2s, background 0.2s`
- **duration-base:** `transform 0.2s, box-shadow 0.2s`
- **duration-base:** `0.3s`
- **duration-slow:** `0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.1s`
- **duration-slow:** `0.5s ease-in-out`
- **duration-slow:** `0.5s cubic-bezier(0.175, 0.885, 0.32, 1.1)`

## Components

- **Links:** 17 detected
- **Navigation:** 1 elements
- **Lists:** 1 detected

## Do's and Don'ts

### Do

- Reference tokens by name, not raw values — agents and developers should use `color.text.primary`, not `#171717`.
- Define all interactive states: default, hover, focus-visible, active, disabled.
- Use the spacing scale for all padding, margin, and gap values.
- Write content in sentence case. Reserve ALL CAPS for acronyms only.
- Test every component at the smallest and largest breakpoint before shipping.

### Don't

- Do not introduce colors outside the extracted palette.
- Do not use arbitrary spacing values — stick to the scale.
- Do not mix border-radius values. Pin to the detected set (16px, 20px, 22px, 50%, 999px).
- Do not use decorative shadows on data-dense layouts.
- Do not hide critical status information behind interactions.
- Do not ship components without defining hover, focus-visible, and disabled states.

## Writing Tone

Efficient, data-forward, action-oriented. Labels over sentences.

## Authoring Workflow

When creating or updating a component guideline for this system, follow this sequence:

1. **State the intent** — one sentence on what the component does and why it exists.
2. **Map tokens** — list every color, spacing, typography, and radius token the component uses. No raw values.
3. **Define anatomy** — break the component into named parts (container, label, icon, etc.) with their token assignments.
4. **Specify states** — document every state: default, hover, focus-visible, active, disabled, loading, error, empty.
5. **Describe interactions** — keyboard, pointer, and touch behavior, including edge cases (long content, overflow, truncation).
6. **Add accessibility criteria** — write testable pass/fail checks (e.g. "focus ring must be visible at 3:1 contrast").
7. **List anti-patterns** — concrete examples of misuse with a brief explanation of why each is wrong.
8. **Close with a QA checklist** — a mechanical list of verifiable items (see Definition of Done below).

## Required Output Structure

Every component guideline produced from this system must contain these sections, in order:

1. Overview — purpose, when to use, when not to use.
2. Tokens and foundations — all referenced tokens from the tables above.
3. Anatomy and variants — named parts, variant matrix, responsive behavior.
4. States and interactions — full state table, keyboard/pointer/touch behavior.
5. Accessibility — ARIA attributes, contrast requirements, focus management, screen reader behavior.
6. Content guidelines — copy length, tone, capitalisation, placeholder text rules.
7. Anti-patterns — explicit examples of what not to build, with reasoning.

## Component Requirements

Every component built against this system must:

- Reference only tokens defined in the tables above — no hardcoded hex, px, or font values.
- Define all interactive states: default, hover, focus-visible, active, disabled, loading, error.
- Specify responsive behavior at the smallest and largest supported breakpoint.
- Handle edge cases: empty state, overflow / truncation, maximum content length.
- Include keyboard navigation (Tab, Enter, Escape, Arrow keys where applicable).
- Document ARIA roles, labels, and live-region behavior where relevant.
- Include known page component density: - **Links:** 17 detected
- **Navigation:** 1 elements
- **Lists:** 1 detected

## Definition of Done

A component is not complete until every item below is checked:

- Renders correctly in its default state (smoke test).
- All states documented and visually verified (hover, focus, disabled, loading, error, empty).
- All visual values use design tokens — zero hardcoded values.
- Keyboard navigation works without a pointer.
- No critical accessibility violations (contrast, ARIA, focus order).
- Tested at smallest and largest breakpoint.
- Anti-patterns section lists at least one concrete misuse example.
- Documentation covers purpose, usage, props/API, and limitations.
