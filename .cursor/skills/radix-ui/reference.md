# Radix UI reference (GuavaJobs monorepo)

## Installed packages (`landingpage/package.json`)

| UI wrapper | `@radix-ui` package | Notes |
|------------|----------------------|--------|
| accordion | react-accordion | |
| alert-dialog | react-alert-dialog | |
| aspect-ratio | react-aspect-ratio | |
| avatar | react-avatar | Always provide Fallback |
| checkbox | react-checkbox | |
| collapsible | react-collapsible | |
| context-menu | react-context-menu | |
| dialog | react-dialog | |
| dropdown-menu | react-dropdown-menu | |
| hover-card | react-hover-card | |
| label | react-label | |
| menubar | react-menubar | |
| navigation-menu | react-navigation-menu | |
| popover | react-popover | |
| progress | react-progress | |
| radio-group | react-radio-group | |
| scroll-area | react-scroll-area | |
| select | react-select | |
| separator | react-separator | |
| slider | react-slider | |
| switch | react-switch | |
| tabs | react-tabs | Triggers must be inside List |
| toast | react-toast | Prefer sonner wrapper in app |
| toggle | react-toggle | |
| toggle-group | react-toggle-group | |
| tooltip | react-tooltip | Often needs Provider at layout |
| button, form, sidebar, … | react-slot | `asChild` composition |

## App package (`app/package.json`)

- `@radix-ui/react-label`
- `@radix-ui/react-separator`
- `@radix-ui/react-slot`

Add others via `npx shadcn@latest add` from `app/` when needed.

## Aliases differ by package

**landingpage** (`landingpage/components.json`):

- `@/components` → components
- `@/components/ui` → ui

**app** (`app/components.json`):

- Check `aliases` in that file before importing (typically `@/components/ui` under `src/`).

## Primitive anatomy (quick)

### Dialog family (dialog, sheet, alert-dialog)

`Root` → `Trigger` → `Portal` → `Overlay` + `Content` → (`Title`, `Description`, `Close`)

### Dropdown / Context / Menubar

`Root` → `Trigger` → `Portal` → `Content` → `Group` → `Item` / `CheckboxItem` / `RadioItem` / `Sub` + `SubTrigger` + `SubContent`

### Select

`Root` → `Trigger` + `Value` → `Portal` → `Content` → `Viewport` → `Group` → `Item`

### Tabs

`Root` → `List` → `Trigger` (multiple) → `Content` (per value)

### Popover / Tooltip

`Root` → `Trigger` → `Portal` → `Content` (+ `Arrow` optional)

## Version alignment

When adding a Radix package to `app/`, match the version used in `landingpage/package.json` for the same primitive to avoid duplicate incompatible copies in the workspace lockfile.

## Third-party Radix-based libs in repo

| Library | Built on |
|---------|----------|
| vaul (drawer) | Radix-like drawer patterns |
| cmdk | Command palette (used with dialog) |
| sonner | Toasts (not Radix; preferred for app toasts) |
