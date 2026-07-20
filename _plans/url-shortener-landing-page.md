# Plan: URL Shortener Landing Page (Frontend)

## Context

The repo is a fresh Spring Boot + Angular scaffold with no business logic yet. The spec at
`_specs/url-shortener-landing-page.md` (branch `claude/feature/url-shortener-landing-page`) calls for the
first real page in the app: a compact, lean landing page with a text-based logo ("URL Shortener") and a URL
input that a visitor can submit to shorten a link. This is frontend-only — no backend integration, no result
page, no accounts/history/analytics. The goal is to replace the current empty CLI-generated shell
(`App` renders only `<router-outlet />`) with this page, establishing visual/UX conventions that later pages
can build on, while strictly respecting the spec's Non-Goals.

Resolved decisions from user clarification (authoritative, supersede the spec's open questions):
- Logo is the plain text "URL Shortener" styled as a wordmark — no separate tagline.
- Single fixed daisyUI **"dark"** theme — no toggle, no light theme, no theme-switcher UI.

## Current State (verified)

- `frontend/src/app/`: `app.ts` (standalone, class `App`, selector `app-root`, imports `[RouterOutlet]`),
  `app.html` (`<router-outlet />` only), `app.css` (empty), `app.routes.ts` (`routes: Routes = []`),
  `app.spec.ts` (TestBed test, passes as-is with no router providers).
- `frontend/src/styles.css`: `@import "tailwindcss";` then `@plugin "daisyui";` (no theme restriction yet).
- `frontend/src/index.html`: `<html lang="en">` (no `data-theme`), `<title>Frontend</title>`.
- `frontend/angular.json`: `"schematics": {}` — no explicit override, so the no-suffix naming style seen in
  `app.ts` (not `app.component.ts`, class `App` not `AppComponent`) comes from Angular 20 CLI defaults, not a
  repo config. Verify this holds when generating the new component (see Step 1).
- `@angular/forms` is already a dependency — Reactive Forms usable with no new packages.
- No existing assets/logo files, no `src/assets` directory — logo is text-only, so no asset work needed.
- Only one existing spec file (`app.spec.ts`) to use as the testing pattern.

## Implementation Steps

### 1. Generate the `LandingPage` standalone component
- Run `npx ng generate component landing-page` from `frontend/`, producing
  `frontend/src/app/landing-page/{landing-page.ts,landing-page.html,landing-page.css,landing-page.spec.ts}`.
- **Verify the CLI output matches the existing no-suffix convention** (class `LandingPage`, not
  `LandingPageComponent`; files without `.component.` in the name). If it doesn't, either add
  `"schematics": { "@schematics/angular:component": { "type": "" } }` to `angular.json`, or rename manually —
  don't leave mixed naming conventions in the codebase.
- Selector: `app-landing-page` (matches the `app` prefix already in `angular.json`).
- Import `ReactiveFormsModule` into the component's standalone `imports`.

### 2. Wire it in via the Router (not inlined into `App`)
- Update `frontend/src/app/app.routes.ts`: replace `export const routes: Routes = [];` with a single entry
  `{ path: '', component: LandingPage }`, importing `LandingPage` from `./landing-page/landing-page`.
- Leave `app.ts`, `app.html`, `app.config.ts` untouched — `App` stays a pure `<router-outlet />` shell.
- Rationale: routing is already fully scaffolded (`provideRouter(routes)` in `app.config.ts`), costs nothing
  extra to use, and keeps `App` as a stable shell for when the spec's Future Work (result page, error
  handling) adds more routes later — avoids a refactor down the line. No wildcard/redirect route is added;
  out of scope for a single-page app.

### 3. Build the template (`landing-page.html`)
Structure, top to bottom, all within one centered wrapper (no navbar/footer/marketing sections):
1. Full-viewport flex container, centering content both vertically and horizontally.
2. Narrow, width-capped inner column (comfortable max-width on desktop, fluid with horizontal padding on
   mobile), consistent vertical spacing between children.
3. `<h1>` wordmark containing the literal text "URL Shortener" — bold, distinct sizing, no tagline beneath.
4. Form row: URL text input + submit ("Shorten") button, visually grouped as one compact unit (daisyUI
   `join` fits well here) rather than a stacked labeled form.
5. A reserved feedback region directly below the form row for validation errors / the placeholder
   "not live yet" note — same slot for both, sized consistently so its appearance doesn't shift layout.

Keep input + button on one row at all breakpoints (no stacking on mobile) — a phone-width joined control
still fits comfortably and preserves the "small and lean" feel. Use daisyUI's default (not `-xs`) control
sizing for touch-friendly tap targets.

### 4. Form logic (`landing-page.ts`) — Reactive Forms
- Single typed control via `FormBuilder.nonNullable.control('', ...)` (no need for a full `FormGroup` with
  only one field) — keeps the component itself lean.
- Validators: `Validators.required` (with trimming, so whitespace-only counts as empty) plus a
  "plausible URL" check (pattern or small custom validator) — permissive enough to accept scheme-less input
  like `example.com`, but reject clearly-not-a-URL strings like `asdf`. Distinguish required vs.
  format-invalid so the right message can be shown.
- Show errors only after `touched` or a submit attempt — not on every keystroke — with daisyUI's error input
  styling plus text in the feedback region.
- Submit button is disabled while invalid, enabled once valid. Clicking while valid is a **no-op**: no
  `HttpClient` is injected anywhere in this component (confirms the no-backend Non-Goal); it just sets a
  local flag that reveals a static "Shortening isn't live yet — check back soon" note in the feedback region.
  Editing the input afterward clears that note, returning to a fresh validation/no-message state.

### 5. Lock in the daisyUI dark theme
- `frontend/src/styles.css`:
  ```
  @import "tailwindcss";
  @plugin "daisyui" {
    themes: dark --default;
  }
  ```
  Restricting `themes` to just `dark` means no other theme CSS is even compiled in, and structurally
  prevents an accidental toggle from being wired in later.
- `frontend/src/index.html`: add `data-theme="dark"` to the `<html>` tag (technically redundant with
  `--default`, but explicit/defensive) and update `<title>Frontend</title>` to `<title>URL Shortener</title>`
  as a small, low-risk part of replacing the placeholder shell.

### 6. Tests (`landing-page.spec.ts`)
Using the same `TestBed.configureTestingModule({ imports: [LandingPage] })` pattern as `app.spec.ts`, cover:
1. Component creation.
2. Wordmark text "URL Shortener" renders.
3. Initial state: submit disabled, no error/placeholder message shown (pristine).
4. Empty/whitespace input + touched → required-style error shown, button stays disabled.
5. Implausible URL (e.g. `'not a url'`) + touched → format error shown, button stays disabled.
6. Valid URL (e.g. `'https://example.com'`) → errors clear, button enabled.
7. Triggering submit while valid → placeholder "not live yet" note appears (no `HttpClient` involved).
8. Editing input after submit → placeholder note clears.

`app.spec.ts` needs **no changes** — verified it currently passes unmodified (no router providers needed
for `RouterOutlet` to construct), and `App`'s template isn't touched by this plan.

## Files Touched

- `frontend/src/app/landing-page/landing-page.ts` (new)
- `frontend/src/app/landing-page/landing-page.html` (new)
- `frontend/src/app/landing-page/landing-page.css` (new, likely minimal/empty — layout via Tailwind utilities)
- `frontend/src/app/landing-page/landing-page.spec.ts` (new)
- `frontend/src/app/app.routes.ts` (edit — add the one route)
- `frontend/src/styles.css` (edit — restrict/lock daisyUI theme to `dark`)
- `frontend/src/index.html` (edit — `data-theme="dark"`, `<title>`)

No changes to `app.ts`, `app.html`, `app.config.ts`, or anything under `frontend/public/` (no logo asset
needed — text-only per the resolved decision).

## Verification

Manual (dev server):
1. `cd frontend && npm start`, open `http://localhost:4200/`.
2. Confirm only the wordmark, input+button, and nothing else renders; dark theme applied with no
   flash/toggle; content centered without excessive empty space.
3. Interaction: button starts disabled → focus/blur with empty input shows the required error → implausible
   text shows the format error → a valid URL clears errors and enables the button → clicking it shows the
   "not live yet" note with no network request firing (check dev tools Network tab) → editing again clears
   the note.
4. Resize to a mobile width (~375–400px) and repeat the visual check — no horizontal scroll, controls stay
   legible and tappable, input+button row stays joined rather than stacking.

Automated:
5. `cd frontend && npm test` — confirm `app.spec.ts` still passes unmodified and all new
   `landing-page.spec.ts` cases pass.
6. `cd frontend && npm run build` — confirms the production build and strict template type-checking succeed.