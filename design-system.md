# Koray Graphic Charter – Tropical Premium Edition

## Colour Palette

Based on a vibrant tropical palette with premium depth, balanced between bold accents and clean neutrals.

### Primary (Coral → Turquoise → Sunshine)
| Class | Hex | Usage |
|-------|-----|-------|
| `bg-primary-500` | `#FF6B6B` | Main accent, CTA buttons, highlights |
| `bg-primary-400` | `#4ECDC4` | Secondary accent, hover states, icons |
| `bg-primary-500` | `#FFE66D` | Light accent, subtle highlights, badges |

### Secondary (Slate)
| Class | Hex | Usage |
|-------|-----|-------|
| `bg-background` | `#0F172A` | Main background |
| `bg-background-100` | `#1E293B` | Card background, subtle layers |
| `bg-background-200` | `#334155` | Borders, dividers |

### Neutral Grays (for text)
| Class | Hex |
|-------|-----|
| `text-slate-100` | `#F1F5F9` |
| `text-slate-200` | `#E2E8F0` |
| `text-slate-400` | `#94A3B8` |
| `text-slate-600` | `#475569` |

## Typography

All type uses system‑font stack for speed & consistency.

- **Headings** – `font-sans`, `font-bold`, `text-4xl` for hero, `text-2xl` for sections.
- **Body** – `font-sans`, `font-normal`, `text-base` (≈1rem/16px) or `text-sm` for fine detail.
- **Labels / CTAs** – `font-sans`, `font-semibold`, `text-sm` with tracking‑wide (`tracking-wider`).

## Shadows (Soft & Modern)

- `shadow-soft` – `0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)` – Cards, inputs, dropdowns.
- `shadow-soft-lg` – `0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)` – Modals, hover elevation.
- `shadow-soft-inner` – `inset 0 2px 4px 0 rgba(0,0,0,0.06)` – Input focus, nested surfaces.

## Tailwind Configuration

Create **tailwind.config.js** at project root:

```js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF5F5',
          100: '#FFEDED',
          200: '#FFE0E0',
          300: '#FFC9C9',
          400: '#FFB2B2',
          500: '#FF6B6B',
          600: '#E65A5A',
          700: '#B34848',
          800: '#803333',
          900: '#4D1F1F',
        },
        secondary: {
          50: '#F0FBF9',
          100: '#DCF7F4',
          200: '#B8EFE9',
          300: '#95E7DE',
          400: '#72DFD4',
          500: '#4ECDC4',
          600: '#43B5AE',
          700: '#358D87',
          800: '#266660',
          900: '#183F3A',
        },
        accent: {
          50: '#FFFFF4',
          100: '#FFFFE9',
          200: '#FFFFCC',
          300: '#FFFFB3',
          400: '#FFFF99',
          500: '#FFE66D',
          600: '#E6CC61',
          700: '#B39348',
          800: '#806A33',
          900: '#4D401F',
        },
        background: {
          DEFAULT: '#0F172A',
          100: '#1E293B',
          200: '#334155',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'soft-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'soft-inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
      borderRadius: {
        lg: '0.75rem',
        xl: '1rem',
      },
    },
  },
  plugins: [],
};
```

## Usage Examples

### Button (CTA)
```html
<button class="bg-primary-500 hover:bg-primary-400 text-white font-sans font-semibold py-3 px-6 rounded-lg shadow-soft transition-all">
  Get Started
</button>
```

### Card
```html
<div class="bg-background-100 rounded-xl shadow-soft p-6 border border-background-200">
  <h2 class="text-2xl font-bold mb-4">Card Title</h2>
  <p class="text-slate-200">Description text here.</p>
</div>
```

### Input
```html
<input type="text" class="bg-background border border-background-200 text-slate-100 rounded-lg px-4 py-2 focus:outline-none focus:shadow-soft-inner" placeholder="Enter value">
```

## Validation Checklist

- [ ] All colors referenced in design mock-ups match Tailwind classes defined above.
- [ ] Typography scales (`text-4xl`, `text-2xl`, `text-base`, `text-sm`) are applied consistently.
- [ ] Soft shadows are used for elevation, inner shadows for focus states.
- [ ] Logo respects the colour palette and is maintained at 120×120px for touchpoints.
- [ ] No hardcoded colours or fonts remain outside Tailwind utilities.

## Updating the Charter

When visual adjustments are required:
1. Edit `tailwind.config.js` (palette, shadows, radii).
2. Update `design-system.md` with new tokens.
3. Run `tailwind build` or configure your build pipeline to recompile CSS.
4. Re‑export the logo if brand colours change (use the gradient stops above as reference).