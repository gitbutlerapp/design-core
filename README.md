# @gitbutler/design-core

Design tokens and fonts for GitButler applications. This package provides CSS custom properties, design tokens in JSON format, and web fonts used across GitButler products.

## Installation

```bash
npm install @gitbutler/design-core
```

## Usage

### Single Import

The easiest way to get everything — fonts, CSS reset, text utilities, and design tokens:

```css
@import "@gitbutler/design-core/core";
```

Or in JavaScript/TypeScript:

```javascript
import "@gitbutler/design-core/core";
```

### Design Tokens (CSS)

Import only the design tokens CSS file:

```css
@import "@gitbutler/design-core/tokens";
```

Or in JavaScript/TypeScript:

```javascript
import "@gitbutler/design-core/tokens";
```

This provides CSS custom properties for colors, spacing, typography, and other design tokens with automatic light/dark mode support.

### Fonts

Import all font declarations:

```css
@import "@gitbutler/design-core/fonts";
```

Or reference individual font files directly:

```css
@import "@gitbutler/design-core/fonts/inter/Inter-Variable.woff2";
@import "@gitbutler/design-core/fonts/geist-mono/GeistMono-Variable.woff2";
@import "@gitbutler/design-core/fonts/but-head/But-Head-Regular.woff2";
```

### Styles

Import individual style sheets:

```css
@import "@gitbutler/design-core/styles/reset"; /* CSS reset */
@import "@gitbutler/design-core/styles/text"; /* Text utilities */
```

**Text utilities** include:

- Size classes (`.text-10`, `.text-11`, `.text-12`, `.text-13`, `.text-14`, `.text-15`, `.text-16`, `.text-accent-head`)
- Weight modifiers (`.text-semibold`, `.text-bold`)
- Style modifiers (`.text-italic`, `.text-monospace`, `.text-body`, `.text-balance`, `.text-pre`)

## Available Exports

- `@gitbutler/design-core/core` - Single import: fonts + reset + text utilities + tokens
- `@gitbutler/design-core/tokens` - CSS custom properties (design tokens)
- `@gitbutler/design-core/fonts` - All font CSS declarations
- `@gitbutler/design-core/fonts/*` - Individual font files
- `@gitbutler/design-core/styles/reset` - CSS reset
- `@gitbutler/design-core/styles/text` - Text utility classes

## Included Fonts

All fonts are variable fonts unless noted.

- **Inter** — Primary UI font (`Inter-Variable.woff2`, `Inter-Variable-Italic.woff2`)
- **Geist Mono** — Monospace font for code (`GeistMono-Variable.woff2`)
- **But Head** — Brand display font (`But-Head-Regular.woff2`, `But-Head-Italic.woff2`)

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

## Color Tool

[hue-dini](./tools/hue-dini) is the tool used to preview and export the GitButler color palette. It applies a single shared luminance scale across all hues — gray, accent, and semantic — so shades at the same step feel visually equivalent regardless of hue.

**Live:** https://gitbutlerapp.github.io/design-core/

```bash
cd tools/hue-dini
pnpm install
pnpm dev
```

See [tools/hue-dini/README.md](./tools/hue-dini/README.md) for more details.
