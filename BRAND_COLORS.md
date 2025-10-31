# SourceKom Brand Colors

This document describes the SourceKom brand color system with full light/dark mode support.

## Brand Colors

### Primary Colors
- **Primary (Sky Teal)**: `#52E1E3`
- **Primary Deep (Ocean Deep)**: `#0B8E8E`
- **Secondary (Sand Beige)**: `#D8C69A`
- **Highlight (Aqua Glow)**: `#A6F6F7`

### Usage
```tsx
// Tailwind classes
<div className="bg-brand text-brand-deep">Primary</div>
<div className="bg-brand-secondary text-brand-highlight">Secondary</div>

// CSS variables
background: var(--brand-primary);
color: var(--brand-primary-deep);
```

## Neutral Colors

### Light Mode
- **Background**: `#FFFFFF`
- **Surface**: `#F9FAFB`
- **Text**: `#212121`
- **Text Muted**: `#5A5A5A`
- **Border**: `#E5E5E5`

### Dark Mode
- **Background**: `#0E1113`
- **Surface**: `#1A1D1F`
- **Text**: `#FFFFFF`
- **Text Muted**: `#BDBDBD`
- **Border**: `#2B2F31`

### Usage
```tsx
// Tailwind classes
<div className="bg-app text-app">Background</div>
<div className="bg-surface text-app-muted">Surface</div>
<div className="border-app">Border</div>

// CSS variables
background: var(--bg);
color: var(--text);
border-color: var(--border);
```

## Status Colors

### Light Mode
- **Success**: `#22C55E`
- **Warning**: `#FACC15`
- **Error**: `#EF4444`
- **Info**: `#3B82F6`

### Dark Mode
- **Success**: `#16A34A`
- **Warning**: `#CA8A04`
- **Error**: `#DC2626`
- **Info**: `#2563EB`

### Usage
```tsx
// Tailwind classes
<Alert variant="success">Success message</Alert>
<Alert variant="warning">Warning message</Alert>
<Alert variant="error">Error message</Alert>
<Alert variant="info">Info message</Alert>

// Direct usage
<div className="text-state-success bg-state-success/10 border-state-success/30">
  Success content
</div>
```

## Gradients

### Primary Gradient
```css
background: linear-gradient(135deg, #52E1E3 0%, #0B8E8E 100%);
```

### Secondary Gradient
```css
background: linear-gradient(135deg, #D8C69A 0%, #A6F6F7 100%);
```

### Usage
```tsx
// Tailwind classes
<div className="bg-gradient-brand">Primary gradient</div>
<div className="bg-gradient-secondary">Secondary gradient</div>
```

## Theme Toggle

The theme system supports three modes:
- **Light**: Explicit light mode
- **Dark**: Explicit dark mode
- **System**: Follows system preference (default)

### Usage
```tsx
import { ThemeToggle } from '@/components/ui/theme-toggle';

<ThemeToggle />
```

### Programmatic Usage
```tsx
import { useTheme } from '@/hooks/useTheme';

function MyComponent() {
  const { mode, setMode } = useTheme();
  
  return (
    <button onClick={() => setMode('dark')}>
      Switch to Dark Mode
    </button>
  );
}
```

## Tailwind Classes

### Brand Colors
- `bg-brand` - Primary brand color background
- `text-brand` - Primary brand color text
- `bg-brand-deep` - Deep brand color background
- `text-brand-deep` - Deep brand color text
- `bg-brand-secondary` - Secondary brand color background
- `text-brand-secondary` - Secondary brand color text
- `bg-brand-highlight` - Highlight brand color background
- `text-brand-highlight` - Highlight brand color text

### App Colors
- `bg-app` - Main background color
- `bg-surface` - Surface background color
- `text-app` - Main text color
- `text-app-muted` - Muted text color
- `border-app` - Border color

### State Colors
- `bg-state-success` / `text-state-success`
- `bg-state-warning` / `text-state-warning`
- `bg-state-error` / `text-state-error`
- `bg-state-info` / `text-state-info`

### Shadows
- `shadow-app` - Standard shadow
- `shadow-app-lg` - Large shadow

### Border Radius
- `rounded-xl2` - Standard border radius (14px)

## Component Examples

### Button
```tsx
import { Button } from '@/components/ui/button';

// Brand variant
<Button variant="brand">Primary Action</Button>

// Outline with brand colors
<Button variant="outline" className="border-brand text-brand hover:bg-brand hover:text-app">
  Secondary Action
</Button>
```

### Input
```tsx
import { Input } from '@/components/ui/input';

<Input 
  placeholder="Enter text..."
  className="bg-app border-app text-app placeholder:text-app-muted focus:border-brand"
/>
```

### Card
```tsx
import { Card, CardHeader, CardContent } from '@/components/ui/card';

<Card className="bg-app border-app shadow-app">
  <CardHeader>
    <h3 className="text-app">Title</h3>
  </CardHeader>
  <CardContent>
    <p className="text-app-muted">Content</p>
  </CardContent>
</Card>
```

### Alert
```tsx
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

<Alert variant="success">
  <AlertTitle>Success!</AlertTitle>
  <AlertDescription>Operation completed successfully.</AlertDescription>
</Alert>
```

## CSS Variables

All colors are available as CSS variables:

```css
/* Brand */
--brand-primary: #52E1E3;
--brand-primary-deep: #0B8E8E;
--brand-secondary: #D8C69A;
--brand-highlight: #A6F6F7;

/* App Colors */
--bg: #FFFFFF;
--surface: #F9FAFB;
--text: #212121;
--text-muted: #5A5A5A;
--border: #E5E5E5;

/* Status */
--success: #22C55E;
--warning: #FACC15;
--error: #EF4444;
--info: #3B82F6;
```

Dark mode variables are automatically applied when `[data-theme="dark"]` is set on the `<html>` element or via `prefers-color-scheme: dark`.

## Best Practices

1. **Always use semantic tokens** - Prefer `bg-app` over `bg-white` or `bg-[#FFFFFF]`
2. **Use brand colors sparingly** - Reserve brand colors for primary actions and accents
3. **Ensure contrast** - Text on brand backgrounds should use `text-app` for readability
4. **Test both themes** - Always verify appearance in both light and dark modes
5. **Use gradients for hero sections** - Use `bg-gradient-brand` for prominent sections

## Migration Guide

### Replacing Hardcoded Colors

**Before:**
```tsx
<div className="bg-blue-500 text-white">...</div>
```

**After:**
```tsx
<div className="bg-brand text-app">...</div>
```

### Replacing Legacy Brand Colors

**Before:**
```tsx
<div className="text-brand-blue">...</div>
```

**After:**
```tsx
<div className="text-brand">...</div>
```

## Accessibility

All color combinations meet WCAG AA contrast requirements:
- Text on light backgrounds: 4.5:1 minimum
- Text on dark backgrounds: 4.5:1 minimum
- Brand colors tested for accessibility in both themes

