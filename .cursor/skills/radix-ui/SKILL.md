---
name: radix-ui
description: >-
  Works with Radix UI primitives and shadcn/ui wrappers in this monorepo.
  Covers composition, asChild/Slot, data-state styling, accessibility parts,
  and adding or debugging components. Use when editing @radix-ui packages,
  components/ui/*, overlays (Dialog, Sheet, Popover), forms, menus, or when
  the user mentions Radix, primitives, or unstyled accessible components.
---

# Radix UI (shadcn patterns)

## When to use this skill

| Task | Use |
|------|-----|
| Add or style UI in `landingpage/` or `app/` | This skill + existing `components/ui/*` |
| Add a new shadcn component | `shadcn` skill — `npx shadcn@latest add` from the correct package root |
| Registry search, presets, CLI | `shadcn` skill |

**Do not** install raw `@radix-ui/*` in feature code when a `components/ui` wrapper exists. Import from `@/components/ui/...`.

## Repo layout

| Package | Radix usage | UI path |
|---------|-------------|---------|
| `landingpage/` | Full Radix set (accordion → tooltip) | `landingpage/components/ui/` |
| `app/` | label, separator, slot (via Button) | `app/src/components/ui/` |

Both use **shadcn new-york**, RSC, Tailwind v4, `cn()` from `@/lib/utils`. Run shadcn CLI from the package that owns `components.json`.

## Core concepts

### Primitives and parts

Radix components are **unstyled primitives** with named parts:

```tsx
import * as DialogPrimitive from '@radix-ui/react-dialog'

<DialogPrimitive.Root>
  <DialogPrimitive.Trigger />
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay />
    <DialogPrimitive.Content>
      <DialogPrimitive.Title />
      <DialogPrimitive.Description />
      <DialogPrimitive.Close />
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
</DialogPrimitive.Root>
```

In this repo, each part is wrapped in `components/ui/*` and re-exported (e.g. `Dialog`, `DialogTrigger`, `DialogContent`).

### `asChild` and `Slot`

Merge props onto a child element instead of rendering a default DOM node:

```tsx
import { Slot } from '@radix-ui/react-slot'

const Comp = asChild ? Slot : 'button'
return <Comp className={cn(...)} {...props} />
```

Use `asChild` on triggers so a `Button` or `Link` becomes the interactive element:

```tsx
<DialogTrigger asChild>
  <Button variant="outline">Open</Button>
</DialogTrigger>
```

**Rules:** The child must accept ref and event handlers (one element, not a fragment).

### Client components

Radix uses hooks and browser APIs. Files that import `@radix-ui/*` need `'use client'` at the top. shadcn UI files in this repo already include it.

### State-driven styling

Radix exposes `data-state`, `data-side`, `data-disabled`, etc. Project overlays use Tailwind with `data-[state=open]:`, `data-[state=closed]:`:

```tsx
className={cn(
  'data-[state=open]:animate-in data-[state=closed]:animate-out',
  className,
)}
```

Do not add manual `z-index` on Dialog/Sheet/Popover — wrappers already set stacking.

### Controlled vs uncontrolled

- Uncontrolled: `defaultOpen`, `defaultValue`
- Controlled: `open` + `onOpenChange`, `value` + `onValueChange`

Pick one pattern per instance; do not mix without reason.

## Workflow: add UI

1. Check `components/ui/` in the target package — reuse if present.
2. If missing: from that package directory, `npx shadcn@latest add <component>`.
3. Compose exported parts; extend styling via `className` on wrappers, not by forking primitives unless necessary.
4. For `app/`, add only what the app needs; prefer matching `landingpage` versions when adding Radix deps to keep versions aligned.

## Workflow: compose overlays

Required for accessibility (Radix enforces via warnings / screen readers):

| Component | Required parts |
|-----------|----------------|
| Dialog / Sheet (dialog primitive) | `Title` (use `className="sr-only"` if hidden), often `Description` |
| Alert Dialog | `Title`, `Description`, `Action` / `Cancel` |
| Popover / Tooltip | `Trigger` + `Content`; label tooltips when no visible text |

Example:

```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Settings</DialogTitle>
      <DialogDescription>Manage your account preferences.</DialogDescription>
    </DialogHeader>
    {/* body */}
    <DialogFooter>
      <Button>Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

Sheet in this repo is `@radix-ui/react-dialog` under the hood — same Title/Description rules.

## Workflow: menus and selects

- Items live inside **Group** components (`DropdownMenuGroup`, `SelectGroup`, etc.).
- Use `asChild` on triggers for custom buttons/links.
- Select: `SelectTrigger` → `SelectValue` → `SelectContent` → `SelectItem` (inside `SelectGroup` when grouped).

## Workflow: forms

- Prefer shadcn `Form` + `Field` / `FieldGroup` in `landingpage` (see `shadcn` skill).
- `Label` maps to `@radix-ui/react-label`; associate with controls via `htmlFor` / `id`.
- Validation: `aria-invalid` on control, `data-invalid` on field wrapper.

## Editing wrappers

When changing `components/ui/*`:

1. Keep `React.ComponentProps<typeof XPrimitive.Part>` for typing.
2. Forward `...props` to the primitive.
3. Use `cn()` for class merging; preserve `data-slot` attributes used in this repo.
4. Export all parts the shadcn template exports.

## Common pitfalls

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| "Button inside button" | Nested triggers | Use `asChild` on outer trigger |
| Hydration mismatch | Radix ID / open state | Ensure `'use client'`; avoid random IDs on server |
| Focus trap / scroll issues | Multiple portals | Use provided `DialogContent` / `SheetContent` (includes Portal + Overlay) |
| Missing dialog label | No `Title` | Add `DialogTitle` or `sr-only` title |
| Select won't open | Missing portal/content | Use full composition from `select.tsx` |
| Styles ignored | Styling primitive directly | Style the wrapper in `components/ui`, not duplicate primitives in pages |

## Package map

For primitive → npm package mapping and version pins, see [reference.md](reference.md).

## Related skills

- **shadcn** — CLI, composition rules, forms, styling tokens
- **shadcn** `base-vs-radix` — when a component uses `render` instead of `asChild` (check `npx shadcn@latest info`)

## Docs

- Radix: https://www.radix-ui.com/primitives/docs/overview/introduction
- shadcn: https://ui.shadcn.com/docs/components

Fetch component-specific API via `npx shadcn@latest docs <component>` from the correct package root.
