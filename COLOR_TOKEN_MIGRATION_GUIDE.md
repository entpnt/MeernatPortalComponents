# Color Token Migration Guide

## Purpose
This document provides the standardized mapping from hardcoded colors to CSS variables for full light/dark mode support.

## Color Mapping Reference

### Text Colors
| Hardcoded Color | CSS Variable | Use Case |
|----------------|--------------|----------|
| `text-[#F8FAFC]` | `text-foreground` | Primary text |
| `text-[#64748B]` | `text-muted-foreground` | Secondary/muted text |
| `text-white` | `text-primary-foreground` (on primary bg) or `text-foreground` | White text |
| `text-[#020817]` | `text-background` | Dark text (rare, usually for inverse) |
| `text-[#E60000]` | `text-[var(--error)]` | Error state text |
| `text-[#147FFF]` | `text-[var(--info)]` or `text-[var(--primary)]` | Info/primary text |

### Background Colors
| Hardcoded Color | CSS Variable | Use Case |
|----------------|--------------|----------|
| `bg-[#0F172A]` | `bg-card` | Card backgrounds |
| `bg-[#020817]` | `bg-input-background` | Input backgrounds |
| `bg-[#1E293B]` | `bg-secondary` or `bg-muted` | Secondary backgrounds |
| `bg-[#2D3F5E]` | `bg-secondary/80` or `hover:bg-secondary` | Hover states |
| `bg-white` | `bg-primary` (for badges) or `bg-background` (light mode) | White background |

### Border Colors
| Hardcoded Color | CSS Variable | Use Case |
|----------------|--------------|----------|
| `border-[#1E293B]` | `border-border` | All borders |
| `border-[#2e2e2e]` | `border-border` | All borders |

### Focus/Ring Colors
| Hardcoded Color | CSS Variable | Use Case |
|----------------|--------------|----------|
| `focus:ring-[#147FFF]` | `focus:ring-ring` | Focus rings |
| `ring-[#147FFF]` | `ring-ring` | Focus rings |

### Special Semantic Colors
| Hardcoded Color | CSS Variable | Use Case |
|----------------|--------------|----------|
| `#21DB00` or green | `var(--success)` | Success states |
| `#E60000` or red | `var(--error)` | Error/destructive states |
| `#f59e0b` or orange/yellow | `var(--warning)` | Warning states |
| `#147FFF` or blue | `var(--info)` or `var(--primary)` | Info states |

## Component-Specific Patterns

### Tabs (Active State)
```tsx
// BEFORE
className={activeTab === 'tab1' ? 'text-[#F8FAFC] bg-[#1E293B]' : 'text-muted-foreground hover:text-[#F8FAFC]'}

// AFTER
className={activeTab === 'tab1' ? 'text-foreground bg-secondary' : 'text-muted-foreground hover:text-foreground'}
```

### Input Fields
```tsx
// BEFORE
className="bg-[#020817] border-[#1E293B] text-[#F8FAFC] placeholder:text-[#64748B] focus:ring-[#147FFF]"

// AFTER
className="bg-input-background border-input text-foreground placeholder:text-muted-foreground focus:ring-ring"
```

### Select Dropdowns
```tsx
// BEFORE
<SelectTrigger className="bg-[#020817] border-[#1E293B] text-[#F8FAFC]">
<SelectContent className="bg-[#0F172A] border-[#1E293B]">

// AFTER
<SelectTrigger className="bg-input-background border-input text-foreground">
<SelectContent className="bg-popover border-border">
```

### Cards
```tsx
// BEFORE
className="bg-[#0F172A] border border-[#1E293B]"

// AFTER
className="bg-card border border-border"
```

### Table Rows
```tsx
// BEFORE
className="border-b border-[#1E293B] hover:bg-[#1E293B]/30"

// AFTER
className="border-b border-border hover:bg-muted/50"
```

### Buttons (Secondary/Ghost)
```tsx
// BEFORE
className="bg-[#1E293B] border-[#1E293B] text-[#F8FAFC] hover:bg-[#2D3F5E]"

// AFTER
className="bg-secondary border-border text-secondary-foreground hover:bg-secondary/80"
```

### Status Badges
```tsx
// BEFORE
className="bg-white text-[#020817]"  // For completed/active status

// AFTER
className="bg-primary text-primary-foreground"
```

### Labels
```tsx
// BEFORE
<Label className="text-[#F8FAFC]">Field Name</Label>

// AFTER
<Label className="text-foreground">Field Name</Label>
```

### Helper Text
```tsx
// BEFORE
<p className="text-xs text-[#64748B]">Helper text</p>

// AFTER
<p className="text-xs text-muted-foreground">Helper text</p>
```

## Complete CSS Variable Reference

### Available Theme Tokens
```css
/* Base Colors */
--background: /* Main background */
--foreground: /* Main text color */

/* Card Colors */
--card: /* Card background */
--card-foreground: /* Card text */

/* Popover Colors */
--popover: /* Popover/dropdown background */
--popover-foreground: /* Popover text */

/* Primary Colors (Dynamic) */
--primary: /* Primary button background */
--primary-foreground: /* Primary button text */

/* Secondary Colors */
--secondary: /* Secondary background */
--secondary-foreground: /* Secondary text */

/* Muted Colors */
--muted: /* Muted background */
--muted-foreground: /* Muted text */

/* Accent Colors */
--accent: /* Accent background */
--accent-foreground: /* Accent text */

/* Border & Input */
--border: /* All borders */
--input: /* Input border */
--input-background: /* Input background */
--ring: /* Focus ring */

/* Semantic Colors */
--success: /* Success/positive states */
--warning: /* Warning states */
--error: /* Error/destructive states */
--info: /* Info states */
--destructive: /* Destructive action */
--destructive-foreground: /* Destructive text */
```

## Files Requiring Updates

### ✅ Completed
- [x] ActiveSubscriptionsContent.tsx

### 🔄 In Progress
- [ ] AddNetworkModal.tsx
- [ ] AddVendorModal.tsx
- [ ] CancelledSubscriptionsContent.tsx (if has hardcoded colors)
- [ ] PendingSubscriptionsContent.tsx (if has hardcoded colors)
- [ ] DashboardContent.tsx (check for remaining issues)
- [ ] AnalyticsContent.tsx (check for remaining issues)
- [ ] AllSubscribersContent.tsx (check for remaining issues)

## Validation Checklist

After migration, verify:
- [ ] No hex colors (#...) in className attributes
- [ ] No rgb/rgba/hsl values in className or style attributes
- [ ] No arbitrary Tailwind values like `bg-[#...]`, `text-[#...]`, `border-[#...]`
- [ ] Light mode renders correctly
- [ ] Dark mode renders correctly
- [ ] All interactive states (hover, focus, active) work properly
- [ ] Theme switching doesn't break any UI elements

## Exception: var(--variable) Usage

It IS acceptable to use:
- `text-[var(--success)]`
- `bg-[var(--error)]`
- `text-[var(--warning)]`

These reference CSS variables and will adapt to theme changes.
