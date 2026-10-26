# SentinelSOC Design System Rules & Specification

> [!IMPORTANT]
> ### Priority Hierarchy & Source of Truth:
> 1. **Primary Resource (Highest Priority)**: The specific designs, mockups, or Figma screens provided by the user. When implementing components, always prioritize the user's actual design as the first resource and ground truth, even if it differs slightly from the baseline design system tokens.
> 2. **Secondary Reference**: This design system specification (tokens, typography, colors, scales) provides the underlying aesthetic foundation and fallback values.

---

## 1. Typography

| Role | Font Family | Size / Line-Height | Weight | Letter Spacing | CSS / Tailwind Class |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display** | Bricolage Grotesque | 56px / 1.0 (56px) | 800 (ExtraBold) | -0.03em | `font-heading text-[56px] leading-none font-extrabold tracking-[-0.03em]` |
| **Heading 1** | Bricolage Grotesque | 40px / 1.1 (44px) | 800 (ExtraBold) | -0.02em | `font-heading text-[40px] leading-[1.1] font-extrabold tracking-[-0.02em]` |
| **Heading 2** | Bricolage Grotesque | 28px / 1.2 (34px) | 800 (ExtraBold) | -0.02em | `font-heading text-[28px] leading-[1.2] font-extrabold tracking-[-0.02em]` |
| **Heading 3** | Bricolage Grotesque | 20px / 1.3 (26px) | 800 (ExtraBold) | -0.01em | `font-heading text-[20px] leading-[1.3] font-extrabold tracking-[-0.01em]` |
| **Body** | Hanken Grotesk | 15px / 1.55 (23px) | 400 (Regular) | 0 | `font-sans text-[15px] leading-[1.55] font-normal` |
| **Small** | Hanken Grotesk | 13px / 1.5 (20px) | 500 (Medium) | 0 | `font-sans text-[13px] leading-[1.5] font-medium` |
| **Caption** | Hanken Grotesk | 12px / 1.4 (17px) | 500 (Medium) | +0.01em | `font-sans text-[12px] leading-[1.4] font-medium tracking-[0.01em]` |

- **Bricolage Grotesque** carries headings, key KPI numbers, and display text (`font-heading`).
- **Hanken Grotesk** carries all interface body text, data tables, labels, form controls, and metadata (`font-sans`).

---

## 2. Color Palette & Semantic Tokens

### 2.1 Brand Palette
- **Ink (Primary)**: `#22223b` — Deep rich night ink, used for primary dark elements, titles, and light-theme buttons.
- **Plum (Secondary)**: `#4a4e69` — Subdued slate-plum for secondary actions and headers.
- **Mauve (Neutral)**: `#9a8c98` — Balanced neutral for secondary text and borders.
- **Rose (Accent)**: `#c9ada7` — Warm muted rose accent for highlights and active rings.
- **Paper (Surface)**: `#f2e9e4` — Warm parchment cream background in light mode.

### 2.2 Neutral Scale (Paper to Ink)
| Token | HEX | Typical Usage |
| :--- | :--- | :--- |
| `neutral-50` | `#f2e9e4` | Page background (light), primary foreground (dark) |
| `neutral-100` | `#dbd3d1` | Borders, subtle card backgrounds (light) |
| `neutral-200` | `#c4bdbe` | Inactive borders, dividers |
| `neutral-300` | `#ada7ac` | Muted icons, placeholders |
| `neutral-400` | `#969199` | Secondary captions |
| `neutral-500` | `#7e7a86` | Medium contrast text |
| `neutral-600` | `#676473` | High readability secondary text |
| `neutral-700` | `#504e61` | Dark neutral accents |
| `neutral-800` | `#39384e` | Dark mode surface elevated |
| `neutral-900` | `#22223b` | Dark mode base surface / primary text in light |

### 2.3 Status Colors
Always accompany status colors with a symbol, indicator dot, or text badge:
- **Success**:
  - `success-100`: `#e5f4eb` (Background)
  - `success-500`: `#5cad86` (Indicator dot / icon)
  - `success-700`: `#245a43` (Text on badge)
- **Warning**:
  - `warning-100`: `#fff3d6` (Background)
  - `warning-500`: `#e7b33c` (Indicator dot / icon)
  - `warning-700`: `#75521a` (Text on badge)
- **Error / Critical**:
  - `error-100`: `#fbe8eb` (Background)
  - `error-500`: `#b83d4d` (Indicator dot / icon / destructive button)
  - `error-700`: `#8f293a` (Text on badge)
- **Info / Neutral**:
  - `info-100`: `#dde7f8` (Background)
  - `info-500`: `#8fb0e6` (Indicator dot / icon)
  - `info-700`: `#485873` (Text on badge)

---

## 3. Spacing & Grid System

- **Base Unit**: 4px
- `space-1`: 4px
- `space-2`: 8px
- `space-3`: 12px
- `space-4`: 16px
- `space-5`: 24px
- `space-6`: 32px
- `space-7`: 48px
- `space-8`: 64px

### Breakpoints
- **sm (560px)**: Single column, stacked KPIs.
- **md (820px)**: Two columns, collapsed sidebar.
- **lg (980px)**: Sidebar appears.
- **xl (1280px)**: Full multi-column dashboard grid.

---

## 4. Radii, Elevation & Opacity

### 4.1 Radii
- **`sm` (8px)**: Inputs, small cards, tooltips (`rounded-[8px]`, 1px border).
- **`md` (12px)**: Default buttons, cards, containers (`rounded-[12px]`, 1px border).
- **`lg` (20px)**: Metric cards, sections, large modal dialogs (`rounded-[20px]`, 2px border).
- **`pill` (99px / full)**: Badges, status tags, toggle pills (`rounded-full`, 2px border).

### 4.2 Elevation / Shadows
- `sh-sm`: `0 1px 3px rgba(34, 34, 59, 0.08)` (Cards, form inputs)
- `sh-md`: `0 4px 8px -1px rgba(34, 34, 59, 0.12), 0 2px 4px -2px rgba(34, 34, 59, 0.08)` (Dropdowns, menus)
- `sh-lg`: `0 12px 24px -4px rgba(34, 34, 59, 0.16), 0 4px 6px -2px rgba(34, 34, 59, 0.08)` (Modals, command palette, drawers)

### 4.3 Opacity Steps
- 100%, 80%, 60%, 40%, 20%

---

## 5. Buttons
- **Sizes**:
  - `Small`: 32px height, 13px font, 12px padding x (`h-8 text-[13px] px-3 rounded-[8px]`)
  - `Medium`: 40px height, 14px font, 16px padding x (`h-10 text-[14px] px-4 rounded-[12px]`)
  - `Large`: 50px height, 15px font, 20px padding x (`h-[50px] text-[15px] px-5 rounded-[12px]`)
- **Variants**:
  - `Primary`: Solid Ink `#22223b` (Light theme) or Paper `#f2e9e4` (Dark theme), with high contrast text.
  - `Secondary / Outline`: Transparent or warm card background with 1px/2px border in `#22223b`.
  - `Destructive`: `#b83d4d` background with `#8f293a` border and white text.
  - `Loading`: Displays inline circular spinner and disables interaction.

---

## 6. Forms & Inputs
- Always include:
  1. Visible `<label>` with `*` for required fields.
  2. Input container with 40-45px height, rounded corners, and clear focus ring.
  3. Helper text or validation message below the input.
- Passwords must include interactive show/hide toggle.
- Search inputs must feature a leading or trailing search icon.
- Textareas should show live character counters (e.g. `0 / 120`).

---

## 7. Feedback & Status
- **Status Pills**: Pill radius, containing an 8px circular colored dot + status label.
- **Alerts**: Dismissible banner with border and close icon.
- **Toasts**: Floating temporary feedback banner with status styling.
- **Progress Bars**: Rounded progress tracks with primary accent fill and optional animated pulse.
- **Empty States**: Centered illustration/icon, clear explanation, and primary action button (e.g. "Clear filters").

---

## 8. Data Display & Interactive Patterns
- **KPI Metric Cards**: Centered or left-aligned big numeric values (Bricolage Grotesque) with trend badge (e.g. `▲ 12% vs last week`).
- **Data Tables**: Clean row dividers, sortable column headers, clear typography.
- **Accordion**: One open at a time pattern.
- **Command Palette**: Global `Ctrl+K` / `Cmd+K` searchable dialog with instant filtering.
