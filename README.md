# @gitbutler/design-core

Design tokens and fonts for GitButler applications. This package provides CSS custom properties, design tokens in JSON format, and web fonts used across GitButler products.

## Installation

```bash
npm install @gitbutler/design-core
```

## Usage

### Design Tokens (CSS)

Import the design tokens CSS file:

```css
@import "@gitbutler/design-core/tokens";
```

Or in JavaScript/TypeScript:

```javascript
import "@gitbutler/design-core/tokens";
```

This provides CSS custom properties for colors, spacing, typography, and other design tokens with automatic light/dark mode support.

### Design Tokens (JSON)

Import the raw design tokens data:

```javascript
import tokens from "@gitbutler/design-core/tokens.json";
```

### Fonts

Import all fonts:

```css
@import "@gitbutler/design-core/fonts";
```

Or import individual font families:

```css
@import "@gitbutler/design-core/fonts/inter/Inter-Regular.woff2";
@import "@gitbutler/design-core/fonts/geist-mono/GeistMono-Regular.woff2";
@import "@gitbutler/design-core/fonts/but-head/But-Head-Regular.woff2";
```

### Core Styles

Import the core CSS styles:

```css
@import "@gitbutler/design-core/core";
```

### Style Utilities

Import individual style utilities:

```css
@import "@gitbutler/design-core/styles"; /* Base styles */
@import "@gitbutler/design-core/styles/base"; /* Base styles */
@import "@gitbutler/design-core/styles/reset"; /* CSS reset */
@import "@gitbutler/design-core/styles/text"; /* Text utilities */
```

### Utility Classes

Import all utility classes at once:

```css
@import "@gitbutler/design-core/utility";
```

Or in JavaScript/TypeScript:

```javascript
import "@gitbutler/design-core/utility";
```

Or import individual utility class files:

```css
@import "@gitbutler/design-core/utility/general"; /* Border radius, colors, borders */
@import "@gitbutler/design-core/utility/helpers"; /* Scrollbar helpers, stack utilities */
@import "@gitbutler/design-core/utility/layout"; /* Spacing, positioning, flexbox, overflow, text alignment */
```

**General utilities** include:

- Border radius (`.radius-s`, `.radius-m`, `.radius-ml`, `.radius-l`)
- Background colors (`.clr-bg-1`, `.clr-bg-2`, `.clr-bg-3` and their muted variants)
- Borders (`.clr-border-1`, `.clr-border-2`, `.clr-border-3`)
- Text colors (`.clr-text-1`, `.clr-text-2`, `.clr-text-3`)

**Helper utilities** include:

- Scrollbar utilities (`.hide-native-scrollbar`, `.scrollbar`)
- Stack layouts (`.stack-v`, `.stack-h`)

**Layout utilities** include:

- Spacing (margin, padding, gap in 2px increments from 2px to 48px)
- Positioning (`.relative`, `.absolute`, `.fixed`, `.sticky`, positioning utilities)
- Size (`.full-width`, `.full-height`)
- Flexbox (`.flex`, `.flex-col`, alignment and justify utilities, flex grow/shrink)
- Overflow (`.overflow-hidden`, `.overflow-auto`, `.overflow-scroll`, `.overflow-visible`)
- Text alignment (`.text-center`, `.text-left`, `.text-right`, `.text-nowrap`)

## Available Exports

- `@gitbutler/design-core/tokens` - CSS custom properties
- `@gitbutler/design-core/tokens.json` - Design tokens as JSON
- `@gitbutler/design-core/fonts` - All font CSS declarations
- `@gitbutler/design-core/fonts/*` - Individual font files
- `@gitbutler/design-core/core` - Core CSS styles
- `@gitbutler/design-core/styles` - Base style utilities
- `@gitbutler/design-core/styles/base` - Base styles
- `@gitbutler/design-core/styles/reset` - CSS reset
- `@gitbutler/design-core/styles/text` - Text utilities
- `@gitbutler/design-core/utility` - All utility classes (combined)
- `@gitbutler/design-core/utility/general` - General utility classes (borders, colors)
- `@gitbutler/design-core/utility/helpers` - Helper utility classes (scrollbar, stacks)
- `@gitbutler/design-core/utility/layout` - Layout utility classes (spacing, flexbox, positioning)

## Included Fonts

- **Inter** - Primary UI font family
- **Geist Mono** - Monospace font for code
- **But Head** - Brand display font
- **PP Editorial** - Editorial content font

## Development

This package uses [Terrazzo](https://terrazzo.app/) to generate CSS custom properties from design tokens.

```bash
# Install dependencies
npm install

# Build tokens
npm run build

# Watch for changes
npm run dev:tokens
```

## Color Generator Tool

An interactive SvelteKit application for designing and testing color scales is available in the [`color-generator/`](./color-generator) directory.

```bash
# Start the color generator
npm run dev:generator

# Build the color generator
npm run build:generator
```

See [color-generator/README.md](./color-generator/README.md) for more details.
