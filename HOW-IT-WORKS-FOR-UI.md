# Liquio — Product & UI Architecture

> Note: this is a design/UI-focused companion doc. The repo also has an [`ARCHITECTURE.md`](ARCHITECTURE.md) at the root covering the full backend microservices architecture in depth — read that if you ever need the service-to-service picture. This doc stays focused on the product and the two apps you design for.

## 1. What the product is

Liquio is a **GovTech low-code platform**: it lets government teams configure and launch citizen-facing digital services (permits, registrations, applications) without writing much custom code. A "service" is modeled as a **BPMN workflow** with **JSON-schema-defined forms** attached to each step. Analysts/business users configure the workflow and forms in the admin panel; citizens and businesses complete them in the personal cabinet.

Two user-facing products exist, both are React SPAs, both are what you'll be designing for:

| | Admin panel | Cabinet |
|---|---|---|
| **Who** | Officials, back-office staff, low-code developers | Citizens & businesses (occasionally officials too) |
| **What for** | Configure workflows (BPMN designer), manage registries/reference data, manage users, view stats/logs, generate reports | Complete/track service requests, message with case handlers, view/sign documents, manage their own profile |
| **Folder** | `components/admin-front` | `components/cabinet-front` |
| **Local URL** | http://localhost:8082 | http://localhost:8081 |

Everything else in the platform (workflow engine, signing, notifications, file storage, registries...) is backend plumbing behind `admin-api` / `cabinet-api` — see the root `ARCHITECTURE.md` if curious, but you generally don't need to touch it for UI work.

## 2. Frontend tech stack

- **React 18**, **Redux + redux-thunk** for state, **react-router-dom v5** for routing.
- **MUI v5** (`@mui/material`) is the component foundation, with some legacy `@mui/styles` / `react-jss` still in use alongside it.
- Build tooling is **Create React App via `craco`** (not Vite/Next) — `npm start` / `npm run build` in each app.
- Forms/dynamic content are driven by a **JSON-schema rendering engine** (see §4) rather than hand-built pages, for most business content.

## 3. The shared design system: `packages/front-core`

This is the actual component library both apps are built from. It's a local package (imported as bare `core`) containing:

- `components/` — ~90 shared React components: dialogs, data tables/grids, file preview & upload, tree views, the BPMN diagram viewer/editor, snackbars, the whole `JsonSchema` form engine, etc.
- `theme.js` — the base MUI theme object.
- `actions/`, `reducers/`, `store/` — shared Redux wiring.
- `helpers/`, `hooks/`, `services/` — shared utilities (date formatting, file handling, e-signature/EDS helpers, API client, etc.).
- `translation/` — shared i18n strings (`uk-UA`, `en-GB`, `de-DE`, `fr-FR`, `nl-NL`).

**Design implication:** a change here (a button style, a form field's look) potentially affects *both* admin and cabinet at once, unless the consuming app overrides it (§3.1). This is the place to change something platform-wide (e.g. "make all data tables use this row height").

### 3.1 How each app customizes/overrides `core`

Neither app forks `core`. Instead, each app's `craco.config.js` tells webpack to resolve bare imports by checking a few local folders *before* falling back into `core`:

```
admin-front:   src/application  →  node_modules/core  →  src  →  node_modules
cabinet-front: src/superstructure  →  src/application  →  node_modules/core  →  src  →  node_modules
```

So if `core` has `components/JsonSchema/...`, an app can silently replace it just by creating a file at the same relative path under `src/application/` (or `src/superstructure/` for cabinet, which wins first). Both apps already do this for `components/JsonSchema`; admin additionally overrides `App.jsx` and `theme.js` this way.

**Practical rule of thumb:**
- Want to change something **everywhere**? Edit it in `packages/front-core`.
- Want to change something **only in admin** or **only in cabinet**? Create/edit the same-named file under that app's `src/application` (cabinet: `src/superstructure` takes priority over `src/application`).

## 4. Forms are schema-driven, not hand-coded

Most of the actual "screen content" a citizen or official fills in isn't a React page you'd find and edit directly — it's generated at runtime from a JSON schema (configured in the admin workflow designer) by `packages/front-core/components/JsonSchema`. That engine ships ~80 field/element types under `JsonSchema/elements/`, e.g.:

`Address`, `StringElement`, `Date`, `Select`, `RadioGroup`, `CheckboxGroup`, `DataTable`, `Table`, `Spreadsheet`, `Map`, `GeojsonMap`, `Calculator`, `Payment`, `SignerList`, `SelectFiles`, `RichTextEditor` (via CKEditor), `DocumentSharing`, `ScheduleCalendar`, `Tabs`, `Card`, `PdfBlock`, `VideoPlayer`, `UserSelect`, `RegisterTable`, and more.

**Design implication:** if you want to improve how a *specific field type* looks or behaves (e.g. the date picker, the file upload area), you edit its element component here — the change then shows up in every form across the whole platform that uses that field type, in both admin and cabinet.

## 5. Theming — where visual identity actually lives

MUI v5 theme objects (still shaped like v4 — `overrides`, `palette.type` — and passed through `adaptV4Theme()` in each app's `App.jsx`):

| File | Role | Current state |
|---|---|---|
| `packages/front-core/theme.js` | Base/default theme | **Actively customized**: light theme, blue (`#0068FF`) primary, accessible focus-ring styling (`outlineColor`), custom `MuiButton`/`MuiDataGrid`/`MuiTabs`/`MuiStepper` styling, its own typography scale (`title`, `subheading`, `subheading2`, `label`, `label1`, `label2`, `breadcrumbs`), plus bespoke tokens (`leftSidebarBg`, `dataTableHighlights`, etc.) |
| `components/admin-front/src/application/theme.js` | Admin's theme override | A **separate, older-style dark theme**: purple (`#BB86FC`) primary, dark surfaces, legacy MUI v4 typography variants (`display1`–`display4`, `headline`, `title`). This is what actually renders in admin — it fully replaces the base theme above. |
| `components/cabinet-front/src/superstructure/theme.js` | Cabinet's theme override point | **Currently a pass-through** (`export { default } from 'core/theme'`) — so cabinet renders the polished light-blue base theme above, unmodified |

*(Corrected after building the in-app Style Guide below and reading the actual rendered values — I had this backwards in an earlier pass: it's admin that carries its own distinct theme override, and cabinet that inherits the nicer shared one, not the other way round.)*

**Two live options depending on what you want:**
- Want cabinet to look different from its current (shared, blue) look? Give `cabinet-front/src/superstructure/theme.js` its own theme object.
- Want admin to match the more polished shared theme instead of its own dark/purple one? Point `admin-front/src/application/theme.js` at (or delete it in favor of) `core/theme.js`, or intentionally rework its overrides.

## 6. Feature areas ("modules") per app

Each app organizes its own screens as "modules" layered on top of `core`'s shared components:

- **Admin** (`components/admin-front/src/application/modules`): workflow (BPMN designer), registry, users, reports, processStatistics, elastic (search/logs), fileLibrary, favorites, settings, metrics, healthCheck, kibana, mocks, multiLang, customInterfaces, profile, home.
- **Cabinet** (`components/cabinet-front/src/application/modules`): home, inbox, messages, tasks, registry, workflow, users, reports, admin (limited admin-in-cabinet access).

## 7. Style Guide page

Both apps now have a live component/token reference at **`/style-guide`** once logged in (added under `packages/front-core/modules/styleGuide`, wired into both apps' navigation — look for "Style guide" in the sidebar). It renders real MUI components — typography scale, color palette + custom theme tokens (read straight off the active theme via `useTheme()`), Paper elevations, buttons, inputs, chips, tabs — using whichever theme is actually active for that app. Since it's just another page in the real app, it hot-reloads with `npm start`: edit a theme file, save, and the page (and the rest of the app) updates immediately.

This is also how the theming mix-up above was actually caught — the page showed admin rendering `#BB86FC` purple in the live palette swatches, which is what sent me back to double-check the source files.

## 8. Where to start

1. Run the stack locally (see `HOW-TO.md`).
2. Load the example workflow so you have real, populated screens to look at (also in `HOW-TO.md`, §5).
3. Open `/style-guide` in each app to see its actual live theme and components side by side.
4. Decide which direction you want each app's theme to go (see §5), then edit the relevant `theme.js` and watch `/style-guide` update live via `npm start`.
5. From there, move to specific `JsonSchema/elements/*` components in `core` for field-level redesigns, or app-level `application/components` overrides for anything that should differ between admin and cabinet.
