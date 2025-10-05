# GitButler Design Tokens

The official design tokens repository for GitButler applications.
We use [Terrazzo](https://terrazzo.app/) to generate CSS custom properties from design tokens.

## Installation

```bash
npm install
```

## Usage

Place your tokens in the root of the project in a file called `design-tokens.json` and run:

```bash
npm run build
```

This will generate a `tokens` folder with the tokens in CSS format.

For development with automatic rebuilding:

```bash
npm run dev
```

## Output

The build process generates:
- `tokens/design-tokens.css` - CSS custom properties with light and dark mode support
- Formatted JSON and CSS files with prettier

## Integration

To use these tokens in your application:

1. Import the generated CSS file
2. Reference the CSS custom properties in your stylesheets
3. The tokens support both light and dark themes through CSS selectors

## Configuration

The Terrazzo configuration is in `terrazzo.config.js` and includes:
- Pixel to rem conversion for dimension tokens
- Dark mode selector support (`:root.dark`)
- Custom variable naming (removes `fx.` prefixes)
