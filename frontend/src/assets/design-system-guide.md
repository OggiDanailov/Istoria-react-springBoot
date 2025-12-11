# Design System Implementation Guide

**Version**: 2.0 (With Google Fonts)
**Created**: Dec 10, 2025
**Status**: Ready for Production
**Target**: Dec 10-12, 2025

---

## Overview

This guide covers the complete design system for the Historical Quiz Application, including:
1. CSS Variables for consistent design tokens
2. Google Fonts integration (Playfair Display + EB Garamond)
3. Wrinkled paper aesthetic technique
4. Implementation strategy for all components

---

## Part 1: CSS Design System Variables

### Import Structure

**File**: `src/assets/design-system.css`

The design system imports Google Fonts and defines all CSS variables:

```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=EB+Garamond:wght@400;500;600;700&display=swap');

:root {
  /* All CSS variables defined here */
}
```

### Variable Categories

#### Colors (Primary)
```css
--color-bg-primary: #F5F1E8;        /* Page background - warm off-white */
--color-bg-secondary: #FFFAF5;      /* Card backgrounds - warmer white */
--color-bg-tertiary: #FAF7F0;       /* Hover/alternate states */
```

**Usage**:
```css
body { background-color: var(--color-bg-primary); }
```

#### Colors (Text)
```css
--color-text-primary: #3E3E3E;      /* Main text - dark gray */
--color-text-secondary: #6B6B6B;    /* Secondary text - medium gray */
--color-text-light: #999999;        /* Disabled/subtle text */
--color-text-inverse: #FFFFFF;      /* Text on dark backgrounds */
```

**Usage**:
```css
h1 { color: var(--color-text-primary); }
.subtitle { color: var(--color-text-secondary); }
```

#### Colors (Buttons & States)
```css
--color-button-primary: #8B7355;         /* Brown - main action */
--color-button-primary-hover: #6F5A45;   /* Darker brown - hover */
--color-button-secondary: #D4A574;       /* Tan/gold - secondary */
--color-button-secondary-hover: #C19462; /* Darker tan - hover */
--color-button-neutral: #6c757d;         /* Gray - tertiary */

--color-success: #7A9B6F;           /* Muted green - success states */
--color-error: #C17D7D;             /* Muted red - error states */
--color-warning: #ff9800;           /* Orange - warnings */
```

**Usage**:
```jsx
<button className="primary-btn">Submit</button>
```

```css
.primary-btn {
  background-color: var(--color-button-primary);
  color: var(--color-text-inverse);
}

.primary-btn:hover {
  background-color: var(--color-button-primary-hover);
}
```

#### Colors (Cards & Accents)
```css
--color-card-bg: #E8DCC8;           /* Card background - darker beige */
--color-card-bg-light: #D9CDB8;     /* Card background - lighter */
--color-card-border: #C9B9A3;       /* Card border - tan */
```

**Usage**:
```css
.period-card {
  background: linear-gradient(135deg, var(--color-card-bg) 0%, var(--color-card-bg-light) 100%);
  border: 1px solid var(--color-card-border);
}
```

#### Fonts (Roman/Germanic Historical Feel)

**Playfair Display** - Headings
```css
--font-heading: 'Playfair Display', serif;
```
- **Style**: Elegant, neoclassical serif
- **Weight**: 700 (bold), 600 (semi-bold)
- **Use for**: h1, h2, h3, h4, major titles
- **Feel**: Roman inscriptions, Renaissance elegance
- **Google Fonts URL**: Included in design-system.css

**EB Garamond** - Body Text
```css
--font-body: 'EB Garamond', serif;
```
- **Style**: Historical serif (16th century)
- **Weight**: 400 (regular), 500 (medium), 600 (semi-bold)
- **Use for**: Paragraph text, descriptions, general content
- **Feel**: Readable, scholarly, period-appropriate
- **Google Fonts URL**: Included in design-system.css

**Arial** - Fallback (Sans-serif)
```css
--font-sans: 'Arial', sans-serif;
```
- **Use for**: Form labels, technical text if needed
- **Note**: Prefer serif fonts for historical theme

**Implementation**:
```css
h1 { font-family: var(--font-heading); }
p { font-family: var(--font-body); }
label { font-family: var(--font-body); }
```

#### Spacing (8px Base Unit System)
```css
--spacing-xs: 4px;      /* Extra small - tiny gaps */
--spacing-sm: 8px;      /* Small - small margins */
--spacing-md: 16px;     /* Medium - standard margin */
--spacing-lg: 24px;     /* Large - section margins */
--spacing-xl: 32px;     /* Extra large - major spacing */
--spacing-2xl: 48px;    /* Double extra large - full sections */
```

**Usage**:
```css
.button { padding: var(--spacing-sm) var(--spacing-md); }  /* 8px 16px */
.section { margin: var(--spacing-lg); }                    /* 24px */
```

#### Border Radius (Rounded Corners)
```css
--border-radius-sm: 4px;    /* Subtle rounding */
--border-radius-md: 8px;    /* Standard rounding */
--border-radius-lg: 10px;   /* More rounded */
--border-radius-xl: 15px;   /* Very rounded */
```

**Usage**:
```css
.button { border-radius: var(--border-radius-md); }
.card { border-radius: var(--border-radius-lg); }
.modal { border-radius: var(--border-radius-xl); }
```

#### Shadows (Depth & Elevation)
```css
--shadow-sm: 0 2px 5px rgba(0, 0, 0, 0.1);        /* Subtle */
--shadow-md: 0 5px 15px rgba(0, 0, 0, 0.1);       /* Medium */
--shadow-lg: 0 20px 40px rgba(0, 0, 0, 0.1);      /* Large */
--shadow-xl: 0 20px 60px rgba(0, 0, 0, 0.3);      /* Extra large */
```

**Usage**:
```css
.card { box-shadow: var(--shadow-md); }
.card:hover { box-shadow: var(--shadow-lg); }
.modal { box-shadow: var(--shadow-xl); }
```

#### Transitions (Animation Timing)
```css
--transition-fast: 0.2s ease;       /* Quick hover effects */
--transition-normal: 0.3s ease;     /* Standard animations */
--transition-slow: 0.5s ease;       /* Slow transitions */
```

**Usage**:
```css
button {
  transition: all var(--transition-normal);
}

button:hover {
  background: var(--color-button-primary-hover);
  box-shadow: var(--shadow-md);
}
```

#### Z-Index (Stacking Context)
```css
--z-dropdown: 100;      /* Dropdowns, popovers */
--z-sticky: 100;        /* Sticky headers */
--z-modal: 1000;        /* Modal backgrounds */
--z-tooltip: 1100;      /* Tooltips on top of modals */
```

**Usage**:
```css
.modal-overlay { z-index: var(--z-modal); }
.app-header { z-index: var(--z-sticky); }
```

---

## Part 2: Google Fonts Setup

### Fonts Included

The design-system.css file imports two Google Fonts families:

```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=EB+Garamond:wght@400;500;600;700&display=swap');
```

### Font Weights

**Playfair Display**:
- 400 (Regular) - not typically used
- 600 (Semi-bold) - subtitles, h3/h4
- 700 (Bold) - h1, h2
- 900 (Black) - emphasis, special headings

**EB Garamond**:
- 400 (Regular) - body text, paragraphs
- 500 (Medium) - labels, slightly emphasized text
- 600 (Semi-bold) - strong emphasis, important text
- 700 (Bold) - not commonly used (Playfair better)

### Loading Performance

The `display=swap` parameter ensures:
- ✅ Text renders immediately with system fonts
- ✅ Fonts swap to Google Fonts when loaded
- ✅ No visual jump after fonts load
- ✅ Better perceived performance

### Fallback Font Stack

CSS automatically provides fallbacks:

```css
--font-heading: 'Playfair Display', serif;
```

If Playfair Display fails to load:
1. Uses generic `serif` fallback
2. System automatically selects appropriate serif (Georgia, etc.)

---

## Part 3: Wrinkled Paper Aesthetic

### The Technique

The wrinkled paper effect uses **CSS-only inset box-shadows** to simulate texture:

```css
.wrinkled-paper {
  background: linear-gradient(135deg, #F5EDDB 0%, #E8DCBE 100%);
  box-shadow:
    inset 0 0 40px rgba(0, 0, 0, 0.05),
    inset 10px 10px 30px rgba(0, 0, 0, 0.04),
    inset -10px -10px 30px rgba(255, 255, 255, 0.3),
    0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #D4C4A8;
  border-radius: var(--border-radius-lg);
}
```

### How It Works

1. **Gradient Background** (`#F5EDDB` → `#E8DCBE`)
   - Creates subtle directional shading
   - Simulates light hitting aged paper
   - 135° angle creates natural look

2. **Inset Shadow 1** (`0 0 40px rgba(0,0,0,0.05)`)
   - Large, soft, dark shadow
   - Creates overall darkness variation
   - Simulates paper age/patina

3. **Inset Shadow 2** (`10px 10px 30px rgba(0,0,0,0.04)`)
   - Directional shadow (from top-left)
   - Creates wrinkle/crease effect
   - Adds depth and texture

4. **Inset Shadow 3** (`-10px -10px 30px rgba(255,255,255,0.3)`)
   - Opposite directional shadow (from bottom-right)
   - Highlights the "ridges" of wrinkles
   - Creates 3D tactile feel

5. **Outer Shadow** (`0 4px 12px rgba(0,0,0,0.1)`)
   - Lifts the element off the page
   - Creates elevation and depth
   - Makes container feel like physical object

6. **Border** (`1px solid #D4C4A8`)
   - Thin tan border
   - Defines edge of "paper"
   - Complements aged paper color

### Visual Result

The combined effect creates:
- ✅ Aged 19th-century parchment appearance
- ✅ Subtle 3D texture without images
- ✅ Historical, scholarly feel
- ✅ No performance impact (CSS-only)
- ✅ Works on all browsers

### Application

Add the class to any container:

```jsx
<div className="quiz-container wrinkled-paper">
  {/* Content appears on aged paper */}
</div>
```

---

## Part 4: Component Implementation

### Strategy

1. **Identify containers** that need wrinkled effect
2. **Add class** to existing className
3. **Test** for readability and visual consistency
4. **Refine** if needed

### Example: Quiz Component

**Before**:
```jsx
<div className="quiz-container">
  <h1>Quiz Time!</h1>
  {/* questions */}
</div>
```

**After**:
```jsx
<div className="quiz-container wrinkled-paper">
  <h1>Quiz Time!</h1>
  {/* questions */}
</div>
```

**CSS** (already in styles-global.css):
```css
.wrinkled-paper {
  background: linear-gradient(135deg, #F5EDDB 0%, #E8DCBE 100%);
  box-shadow:
    inset 0 0 40px rgba(0, 0, 0, 0.05),
    inset 10px 10px 30px rgba(0, 0, 0, 0.04),
    inset -10px -10px 30px rgba(255, 255, 255, 0.3),
    0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #D4C4A8;
  border-radius: var(--border-radius-lg);
}
```

### High-Priority Components

**Tier 1** (Core Quiz Experience):
1. `Quiz.jsx` - Main quiz display
2. `ReadingMaterial.jsx` - Reading content
3. `Results.jsx` - Score/results display

**Tier 2** (Navigation):
4. `PeriodList.jsx` - Period cards
5. `TopicList.jsx` - Topic cards

**Tier 3** (Dashboards):
6. `UserDashboard.jsx` - Progress tracking
7. `Admin.jsx` - Admin interface

---

## Part 5: Global Styles Integration

### File Structure

**Import Order** (critical):
```css
/* styles-global.css */
@import './assets/design-system.css';  /* FIRST - defines all variables */

/* Then use variables throughout */
body { font-family: var(--font-body); }
h1 { font-family: var(--font-heading); }
```

**Both files work together**:
- `design-system.css` - Defines all variables
- `styles-global.css` - Uses variables to style components

### Color Usage in Components

**Primary buttons**:
```css
.primary-btn {
  background-color: var(--color-button-primary);      /* #8B7355 */
  color: var(--color-text-inverse);                   /* #FFFFFF */
}

.primary-btn:hover {
  background-color: var(--color-button-primary-hover); /* #6F5A45 */
  box-shadow: var(--shadow-md);
}
```

**Text styling**:
```css
h1 { color: var(--color-text-primary); }              /* Dark text */
.subtitle { color: var(--color-text-secondary); }     /* Medium text */
.disabled { color: var(--color-text-light); }         /* Light text */
```

**Card styling**:
```css
.period-card {
  background: linear-gradient(135deg,
    var(--color-card-bg) 0%,
    var(--color-card-bg-light) 100%);
  border: 1px solid var(--color-card-border);
  box-shadow: var(--shadow-sm);
}

.period-card:hover {
  box-shadow: var(--shadow-md);
}
```

---

## Part 6: Customization

### Changing Colors Globally

**Before** (old way - hardcoded):
```css
.button { background: #8B7355; }          /* Had to change everywhere */
.button:hover { background: #6F5A45; }
.card { border: 1px solid #C9B9A3; }      /* Scattered throughout code */
```

**After** (new way - centralized):
```css
:root {
  --color-button-primary: #8B7355;  /* Change once */
}

.button { background: var(--color-button-primary); }
.button:hover { background: var(--color-button-primary-hover); }
```

**To update all primary buttons**:
1. Edit `design-system.css` line ~30
2. Change `--color-button-primary: #8B7355;`
3. All components update automatically! ✨

### Changing Fonts

**To use different heading font**:
```css
:root {
  --font-heading: 'Georgia', serif;  /* Change from Playfair Display */
}
```

All h1, h2, h3, h4 automatically update.

### Theme Creation

To create dark theme variant:
```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg-primary: #1A1A1A;
    --color-text-primary: #F5F1E8;
    /* ... etc */
  }
}
```

---

## Part 7: Browser Support

### Font Support
- **Google Fonts**: Supported in all modern browsers
- **Fallback**: System serif fonts if loading fails
- **No IE11**: Not supported (acceptable for modern web app)

### CSS Variables Support
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (13+)
- Mobile browsers: Full support

### Inset Box-Shadows
- All modern browsers: Full support
- No performance impact
- Renders natively (not JavaScript)

---

## Part 8: Testing Checklist

### Visual Testing
- [ ] Font rendering looks clean (not blurry)
- [ ] Color contrast is sufficient (WCAG AA)
- [ ] Wrinkled paper effect is subtle (not distracting)
- [ ] Spacing is consistent throughout
- [ ] Cards stack properly
- [ ] Modal overlays work correctly

### Responsive Testing
- [ ] Desktop (1920x1080) - full effect visible
- [ ] Tablet (768x1024) - scales appropriately
- [ ] Mobile (375x667) - effect visible but subtle
- [ ] Text remains readable at all sizes

### Browser Testing
- [ ] Chrome - fonts load, colors render
- [ ] Firefox - same as Chrome
- [ ] Safari - same as Chrome
- [ ] Mobile Safari - same as Chrome

### Performance Testing
- [ ] Page loads quickly (no font rendering delays)
- [ ] Smooth scrolling (no jank from shadows)
- [ ] Hover effects are snappy
- [ ] No layout shifts as fonts load

---

## Part 9: Migration Checklist

- [ ] Design system created with fonts (`design-system.css`)
- [ ] Global styles updated (`styles-global.css`)
- [ ] All hardcoded colors removed
- [ ] All hardcoded spacing replaced with variables
- [ ] All font declarations use variables
- [ ] Wrinkled-paper class applied to core components
- [ ] Components tested for readability
- [ ] Mobile responsiveness verified
- [ ] No console errors or warnings

---

## Part 10: Documentation & Maintenance

### For Future Developers

**To change app colors**:
1. Open `src/assets/design-system.css`
2. Edit `--color-*` variables in `:root`
3. No component files need changing

**To change fonts**:
1. Edit `@import url(...)` at top of `design-system.css`
2. Update `--font-*` variables
3. All components automatically use new fonts

**To create theme variants**:
1. Add `@media (prefers-color-scheme: dark)` block
2. Override `:root` variables
3. System automatically switches based on user preference

### Design System Update Log

| Date | Change | File | Impact |
|------|--------|------|--------|
| Dec 10 | Initial creation with Google Fonts | design-system.css | Global |
| Dec 10 | Applied to global styles | styles-global.css | All components |
| Dec 11 | Applied wrinkled-paper to core components | Quiz.jsx, Results.jsx, etc. | UI/UX |

---

## Summary

### What You Have
✅ Centralized design system (1 file to rule them all)
✅ Google Fonts integrated (Playfair + EB Garamond)
✅ Color palette optimized for historical theme
✅ Wrinkled paper effect for aged document feel
✅ Spacing system for consistency
✅ Shadow system for depth
✅ Font stack for elegance

### What This Enables
✅ Change entire app colors in seconds
✅ Update all fonts globally
✅ Maintain design consistency
✅ Scale to more components easily
✅ Create theme variants (dark mode, etc.)
✅ Professional, polished appearance
✅ Historical/scholarly feel

### Next Steps
1. Apply `.wrinkled-paper` class to components
2. Test in browser (fonts, colors, wrinkles)
3. Verify mobile responsiveness
4. Launch with confidence

---

**Document Version**: 2.0
**Last Updated**: Dec 10, 2025
**Status**: Complete & Ready for Implementation
**Maintainer**: Historical Quiz Dev Team