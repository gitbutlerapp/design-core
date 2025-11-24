# Color Generator Architecture

## 📁 Project Structure

```
src/lib/
├── ColorGenerator.svelte          # Main orchestration component
├── components/                    # UI components
│   ├── ColorCard.svelte          # Individual color display card
│   ├── ColorScaleDisplay.svelte  # Complete scale with controls
│   ├── ExportSection.svelte      # Export buttons (JSON, CSS)
│   ├── GlobalControls.svelte     # Base hue controls
│   ├── ScaleControls.svelte      # Per-scale hue/saturation controls
│   └── SemanticZones.svelte      # Zone labels (Background, Soft, etc.)
├── utils/                         # Pure utility functions
│   ├── colorConversion.ts        # Color space conversions (RGB, HSL, Hex)
│   ├── colorScale.ts             # Scale generation logic
│   ├── contrast.ts               # WCAG contrast calculations
│   └── export.ts                 # Export & clipboard utilities
├── constants/
│   └── colorScales.ts            # Configuration constants
└── types/
    └── color.ts                  # TypeScript type definitions
```

## 🧩 Component Hierarchy

```
ColorGenerator (Main)
├── GlobalControls
│   └── Base hue slider + color picker
├── SemanticZones
│   └── Zone labels display
├── ColorScaleDisplay (×6, one per scale)
│   ├── ScaleControls
│   │   ├── Scale name
│   │   ├── Hue color picker
│   │   ├── Saturation slider
│   │   └── Copy JSON button
│   └── ColorCard (×13, one per shade)
│       ├── Color swatch with contrast indicator
│       └── Shade info + copy button
└── ExportSection
    └── Export JSON/CSS buttons
```

## 🔧 Utilities

### `colorConversion.ts`

Pure functions for color space transformations:

- `hexToRgb()` - Convert hex string to RGB object
- `rgbToHex()` - Convert RGB to hex string
- `hslToRgb()` - Convert HSL to RGB
- `rgbToHsl()` - Convert RGB to HSL
- `hslToHex()` - Direct HSL to hex conversion

### `colorScale.ts`

Scale generation logic:

- `lightnessMap` - Perceptually adjusted lightness values
- `getSaturationMultiplier()` - Zone-based saturation adjustment
- `generateScale()` - Main scale generation function

### `contrast.ts`

WCAG accessibility calculations:

- `getRelativeLuminance()` - Calculate relative luminance
- `getContrastRatio()` - Calculate contrast ratio between colors

### `export.ts`

Export and clipboard utilities:

- `exportJSON()` - Download scales as JSON
- `exportCSS()` - Download scales as CSS custom properties
- `copyToClipboard()` - Copy text to clipboard

## 📊 Constants & Types

### `colorScales.ts`

- `SCALES` - Array of 6 color scale definitions
- `SHADES` - Array of 13 shade definitions with purposes
- `SEMANTIC_ZONES` - Array of 4 zone labels
- `DEFAULT_SATURATIONS` - Default saturation values per scale

### `color.ts`

TypeScript type definitions:

- `ColorScale` - Scale configuration interface
- `Shade` - Shade definition interface
- `SemanticZone` - Zone label interface

## 🎨 Color Scale Configuration

### Scales (6)

1. **Neutral (ntrl)** - Gray scale, hue 25°, saturation 8%
2. **Pop (pop)** - Teal, hue 180°, saturation 85%
3. **Error (err)** - Red, hue 8°, saturation 68%
4. **Warning (warn)** - Orange, hue 35°, saturation 95%
5. **Success (succ)** - Green, hue 155°, saturation 65%
6. **Purple (purp)** - Purple, hue 270°, saturation 58%

### Shades (13)

`100, 95, 90, 80, 70, 60, 50, 40, 30, 20, 10, 5, 0`

### Semantic Zones (4)

- **Background** (95-90) - Very light, app backgrounds
- **Soft** (80-60) - UI component backgrounds
- **Solid** (50-40) - Primary interactive elements
- **Text** (30-0) - High contrast, readable text

## 🔄 Data Flow

1. **User Input** → Component event handlers
2. **State Update** → Svelte reactive state (`$state`)
3. **Scale Generation** → `generateScale()` utility
4. **Color Display** → Child components re-render
5. **User Export** → Export utilities

### Example: Changing Scale Saturation

```
User moves slider
  ↓
ScaleControls.onSaturationChange()
  ↓
ColorGenerator.updateScaleSaturation()
  ↓
Update scaleSaturations state
  ↓
Call updateColors()
  ↓
generateScale() recalculates all colors
  ↓
currentColors state updated
  ↓
ColorCard components re-render with new colors
```

## ✨ Features

### Individual Scale Control

- Each scale has independent hue and saturation controls
- Color pickers for visual hue selection
- Real-time preview of changes

### Perceptual Color Generation

- Non-linear lightness mapping for perceptual uniformity
- Zone-based saturation curves for optimal color distribution
- Maintained semantic zones across all scales

### Accessibility

- WCAG contrast ratio calculations
- Visual indicators for contrast pass/fail (4.5:1 threshold)
- Contrast tested against both white and black

### Export Options

- **JSON** - Structured data for programmatic use
- **CSS** - CSS custom properties ready to use
- **Clipboard** - One-click copy for any color value

## 🚀 Usage

### Development

```bash
pnpm dev
```

### Build

```bash
pnpm build
```

### Build Tokens Only

```bash
pnpm build:tokens
```

## 🔍 Key Design Decisions

1. **Modular Architecture** - Small, focused components for maintainability
2. **Pure Utilities** - Testable, reusable utility functions
3. **Type Safety** - TypeScript interfaces for all data structures
4. **Svelte 5 Runes** - Modern reactive primitives (`$state`, `$derived`, `$bindable`)
5. **Constants Separation** - Configuration extracted for easy modification
6. **Accessibility First** - WCAG compliance built-in

## 📝 Adding a New Scale

1. Add to `SCALES` in `constants/colorScales.ts`:

```typescript
{ name: 'Accent', id: 'accent', baseHue: 220 }
```

2. Add default saturation to `DEFAULT_SATURATIONS`:

```typescript
accent: 75;
```

3. No other changes needed - components will automatically render the new scale!

## 🧪 Testing Color Values

Each scale generates 13 shades with:

- Precise lightness values from `lightnessMap`
- Zone-appropriate saturation multipliers
- Independent hue control
- Consistent semantic meaning

Result: `6 scales × 13 shades = 78 color values` generated in real-time.
