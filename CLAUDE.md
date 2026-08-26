# Working on this repo — theme project

This fork's active work is a **design-system/theme overhaul** for `admin-front` and
`cabinet-front`, directed by a product designer who is decomposing how the theme is built,
piece by piece. For what Liquio the product actually is and the general frontend architecture
(shared `packages/front-core`, schema-driven forms, module layout), read
[`HOW-IT-WORKS-FOR-UI.md`](HOW-IT-WORKS-FOR-UI.md) first — this file only covers the theme
project itself: its goal and how it's managed.

## The goal: tokenize, don't hardcode

Every visual property should trace back to **one** theme token — never a literal value
copy-pasted into a second place "to make it match." A value that's merely *equal* to a token
today, but not actually *derived* from it, will silently drift the next time either one
changes.

The canonical example (see `CHANGES.md` → Typography): Button's `small`/`large` sizes were
fixed by adding `MuiButton.sizeSmall`/`sizeLarge` overrides with a hardcoded
`fontSize: '0.875rem'` — visually correct, but a second literal duplicating
`theme.typography.button.fontSize`, not a reference to it. The properly tokenized fix uses a
function-valued style override that reads the token live:
`sizeSmall: ({ theme }) => ({ fontSize: theme.typography.button.fontSize })`. Prefer this
shape for every future fix — a literal in two places is a bug waiting to happen, not a
completed fix.

Also watch for the same failure mode in the *other* direction: `theme.overrides.json` (below)
is meant to hold deliberate, documented values — not leftover experiments. An untracked
`typography.htmlFontSize: 14` baked in there once silently distorted an otherwise-correct
Button fix elsewhere on the page. Don't let stray bake values accumulate un-audited.

## How the work is managed

1. **`/style-guide`** (`packages/front-core/modules/styleGuide`, mounted in both apps) is the
   live inspection tool — the way to *analyze how something actually renders right now*
   before proposing a change. It reads tokens straight off the active theme via `useTheme()`
   and shows per-token theme/overridden/other status. Prefer verifying a claim there (or via
   `getComputedStyle` on the real running page) over reasoning from `theme.js` source alone —
   MUI's own components hardcode more defaults than you'd expect (see the Button font-size
   case above).
2. **`CHANGES.md`** is the append-only decision log for every theme change — grouped by area,
   not by date; each entry ends with the date it was last touched, and gets *revised in place*
   as understanding evolves rather than superseded by a new entry. Update it whenever a theme
   file changes. Its "Worth addressing" section is the current backlog of known-but-unfixed
   issues — check it before assuming something is undiscovered.
3. **`theme.overrides.json`** (currently `admin-front` only) is deep-merged over
   `theme.js` at load time — the target for deliberate, hand-authored tweaks (and what the
   Style Guide's live editor bakes into). Treat every key in it as an intentional decision
   that belongs in `CHANGES.md`, not a scratch pad.
4. **Legacy theme shape**: `theme.js` files still use the v4 `overrides`/`props` shape,
   adapted at runtime via `adaptV4Theme()` in each app's `App.jsx` — not yet migrated to v5's
   native `components.<Name>.styleOverrides`. Function-valued style overrides (see above) work
   fine through this bridge; don't let the legacy shape become an excuse to hardcode instead.
5. **Collaboration model**: the product designer directs the work step by step. Look up and
   analyze the current state via the guide and `CHANGES.md` first; don't propose a scope or
   roadmap unprompted. Ask only when genuinely blocked on a decision only they can make (e.g.
   "should these three sizes share one value, or intentionally differ?") — not to get buy-in
   on an overall plan.

## Dev environment — the real app is not local

The running apps live in **Docker + standalone CRA dev servers on a remote Windows PC**, not
on this machine. They're reached from here at `http://admin.liquio.local/` and
`http://cabinet.liquio.local/` via that PC's nginx-proxy-manager. **Never run `npm start` /
`craco start` / any build locally on this Mac** — it won't be what's actually served, and
local `node_modules`/lockfile state can diverge from the real dev environment.

To get a local change into the real running app:

1. Commit and push to `origin` (this fork) on this Mac.
2. Reach the Claude agent already running in that environment: it's an Orca remote
   environment named `windows-pc` (`orca environment list --json`), worktree
   `C:/Users/artem/orca/liquio-mui-cistom`. Use `orca terminal list/read/send` with
   `--environment <that id>` to message it.
3. Ask it to `git pull`, then `npm install` (not `npm ci` — lockfiles aren't kept current,
   so `ci` will fail) in whichever app(s) changed, then restart that app's dev server
   (`PORT=8082 npm start` for admin-front, `PORT=8081 npm start` for cabinet-front, both run
   with `BROWSER=none`).
4. **A `packages/front-core` change always needs that restart — it will never hot-reload.**
   `front-core` is symlinked into each app's `node_modules/core`, and webpack's default file
   watcher ignores everything under `node_modules`, symlinks included. A change under an
   app's own `src/` (e.g. `admin-front/src/application/theme.js`) hot-reloads fine; a change
   under `packages/front-core` (e.g. `StyleGuide.jsx`) silently doesn't, even though the pull
   itself succeeds — don't assume it's live without restarting.
5. When sending it multi-sentence instructions over `orca terminal send`, send them as a few
   short separate messages rather than one long one — long single messages have been observed
   arriving garbled/truncated in that terminal.

For running the full stack from scratch (Docker Compose, login, example data), see
[`HOW-TO.md`](HOW-TO.md) — that doc is generic setup instructions, not specific to the theme
project or the Windows-PC split described above.
