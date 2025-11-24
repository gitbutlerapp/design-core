# Color Scale Generator

Interactive SvelteKit application for generating and exporting color scales for the GitButler design system.

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## 📖 Features

- **6 Color Scales**: Neutral, Pop, Error, Warning, Success, Purple
- **13 Shades per Scale**: From 0 (darkest) to 100 (lightest)
- **Individual Controls**: Adjust hue and saturation per scale
- **Semantic Zones**: Background, Soft, Solid, Text
- **WCAG Contrast**: Real-time contrast ratio calculations
- **Export Options**: JSON, CSS custom properties
- **Copy to Clipboard**: One-click copy for any color

## 🏗️ Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed documentation on:

- Project structure
- Component hierarchy
- Utilities and types
- Data flow
- Design decisions

## 🎨 Usage

1. **Global Controls**: Adjust the base hue for all scales
2. **Per-Scale Controls**: Fine-tune individual scales with color pickers and saturation sliders
3. **View Results**: See all 78 colors (6 scales × 13 shades) in real-time
4. **Export**: Download as JSON or CSS for use in your projects

## 📁 Project Structure

```
color-generator/
├── src/
│   ├── lib/
│   │   ├── components/      # Svelte components
│   │   ├── utils/           # Utility functions
│   │   ├── constants/       # Configuration
│   │   └── types/           # TypeScript types
│   └── routes/
│       ├── +page.svelte     # Main page
│       └── +layout.svelte   # Layout
├── static/                  # Static assets
├── svelte.config.js         # SvelteKit config
├── vite.config.ts           # Vite config
└── package.json             # Dependencies
```

## 🔧 Development

This is a standalone SvelteKit application separate from the main `@gitbutler/design-core` package. It provides an interactive tool for designing and testing color scales that can then be exported and integrated into the design tokens.

## 📦 Exporting Colors

### JSON Format

```json
{
  "ntrl": {
    "100": "#ffffff",
    "95": "#fafaf9",
    ...
  },
  "pop": {
    ...
  }
}
```

### CSS Format

```css
:root {
  --clr-core-ntrl-100: #ffffff;
  --clr-core-ntrl-95: #fafaf9;
  --clr-core-pop-100: #e0f7f6;
  ...
}
```

## 🎯 Use Cases

- Design new color scales for GitButler applications
- Test color combinations for accessibility
- Generate consistent color palettes
- Export tokens for development
- Visualize semantic color zones

## 🔗 Related

This tool generates colors that match the structure of the design tokens in the parent `@gitbutler/design-core` package.
