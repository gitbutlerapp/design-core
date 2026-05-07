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

#### CSS Reset

The reset is scoped to `@layer reset` to avoid specificity conflicts with application styles. It applies the following normalizations:

- **Box sizing** — `box-sizing: border-box` on all elements and pseudo-elements.
- **Font rendering** — `-webkit-font-smoothing: antialiased`, `-moz-osx-font-smoothing: grayscale`, `text-rendering: optimizeLegibility`, and font size inflation prevention on `html`.
- **Body defaults** — zero padding and margin, `overflow-x: hidden`, and base values for `color`, `font-family`, `font-weight`, and `line-height` pulled from design tokens.
- **Form elements** — `input`, `textarea`, `select`, and `button` have their padding, border, and background stripped, and inherit `color` and `font` from the parent.
- **Headings** — `h1`–`h6` have `margin-block` removed.
- **Code & pre** — `code` and `pre` use `var(--fontfamily-mono)`.
- **Lists & paragraphs** — `ul` and `ol` have `padding-left` and `list-style` removed; `ul`, `pre`, and `p` have `margin-block` removed.

#### Text Utilities

Text classes are scoped to `@layer text`. The layer also sets three font-family custom properties on `:root`:

| Property              | Value                                     |
| --------------------- | ----------------------------------------- |
| `--fontfamily-base`   | `var(--text-fontfamily-base), sans-serif` |
| `--fontfamily-mono`   | `var(--text-fontfamily-mono), monospace`  |
| `--fontfamily-accent` | `var(--text-fontfamily-accent), serif`    |

**Size classes** set `font-size`, `font-weight: regular`, `line-height`, and `font-family: base` as a self-contained unit:

| Class               | Font size                                 |
| ------------------- | ----------------------------------------- |
| `.text-10`          | 10px (0.625rem)                           |
| `.text-11`          | 11px (0.6875rem)                          |
| `.text-12`          | 12px (0.75rem)                            |
| `.text-13`          | 13px (0.8125rem)                          |
| `.text-14`          | 14px (0.875rem)                           |
| `.text-15`          | 15px (0.938rem)                           |
| `.text-16`          | 16px (1rem)                               |
| `.text-accent-head` | 62px (3.875rem) — display / brand heading |

**Modifier classes** are designed to be composed on top of a size class:

| Class             | Effect                                                                                     |
| ----------------- | ------------------------------------------------------------------------------------------ |
| `.text-semibold`  | `font-weight: var(--text-weight-semibold)`                                                 |
| `.text-bold`      | `font-weight: var(--text-weight-bold)`                                                     |
| `.text-italic`    | `font-style: italic`                                                                       |
| `.text-monospace` | Switches to `var(--fontfamily-mono)`                                                       |
| `.text-body`      | Switches to the looser `var(--text-lineheight-body)` line height                           |
| `.text-balance`   | `text-wrap: balance` — ideal for short headings                                            |
| `.text-pre`       | `white-space: pre-wrap` + `word-break: break-word` — preserves whitespace without overflow |

Example usage:

```html
<p class="text-13 text-semibold">Label</p>
<code class="text-12 text-monospace">git commit</code>
<h1 class="text-accent-head text-italic">GitButler</h1>
```

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
