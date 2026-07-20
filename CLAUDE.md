# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

This is a monorepo with a Spring Boot + Kotlin backend (`backend/`) and an Angular frontend (`frontend/`).
The backend is still at the initial scaffold stage — no REST endpoints, no service/persistence layers, and
no URL-shortening logic have been implemented. The frontend has its first real page: a frontend-only landing
page (logo + URL input) — there is still no backend integration, no API calls, and no actual URL-shortening
functionality anywhere in the app yet.

Note: the Kotlin package is `io.firat.url_shortener` (underscore), not `io.firat.url-shortener`, because hyphens
are invalid in Java/Kotlin package names — this was a deliberate substitution during project generation, not a typo.

## Backend (`backend/`)

Spring Boot + Kotlin, built with the Gradle wrapper — always invoke `./gradlew` from inside `backend/`, not a
system-installed `gradle`.

- Build: `cd backend && ./gradlew build`
- Run the app: `cd backend && ./gradlew bootRun`
- Run all tests: `cd backend && ./gradlew test`
- Run a single test class: `./gradlew test --tests "io.firat.url_shortener.UrlShortenerApplicationTests"`
- Run a single test method: `./gradlew test --tests "io.firat.url_shortener.UrlShortenerApplicationTests.contextLoads"`
- Clean build artifacts: `./gradlew clean`

Tech stack:
- Kotlin 2.3.21 on the JVM, Java toolchain version 25
- Spring Boot 4.1.0 with the Kotlin plugin (`kotlin("plugin.spring")`) — enables Spring's required
  all-open behavior for `@Configuration`/`@Service`/etc. classes despite Kotlin classes being final by default
- Only `spring-boot-starter` is on the classpath so far (no `spring-boot-starter-web`, no database driver,
  no persistence starter) — add the relevant starters when REST/persistence work actually begins
- JUnit 5 (via `spring-boot-starter-test` and `kotlin-test-junit5`) is the test framework
- Compiler runs with `-Xjsr305=strict` (treats JSR-305 nullability annotations as strict Kotlin null-safety) and
  `-Xannotation-default-target=param-property`

Layout:
- `backend/src/main/kotlin/io/firat/url_shortener/` — application code (currently just `UrlShortenerApplication.kt`)
- `backend/src/main/resources/application.properties` — Spring configuration
- `backend/src/test/kotlin/io/firat/url_shortener/` — tests

As the URL-shortener functionality is built out, expect this to grow into typical Spring Boot layers (REST
controllers, a service layer, a persistence layer for short-code ↔ URL mappings). No such structure exists yet,
so don't assume package names like `controller`, `service`, or `repository` until they're actually created.

## Frontend (`frontend/`)

Angular 20 app scaffolded with the Angular CLI (standalone components, no NgModules), styled with Tailwind CSS 4
and daisyUI 5. The app has one route so far: the root path (`''`) renders the `LandingPage` component
(`frontend/src/app/landing-page/`) — a frontend-only URL-shortener landing page (text wordmark + URL input with
client-side validation). Submitting the form is a no-op placeholder; no `HttpClient` is used anywhere yet, since
there is no backend to call.

- Install dependencies: `cd frontend && npm install`
- Dev server: `npm start` (runs `ng serve`)
- Build: `npm run build`
- Watch build: `npm run watch`
- Run all tests: `npm test` (Karma/Jasmine)
- Generate a component/service/etc.: `npx ng generate component <name>` (or `ng g c <name>` if the Angular CLI
  is installed globally) — this repo's Angular CLI defaults generate files/classes *without* the
  `.component`/`Component` suffix (e.g. `app.ts` / class `App`, `landing-page.ts` / class `LandingPage`);
  follow that same convention for new components rather than the older `*.component.ts` style

Routing: `frontend/src/app/app.routes.ts` holds the route table; `App` (`app.ts`/`app.html`) stays a bare
`<router-outlet />` shell and should generally be left untouched as new page-level components/routes are added.

Tailwind/daisyUI setup notes (Tailwind v4 uses CSS-based config, no `tailwind.config.js`):
- `frontend/.postcssrc.json` wires `@tailwindcss/postcss` into the Angular build's PostCSS pipeline
- `frontend/src/styles.css` is the single entry point: `@import "tailwindcss";` followed by a `@plugin "daisyui"`
  block
- The app is locked to a single daisyUI theme — `styles.css` restricts `themes` to `dark --default` (no other
  themes are compiled in, and there is no light/dark toggle). `frontend/src/index.html`'s `<html>` tag also sets
  `data-theme="dark"` explicitly. Preserve this single-theme setup unless a theme switcher is explicitly requested
- To configure daisyUI themes or Tailwind theme tokens, edit directly in `styles.css` (e.g.
  `@plugin "daisyui" { themes: ... }`) rather than adding a JS config file

Forms: `@angular/forms` is a dependency; the landing page uses Reactive Forms (`FormBuilder`, a single
non-nullable `FormControl<string>`, a custom validator function) rather than template-driven forms — follow this
pattern for future form-bearing pages.

## Coding preferences

- Make sure code changes are suitable for .editorconfig settings (root `.editorconfig` covers the backend;
  `frontend/.editorconfig` is a separate `root = true` file the Angular CLI generated for the frontend)

## Spec / plan workflow

This repo uses a lightweight spec-then-plan workflow before implementation:
- `.claude/commands/spec.md` implements the `/spec` slash command — it turns a short feature idea into a
  human-friendly title, a `claude/feature/<slug>` git branch, and a markdown spec saved to `_specs/<slug>.md`
  (aborting if the working directory isn't clean first).
- `_specs/` holds one markdown file per feature (Overview, Goals, Non-Goals, User Stories, Functional/UI
  Requirements, Open Questions, Future Work) — written before any implementation planning begins.
- `_plans/` holds the corresponding implementation plan per feature (Context, current-state findings, concrete
  implementation steps, files touched, verification steps) — written from Plan mode after the spec is agreed on,
  and is what an implementation session should actually execute against.
- When picking up a feature, check `_specs/` and `_plans/` first for an existing spec/plan before re-deriving
  requirements from scratch.
