# OratorAI UI Style Guide

## Color System

### Primary Palette
```
Primary Blue: #667eea
Primary Dark: #764ba2
Complementary: #5a67d8 (Dark mode)
```

### Semantic Colors
```
Success: #48bb78 (Green - for confirmations)
Error: #f56565 (Red - for errors)
Warning: #ed8936 (Orange - for warnings)
Info: #667eea (Blue - for information)
```

### Neutral Palette
```
White: #ffffff
Light Gray 1: #f7fafc
Light Gray 2: #edf2f7
Light Gray 3: #e2e8f0
Dark Gray 1: #cbd5e0
Dark Gray 2: #718096
Dark Gray 3: #4a5568
Dark Gray 4: #2d3748
Black: #1a202c
```

## Typography

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
  'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
  sans-serif;
```

### Sizes
```
H1: 1.75rem (28px) - 700 weight
H2: 1.5rem (24px) - 600 weight
H3: 1.1rem (18px) - 600 weight
Body: 0.95rem (15px) - 400 weight
Small: 0.875rem (14px) - 400 weight
Tiny: 0.75rem (12px) - 600 weight
```

### Weights
```
Regular: 400 (body text)
Medium: 500 (highlighted text)
Semibold: 600 (headings, labels)
Bold: 700 (main headings)
```

## Spacing System

All spacing follows a 0.5rem (8px) base unit:

```
xs: 0.25rem (4px)
sm: 0.5rem (8px)
md: 1rem (16px)
lg: 1.5rem (24px)
xl: 2rem (32px)
2xl: 2.5rem (40px)
```

## Button Styles

### Primary Button (CTA)
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
color: white;
padding: 0.75rem 1.5rem;
border-radius: 8px;
font-weight: 600;
transition: all 0.2s;

&:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(102, 126, 234, 0.4);
}
```

### Secondary Button
```css
background: var(--bg-tertiary);
color: var(--text-primary);
border: 1px solid var(--border-color);
padding: 0.75rem 1.5rem;
border-radius: 8px;
font-weight: 600;
transition: all 0.2s;

&:hover {
  background: var(--border-color);
  transform: translateY(-1px);
}
```

### Danger Button
```css
background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);
color: white;
```

## Card Styles

### Standard Card
```css
background: var(--bg-primary);
border: 1px solid var(--border-color);
border-radius: 12px;
padding: 1.5rem;
box-shadow: var(--shadow-md);
transition: all 0.2s;

&:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}
```

### Primary Card (Highlighted)
```css
border: 2px solid #667eea;
background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
```

## Shadow System

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
--shadow-lg: 0 10px 40px rgba(0, 0, 0, 0.1);
```

## Border Radius

```css
Small: 4px (input, small elements)
Medium: 6px (icons, medium components)
Large: 8px (buttons, cards)
XL: 12px (major containers)
```

## Transitions

All transitions follow consistent timing:

```css
Fast: 0.2s ease
Normal: 0.3s ease
Slow: 0.5s ease
```

Prefer `ease-out` for entering elements, `ease-in` for leaving.

## Z-Index Scale

```
Default: auto
Sticky: 40
Overlay: 50
Dropdown: 100
Modal: 150
Notification: 200
```

## Animation Patterns

### Entrance Animations
```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
animation: fadeIn 0.3s ease-out;
```

### Loading States
```css
@keyframes spin {
  to { transform: rotate(360deg); }
}
animation: spin 0.8s linear infinite;
```

### Focus States
```css
outline: 2px solid var(--primary);
outline-offset: 2px;
```

## Accessibility Guidelines

### Color Contrast
- Text on background: minimum 4.5:1
- Large text (18px+): minimum 3:1
- UI components: minimum 3:1

### Focus Indicators
Always provide visible focus indicators:
```css
:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}
```

### Motion Sensitivity
Respect user's motion preferences:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Responsive Design Patterns

### Mobile First Approach
```css
/* Mobile (base) */
.element {
  font-size: 1rem;
  padding: 1rem;
}

/* Tablet */
@media (min-width: 768px) {
  .element {
    font-size: 1.1rem;
    padding: 1.5rem;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .element {
    font-size: 1.2rem;
    padding: 2rem;
  }
}
```

## Component Examples

### Input Field
```jsx
<input
  type="text"
  placeholder="Enter text..."
  className="input-field"
  aria-label="Input field"
/>
```

### Icon Button
```jsx
<button
  className="btn-icon"
  aria-label="Menu"
  title="Menu"
>
  <MenuIcon />
</button>
```

### Badge
```jsx
<span className="badge badge-success">
  Active
</span>
```

## Dark Mode Implementation

### CSS Variables Approach
```css
:root {
  --bg-primary: #ffffff;
  --text-primary: #1a202c;
}

[data-theme="dark"] {
  --bg-primary: #1a202c;
  --text-primary: #f7fafc;
}
```

### Usage
```css
.element {
  background: var(--bg-primary);
  color: var(--text-primary);
}
```

## Performance Considerations

- Use CSS variables instead of SCSS variables for runtime switching
- Prefer `transform` and `opacity` for animations (GPU accelerated)
- Use `will-change` sparingly for complex animations
- Minimize repaints by grouping style changes

## Common Mistakes to Avoid

❌ Using hardcoded colors instead of variables
❌ Inconsistent spacing values
❌ Missing focus states
❌ Non-accessible color combinations
❌ Slow animations (> 500ms)
❌ Inconsistent border radius
❌ Missing transition definitions

## Testing Checklist

- [ ] All interactive elements are keyboard accessible
- [ ] Focus indicators are visible
- [ ] Color contrast meets WCAG AA standard
- [ ] Layout works on mobile/tablet/desktop
- [ ] Animations respect prefers-reduced-motion
- [ ] Dark mode looks correct
- [ ] All buttons have hover/active states
- [ ] Error states are clearly visible
- [ ] Loading states are animated
- [ ] Touch targets are at least 44x44px

---

**For questions or updates, refer to UI_DOCUMENTATION.md**
