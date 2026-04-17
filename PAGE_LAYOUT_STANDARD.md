# Page Layout Standard

This document defines the consistent page layout structure for all content pages in the application.

## Standard Page Structure

```tsx
export function PageContent() {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* 1. Page Header - Always mb-8 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">Page Title</h1>
          <p className="text-[var(--muted-foreground)]">Page description</p>
        </div>

        {/* 2. Tabs (if applicable) - Always mt-8 mb-8 */}
        <div className="mt-8 mb-8">
          <TabMenu /> {/* or manual tab buttons with flex gap-2 border-b */}
        </div>

        {/* 3. Main Content */}
        <div className="space-y-8">
          {/* Statistics Cards - mb-8 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Card components */}
          </div>

          {/* Search/Filters - mb-8 */}
          <div className="mb-8">
            {/* Search component */}
          </div>

          {/* Data Tables or Content */}
          {/* Additional sections */}
        </div>
      </div>
    </div>
  );
}
```

## Spacing Guidelines

### Container Spacing
- **Outer padding**: `p-6` on main container
- **Max width wrapper**: `max-w-7xl mx-auto`

### Section Spacing
- **Page header**: `mb-8` bottom margin
- **Title to description**: `mb-2` on title
- **Tabs section**: `mt-8 mb-8` (top and bottom margin)
- **Statistics cards**: `mb-8` bottom margin
- **Search/Filter sections**: `mb-8` bottom margin
- **Content sections**: `space-y-8` for vertical spacing between items

### Tab Content Spacing
- **Tab content container**: `space-y-8` for consistent vertical rhythm
- **Section headers within tabs**: `mb-8` bottom margin
- **Card grids**: `gap-6` for grid spacing

## Component Patterns

### Page Header
```tsx
<div className="mb-8">
  <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">Title</h1>
  <p className="text-[var(--muted-foreground)]">Description</p>
</div>
```

### Tabs with Manual Buttons
```tsx
<div className="flex gap-2 mt-8 mb-8 border-b border-[var(--border)]">
  <button className={`px-4 py-2.5 text-sm font-medium transition-all relative ${...}`}>
    Tab Label
  </button>
</div>
```

### Tabs with TabMenu Component
```tsx
<div className="mt-8 mb-8">
  <TabMenu
    activeTab={activeTab}
    onTabChange={setActiveTab}
    tabs={[...]}
  />
</div>
```

### Statistics Card Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
  <Card className="bg-[var(--card)] border border-[var(--border)] p-6">
    {/* Card content */}
  </Card>
</div>
```

## Color Variables

Always use CSS variables for theming:
- `var(--foreground)` - Primary text
- `var(--muted-foreground)` - Secondary text
- `var(--card)` - Card background
- `var(--border)` - Borders
- `var(--secondary)` - Secondary background
- `var(--success)`, `var(--warning)`, `var(--error)` - Status colors

## Pages Updated

- [x] AllSubscribersContent
- [x] OnboardingContent  
- [x] AnalyticsContent
- [x] DashboardContent
- [x] DevicesContent
- [x] ProvidersContent

## Key Standardizations Applied

### Structure
1. **Container Nesting**: All pages now follow `<div className="p-6">` → `<div className="max-w-7xl mx-auto">` pattern
2. **Header Spacing**: Changed from inconsistent `mb-6` to standardized `mb-8`
3. **Tab Spacing**: All tab sections use `mt-8 mb-8` for consistent breathing room
4. **Content Spacing**: Main content sections use `space-y-8` for vertical rhythm
5. **Search/Filter Sections**: Standardized to `mb-8` bottom margin

### Typography & Color
1. **Text Colors**: Using CSS variables (`var(--foreground)`, `var(--muted-foreground)`)
2. **Title Structure**: `text-3xl font-bold` with `mb-2` before description
3. **Description**: `text-[var(--muted-foreground)]` for secondary text

### Padding Standardization
- Changed inconsistent `p-8` to `p-6` on outer containers
- All section margins updated from `mb-6` to `mb-8`
- Tab content containers use `space-y-8` instead of `space-y-6`
