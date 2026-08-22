---
name: build-gitbutler-tokens
description: Build GitButler's design-core CSS from DTCG token JSON files. Runs the Terrazzo + postprocess pipeline from gitbutlerapp/design-core — converts tokens/json/*.tokens.json into tokens/tokens.css with light-dark() merging and shadow variable injection. Use after /export-tokens has written the token JSON files.
---

# Build GitButler Design Tokens CSS

Transforms DTCG token JSON files into production CSS for the @gitbutler/design-core package. This skill runs the second half of the pipeline — after /export-tokens has extracted variables from Figma into tokens/json/.

## Prerequisites

This skill expects the gitbutlerapp/design-core repo to be cloned and available. It operates on that repo's file structure:

```
tokens/json/core.tokens.json      ← from tokens-bruecke (core collection)
tokens/json/semantic.tokens.json  ← from tokens-bruecke (semantic collection)
tokens/json/fx.tokens.json        ← from tokens-bruecke (effect styles → shadows)
terrazzo.config.js                 ← Terrazzo config with custom transforms
scripts/postprocess-light-dark.mjs ← orchestrator: tz build + light-dark merge + shadow vars
scripts/terrazzo-css-helpers.mjs   ← sRGB→HSL color transform, px→rem, variable name stripping
scripts/generate-shadow-vars.mjs   ← reads fx.tokens.json, injects --shadow-* CSS vars
```

## Step 1 — Verify the repo

Check the working directory has the expected structure:
- `package.json` with `name: "@gitbutler/design-core"`
- `terrazzo.config.js` exists
- `scripts/postprocess-light-dark.mjs` exists
- `tokens/json/` directory exists

If not found, ask the user where the repo is cloned.

## Step 2 — Install dependencies

```bash
npm install
```

The repo needs `@terrazzo/cli`, `@terrazzo/parser`, and `@terrazzo/plugin-css` as devDependencies. These are pinned in package.json (currently 0.10.x). Do not install them globally — the terrazzo config imports the plugin, and module resolution needs it local.

## Step 3 — Verify token JSON files are present

Check that these files exist and are valid JSON:
- `tokens/json/core.tokens.json`
- `tokens/json/semantic.tokens.json`
- `tokens/json/fx.tokens.json`

If any are missing, tell the user to run `/export-tokens` first (or the tokens-bruecke CLI manually). The export must use `--split-by-collection` with effect styles enabled to produce all three files.

Note: the tokens-bruecke config for this repo lives at `.claude/skills/release-tokens/figma-export.config.json` — it pins hex colors, no scopes, no Figma metadata, and effect styles as the `fx` group.

## Step 4 — Run the build

```bash
npm run build
```

This runs `postprocess-light-dark.mjs`, which:
1. Spawns `npx tz build` (Terrazzo) — reads core + semantic token JSON, applies custom transforms (sRGB→HSL colors, px→rem dimensions), strips collection prefixes from variable names, outputs `tokens/tokens.css` with `:root` and `:root.dark` blocks
2. Merges the two blocks into `light-dark()` values — so `--bg-1` becomes `light-dark(hsl(0 0% 100%), hsl(0 0% 16.1%))` instead of two separate declarations
3. Injects shadow shorthand variables — reads `fx.tokens.json` and generates `--shadow-sm`, `--shadow-md`, etc. with proper `var()` references to semantic color tokens
4. Writes the final `tokens/tokens.css`

Exit code 0 means success.

## Step 5 — Verify the output

Check `tokens/tokens.css` exists and contains:
- A single `:root` block with `color-scheme: light dark` and `light-dark()` values
- `:root.light` and `:root.dark` blocks with just `color-scheme` overrides
- `/* shadow vars */` section with `--shadow-*` custom properties
- No separate `:root.dark` variable declarations (the postprocessor merges them)

Show the user the first ~30 lines and the shadow vars section so they can spot-check.

## Step 6 — Check for changes

If in a git repo, show the meaningful diff (excluding timestamp-only changes):

```bash
git diff -U0 tokens/json | grep '^[+-]' | grep -v '^[+-][+-]' | grep -v createdAt
```

No output means only `createdAt` timestamps moved — the tokens haven't actually changed. Tell the user they can revert.

If there are real changes, summarize what changed (new tokens, removed tokens, value changes) and note the file is ready for commit.
