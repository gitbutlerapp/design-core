---
name: release-tokens
description: Rebuild @gitbutler/design-core design tokens from Figma, version them, and prepare the npm release for the user to publish. Use when asked to rebuild/sync/pull tokens from Figma, regenerate tokens.css, bump the design-core version, cut a release, or publish the package. Covers the pipeline — tokens-bruecke export → terrazzo build → semver bump → commit → tag — then stops and hands the user a copy-paste publish command (npm 2FA blocks unattended publishing).
---

# Release design tokens

Pipeline: **export from Figma → build CSS → review → version → commit → tag → hand off**.

The agent prepares the entire release. The user runs exactly one command: `npm publish`.

Run every command from the repo root (`design-core/`). Do not skip the review step — once
the user publishes it cannot be undone (unpublish is only allowed within 72h and burns the
version number for good).

## 0. Preflight

```bash
git branch --show-current          # expect main
but status                         # working tree should be clean before exporting
npm whoami                         # must print a user with @gitbutler publish rights
```

If the tree is dirty, stop and ask whether to release those changes too or stash them.
If `npm whoami` errors, tell the user to run `npm login` — do not attempt to authenticate.
Being logged in is not enough to publish: 2FA is `auth-and-writes`, so step 6 needs a
one-time code from the user. Say this up front, at the start of the run — not after the
version is already bumped and tagged.

## 1. Export tokens from Figma

Credentials live in `.env` (gitignored): `FIGMA_API_KEY`, `FIGMA_FILE_KEY`.
The exporter is the tokens-bruecke CLI at `/Users/pavellaptev/Documents/GitHub/figma-plugin/bin/cli.js`
(same tool as the Figma plugin; `npx tokens-bruecke` also works).

Verify the token first — PATs expire every 90 days:

```bash
set -a && . ./.env && set +a
curl -s -H "X-Figma-Token: $FIGMA_API_KEY" https://api.figma.com/v1/me
```

Then export straight into `tokens/json/`:

```bash
set -a && . ./.env && set +a
node /Users/pavellaptev/Documents/GitHub/figma-plugin/bin/cli.js \
  -a "$FIGMA_API_KEY" \
  -f "$FIGMA_FILE_KEY" \
  -c .claude/skills/release-tokens/figma-export.config.json \
  -o tokens/json \
  --split-by-collection
```

`figma-export.config.json` in this skill folder reproduces the settings the committed
tokens were generated with — DTCG 2025.10, hex colors, no scopes, no Figma metadata,
effect styles exported as the `fx` collection. Do not change it casually: a config change
rewrites every token file and produces a huge, unreviewable diff.

Expected output: `tokens/json/core.tokens.json`, `semantic.tokens.json`, `fx.tokens.json`.

**Failure modes** (both surface as HTTP 403):

| Message | Meaning | Fix |
| --- | --- | --- |
| `Token expired` | PAT past its 90-day life | User regenerates the PAT in Figma → Settings → Security |
| `Invalid scope(s): … requires the file_variables:read scope` | PAT missing the variables scope | Regenerate **with `file_variables:read` checked** — only offered on Enterprise plans |

Both need the user. Stop and ask; never work around by hand-editing token JSON.

## 2. Detect whether anything actually changed

Every export rewrites the `createdAt` stamp in each file's
`$extensions["tokens-bruecke-meta"]`, so a no-op export still shows a diff.

```bash
git diff --stat tokens/json
git diff -U0 tokens/json | grep '^[+-]' | grep -v '^[+-][+-]' | grep -v createdAt
```

If that last command prints nothing, only the timestamps moved — **there is nothing to
release**. Run `git checkout -- tokens/json`, tell the user the Figma file has no changes,
and stop. Do not bump or publish a version whose only diff is a timestamp.

## 3. Build the CSS

```bash
npm run build
```

This runs `scripts/postprocess-light-dark.mjs`, which:
1. spawns `npx tz build` — Terrazzo reads `core.tokens.json` + `semantic.tokens.json`
   (per `terrazzo.config.js`) and writes `tokens/tokens.css`;
2. merges the `:root` / `:root.dark` blocks into `light-dark(…)` values;
3. appends shadow vars generated from `fx.tokens.json` via `scripts/generate-shadow-vars.mjs`.

`tokens/tokens.css` is generated — never edit it by hand. If a token changed in JSON but
not in the CSS, the token is probably in a collection Terrazzo does not read; say so
rather than patching the CSS.

Review the result:

```bash
git diff tokens/tokens.css
```

Sanity-check that the CSS diff matches the JSON diff. Nothing else in the repo should change.

## 4. Choose the version bump

Read the diff and pick the level — `package.json` currently drives npm consumers of
`--var(...)` names, so **removed or renamed CSS custom properties are breaking**:

| Change | Bump |
| --- | --- |
| Token *values* tweaked (colors, sizes, opacity) | patch |
| New tokens added; new collection | minor |
| Tokens removed or renamed; CSS var names changed | major |

State the chosen level and the reason, list the affected tokens, and **confirm with the
user before publishing**. If unsure between two levels, choose the higher one and say so.

## 5. Commit, version, tag

House style (see `git log`): the version bump lives in the **same commit** as the token
changes, tagged with a bare `X.Y.Z` annotated tag — no `v` prefix.

```bash
npm version <patch|minor|major> --no-git-tag-version   # edits package.json only
```

Commit with GitButler (this repo uses the `but` CLI — use the `gitbutler` skill for the
commit itself, not raw `git commit`). Message: a short summary of what changed in the
tokens, e.g. `Adjust dark-mode change status colors`. Include `package.json`,
`tokens/json/*.tokens.json`, and `tokens/tokens.css`.

Then tag the commit:

```bash
VERSION=$(node -p "require('./package.json').version")
git tag -a "$VERSION" -m "$VERSION"
```

## 5b. The automated path (preferred)

CI can do steps 3–7 on its own. Instead of bumping and publishing locally, push the
token JSON on a branch and open a PR:

- `.github/workflows/tokens-pr.yml` runs on PRs touching `tokens/json/**`. It rebuilds
  `tokens/tokens.css`, commits it back onto the PR branch, bumps the version from the CSS
  custom-property diff, and comments the added/changed/removed tokens. A bump that would
  be **major** fails the check until the PR carries the `release:major` label — removed or
  renamed vars break every consumer. If only `createdAt` moved, it says so and bumps nothing.
- Merging the PR triggers `.github/workflows/release.yml`, which publishes to npm via
  trusted publishing (OIDC — no token, no OTP), pushes the bare `X.Y.Z` tag, and cuts a
  GitHub release.

So the automated release is: export from Figma (step 1) → PR → review the bot's comment →
merge. Use the manual steps below only when CI is unavailable or the release must go out
without a PR.

## 6. Stop here — hand the publish to the user

**The agent never publishes.** The npm account has 2FA set to `auth-and-writes`, so
every publish needs a one-time code. Everything up to this point is prepared and
committed; the release itself is the user's single manual action.

Run the dry run first — it needs no OTP and confirms the package contents:

```bash
npm publish --dry-run
```

Check the file list covers `tokens/`, `fonts/`, `styles/`, `core.css`, `README.md`, and
that the version in the output is the one just bumped. Then present this block to the
user, with the real version substituted in — no placeholders:

```bash
cd /Users/pavellaptev/Documents/GitHub/gitbutler/design-core
npm publish              # prompts for your 2FA code
git push origin main
git push origin 3.12.5   # <- the tag you just created
```

Run in their own terminal, `npm publish` prompts for the OTP interactively — no `--otp`
flag needed.

Offer to run the two `git push` commands yourself once they confirm the publish
succeeded; those need no OTP. Do not push before the publish lands — if the version turns
out to be wrong, an unpushed commit and tag are trivial to amend, a pushed one is not.

Never attempt to work around the 2FA prompt: no `--force`, no editing `~/.npmrc`, no
improvised automation tokens.

## 7. After the publish

Once the user confirms it went through:

```bash
git push origin main
git push origin "$(node -p "require('./package.json').version")"
npm view @gitbutler/design-core version    # should match
```

Pushing `tokens/tokens.css` triggers `.github/workflows/deploy-hue-dini.yml`, which
redeploys the hue-dini palette site to GitHub Pages (it is styled with these tokens).

## Report back

When you stop at step 6, tell the user in one block: the new version and the bump level
with its reason, a short list of tokens added/changed/removed, that the commit and tag
exist locally but are **not pushed**, and the copy-paste publish command. After they
confirm and you push, report the pushed tag and the live npm version. If you
stopped early (expired token, no changes, user declined the bump, waiting on an OTP), say
exactly where and what is needed to resume.
