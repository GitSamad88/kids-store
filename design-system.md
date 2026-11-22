# Design System Documentation

## Brand Colors (Based on Reference Site Inspection)

### Primary Colors
- **Primary**: #f97316 (Orange)
- **Secondary**: #0ea5e9 (Sky Blue)
- **Accent**: #ec4899 (Pink)

### Neutral Palette
- **Background**: #fdfbf7 (Off-white)
- **Foreground**: #1e293b (Dark Gray)
- **Text**: #334155 (Medium Gray)
- **Muted**: #64748b (Slate Gray)
- **Border**: #e2e8f0 (Light Gray)

### Color Usage
- Primary: Used for CTAs, active states, highlights
- Secondary: Used for informational elements, secondary buttons
- Accent: Used for highlights, notifications, special offers

## Typography

### Font Stack
- Primary: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif
- Fallback: sans-serif

### Text Sizes
- **H1**: 28px (1.75rem)
- **H2**: 24px (1.5rem)
- **H3**: 20px (1.25rem)
- **Body**: 16px (1rem)
- **Caption**: 14px (0.875rem)
- **Small**: 12px (0.75rem)

### Line Heights
- **Body**: 1.5
- **Headings**: 1.2-1.4 (varies by size)
- **Small**: 1.4

## Spacing Scale

### Base Unit: 4px

| Scale | Size | Usage |
|-------|------|-------|
| 1 | 4px | Micro spacing |
| 2 | 8px | Small spacing |
| 3 | 12px | Standard spacing |
| 4 | 16px | Base spacing |
| 5 | 20px | Moderate spacing |
| 6 | 24px | Large spacing |
| 7 | 28px | Extra spacing |
| 8 | 32px | Significant spacing |

### Common Spacing Values
- **margin**: py-2, px-4, sm:px-6, lg:px-8, h-20, w-32, h-16, w-16
- **padding**: py-2, px-4, sm:px-6, lg:px-8, pt-16, pb-12, mt-12, pt-8

## Border Radius

| Scale | Size | Usage |
|-------|------|-------|
| 1 | 2px | Small elements |
| 2 | 4px | Inputs, small buttons |
| 3 | 6px | Cards, buttons |
| 4 | 8px | Primary buttons, inputs |
| 5 | 12px | Rounded containers |
| 6 | 16px | Large containers |

## Shadow Effects

- **Shadow 1**: 0 1px 2px 0 rgba(0, 0, 0, 0.05) - Subtle elevation
- **Shadow 2**: 0 1px 3px 0 rgba(0, 0, 0, 0.1) - Moderate depth
- **Shadow 3**: 0 2px 6px -10px rgba(0, 0, 0, 0.1) - Strong depth

## Breakpoints

| Device | Width | Description |
|--------|-------|-------------|
| Mobile | < 768px | Touch-first, compact layout |
| Tablet | 768px - 1024px | Balanced layout |
| Desktop | > 1024px | Full width, multi-column layouts |

## Content Constraints

- **Max Width**: 7xl (1280px) for main content
- **Container Width**: 7xl (1280px) with 16px side gutters
- **Mobile**: Full width with 16px side padding

## Component Patterns

### Header
- Sticky position with shadow
- Top announcement bar (orange background)
- Main header with logo, search, cart, account actions
- Navigation links with hover states

### Footer
- Three-column feature grid
- Main footer with multi-column links
- Newsletter signup form
- Copyright section with social indicators

## Quality Rules
- Consistent visual hierarchy
- Accessible color contrast
- Keyboard navigation support
- Reduced motion preference respect
- No emoji as UI icons
- No decorative animations that delay shopping tasks
- Proper image licensing and permissions

## Implementation Status
- ✅ Responsive layout implemented
- ✅ Mobile-first approach
- ✅ Accessible navigation
- ❌ Design tokens not formally documented
- ❌ Typography scale needs standardization
- ❌ Spacing system needs formalization
- ❌ Border radius needs standardization
- ❌ Shadow effects need documentation

Let me know if you'd like me to continue documenting specific aspects of the design system or start implementing the standardized components.