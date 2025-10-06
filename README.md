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
@import "@gitbutler/design-core/fonts/pp-editorial/PPEditorialNew-Regular.woff2";
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
npm run dev
```
