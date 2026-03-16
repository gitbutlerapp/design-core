# hue-dini

**Live:** https://gitbutlerapp.github.io/design-core/

GitButler's color system uses a single shared luminance scale across all hues — gray, accent, and semantic. Every color is mapped through the same perceptually balanced lightness curve, so shades at the same step feel visually equivalent regardless of hue.

hue-dini is the tool for previewing and exporting this palette. The draggable stops represent the luminance scale — mainly for inspection, with adjustments only needed for occasional corrections. **Copy output** exports the palette as a JSON token file for the design token pipeline.

## Run locally

```bash
pnpm install
pnpm dev
```

## Deploy

Pushes to `main` that touch `tools/hue-dini/` automatically deploy to GitHub Pages via `.github/workflows/deploy-hue-dini.yml`.
