# Typography Accessibility Standards

## Overview
This document outlines the mandatory typography and font size standards for the entire Management Portal application. These standards are designed to ensure maximum readability, accessibility compliance, and usability across all devices and screen densities.

## Core Principles

### 1. Minimum Readable Font Size
**No interactive or frequently viewed UI text should be smaller than 14px.**

This applies to:
- Navigation menus and sidebar items
- Tabs and tab labels
- Buttons and button labels
- Form labels and input fields
- Table headers and table data
- Dropdown menu items
- Breadcrumbs
- Modal content
- Alert messages and notifications
- Any primary UI text that users interact with or reference frequently

### 2. Restricted Use of 12px (text-xs)
**12px may ONLY be used for low-priority, non-interactive metadata.**

Acceptable uses:
- Timestamps (e.g., "Updated 2 hours ago")
- Helper metadata (e.g., "Last sync: 10:45 AM")
- Legal disclaimers and fine print
- Secondary captions and annotations
- Non-critical supplementary information

**Even in these cases, ensure sufficient color contrast for accessibility.**

### 3. Never Use 12px For:
❌ Navigation items  
❌ Menu items  
❌ Buttons  
❌ Form labels  
❌ Table headers  
❌ Input placeholders  
❌ Interactive elements  
❌ Primary content text  
❌ Any text users need to read frequently

## Typography Scale

### Design Tokens

```css
/* Typography Variables */
--text-xs: 0.75rem;   /* 12px - RESTRICTED: metadata only */
--text-sm: 0.875rem;  /* 14px - MINIMUM for interactive UI */
--text-base: 1rem;    /* 16px - Default body text */
--text-lg: 1.125rem;  /* 18px */
--text-xl: 1.25rem;   /* 20px */
--text-2xl: 1.5rem;   /* 24px */
--text-3xl: 1.875rem; /* 30px */
--text-4xl: 2.25rem;  /* 36px */
```

### Tailwind Class Mapping

| Tailwind Class | Size | Usage |
|----------------|------|-------|
| `text-xs` | 12px | **RESTRICTED** - Metadata, timestamps, disclaimers only |
| `text-sm` | 14px | **MINIMUM** - All interactive UI elements |
| `text-base` | 16px | Default body text, paragraphs |
| `text-lg` | 18px | Emphasized text, large buttons |
| `text-xl` | 20px | Section subheadings |
| `text-2xl` | 24px | Page headings (h1) |
| `text-3xl` | 30px | Hero headings |
| `text-4xl` | 36px | Marketing/landing headings |

## Application Across Components

### Navigation & Menus
- **Sidebar Items**: `text-sm` (14px) minimum
- **Dropdown Menus**: `text-sm` (14px) minimum
- **Breadcrumbs**: `text-sm` (14px)
- **Tabs**: `text-sm` (14px) minimum

### Forms & Inputs
- **Form Labels**: `text-base` (16px) default
- **Input Fields**: `text-base` (16px)
- **Placeholders**: `text-base` (16px)
- **Helper Text**: `text-sm` (14px)
- **Error Messages**: `text-sm` (14px)
- **Timestamps near inputs**: `text-xs` (12px) - acceptable as metadata

### Tables
- **Table Headers**: `text-sm` (14px) minimum
- **Table Data**: `text-sm` (14px) minimum
- **Row Metadata** (e.g., "Last updated"): `text-xs` (12px) - acceptable

### Buttons
- **Primary Buttons**: `text-base` (16px) default
- **Secondary Buttons**: `text-base` (16px) default
- **Small Buttons**: `text-sm` (14px) minimum - never smaller

### Cards & Dashboards
- **Card Titles**: `text-lg` (18px) or larger
- **Card Body Text**: `text-sm` (14px) minimum
- **Card Metadata**: `text-xs` (12px) - acceptable for timestamps, update info

### Modals & Dialogs
- **Modal Titles**: `text-xl` (20px) or larger
- **Modal Body**: `text-base` (16px)
- **Modal Actions**: `text-base` (16px)
- **Modal Footnotes**: `text-sm` (14px) minimum

### Alerts & Notifications
- **Alert Titles**: `text-base` (16px)
- **Alert Messages**: `text-sm` (14px)
- **Alert Timestamps**: `text-xs` (12px) - acceptable

## Accessibility Standards

### WCAG Compliance
- All text must meet **WCAG 2.1 Level AA** contrast requirements minimum
- Interactive elements must have sufficient color contrast (4.5:1 for normal text, 3:1 for large text)
- Text must be resizable up to 200% without loss of functionality

### High-DPI Considerations
- Font sizes are specified in `rem` units for proper scaling across devices
- Base font size is set to 16px (1rem) for optimal readability on modern displays
- All typography scales proportionally on high-density screens (Retina, 4K, etc.)

### Mobile & Responsive Design
- On mobile devices, maintain minimum 14px for interactive elements
- Consider increasing font sizes on smaller screens for better touch target accessibility
- Never reduce font sizes below the minimums to "fit more content" on mobile

## Implementation Enforcement

### Design System Level
Typography standards are enforced at the design token level in `/src/styles/theme.css`:

```css
:root {
  --font-size: 16px; /* Base font size */
  
  /* Typography tokens with restricted usage warnings */
  --text-xs: 0.75rem;   /* RESTRICTED */
  --text-sm: 0.875rem;  /* MINIMUM for UI */
  --text-base: 1rem;    /* Default */
  /* ... */
}
```

### Component Defaults
Default HTML elements have baseline font sizes:
- `<button>`: `text-base` (16px)
- `<label>`: `text-base` (16px)
- `<input>`: `text-base` (16px)
- `<h1>` through `<h4>`: Progressively smaller from `text-2xl` to `text-base`

### Code Review Guidelines
When reviewing code, check:
1. ✅ No `text-xs` on interactive elements
2. ✅ Navigation uses `text-sm` or larger
3. ✅ Buttons use `text-base` or `text-sm` minimum
4. ✅ Form elements use `text-base` or `text-sm` minimum
5. ✅ `text-xs` only appears on metadata like timestamps

## Examples

### ✅ Correct Usage

```tsx
// Navigation - text-sm minimum
<nav className="text-sm">
  <a href="/dashboard">Dashboard</a>
</nav>

// Button - text-base default
<button className="text-base font-medium">
  Save Changes
</button>

// Table with metadata
<table>
  <thead>
    <tr className="text-sm">
      <th>Customer Name</th>
    </tr>
  </thead>
  <tbody>
    <tr className="text-sm">
      <td>
        John Doe
        <div className="text-xs text-muted-foreground">
          Updated 2 hours ago {/* Metadata - text-xs acceptable */}
        </div>
      </td>
    </tr>
  </tbody>
</table>

// Form - text-base default
<form>
  <label className="text-base font-medium">Email Address</label>
  <input type="email" className="text-base" />
  <p className="text-sm text-muted-foreground">We'll never share your email</p>
</form>
```

### ❌ Incorrect Usage

```tsx
// ❌ WRONG: Navigation too small
<nav className="text-xs">
  <a href="/dashboard">Dashboard</a>
</nav>

// ❌ WRONG: Button text too small
<button className="text-xs">
  Save Changes
</button>

// ❌ WRONG: Table headers too small
<table>
  <thead>
    <tr className="text-xs">
      <th>Customer Name</th>
    </tr>
  </thead>
</table>

// ❌ WRONG: Form label too small
<form>
  <label className="text-xs">Email Address</label>
</form>
```

## Exceptions

Very rare exceptions may be made for:
1. **Complex data visualizations** where space is extremely constrained
2. **Legal compliance text** that must match specific formatting requirements
3. **Third-party embedded components** that cannot be modified

All exceptions must:
- Be documented with a comment explaining why
- Ensure sufficient color contrast (minimum 4.5:1)
- Be approved during code review
- Have a plan to address the accessibility concern if possible

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Material Design Typography](https://m3.material.io/styles/typography/overview)
- [Apple Human Interface Guidelines - Typography](https://developer.apple.com/design/human-interface-guidelines/typography)

## Version History

- **v1.0** (February 2026) - Initial typography standards established
  - Minimum 14px for interactive UI elements
  - Restricted 12px to metadata only
  - Design token enforcement in theme.css
