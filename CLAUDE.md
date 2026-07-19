# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

This is a monorepo with a Spring Boot + Kotlin backend (`backend/`) and an Angular frontend (`frontend/`). Both
are at the initial scaffold stage — there is no business logic yet, no REST endpoints, no API calls from the
frontend, and no URL-shortening functionality has been implemented.

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
- JUnit 5 (via `spring-boot-starter-test` and `kotlin-test-junit5`) is the test framework
- Compiler runs with `-Xjsr305=strict` (treats JSR-305 nullability annotations as strict Kotlin null-safety) and
  `-Xannotation-default-target=param-property`

Layout:
- `backend/src/main/kotlin/io/firat/url_shortener/` — application code
- `backend/src/main/resources/application.properties` — Spring configuration
- `backend/src/test/kotlin/io/firat/url_shortener/` — tests

As the URL-shortener functionality is built out, expect this to grow into typical Spring Boot layers (REST
controllers, a service layer, a persistence layer for short-code ↔ URL mappings). No such structure exists yet,
so don't assume package names like `controller`, `service`, or `repository` until they're actually created.

## Frontend (`frontend/`)

Angular 20 app scaffolded with the Angular CLI (standalone components, no NgModules), styled with Tailwind CSS 4
and daisyUI 5. Currently just the empty CLI-generated shell (`App` renders a bare `<router-outlet />`) — no
routes, components, or API integration exist yet.

- Install dependencies: `cd frontend && npm install`
- Dev server: `npm start` (runs `ng serve`)
- Build: `npm run build`
- Watch build: `npm run watch`
- Run all tests: `npm test` (Karma/Jasmine)
- Generate a component/service/etc.: `npx ng generate component <name>` (or `ng g c <name>` if the Angular CLI
  is installed globally)

Tailwind/daisyUI setup notes (Tailwind v4 uses CSS-based config, no `tailwind.config.js`):
- `frontend/.postcssrc.json` wires `@tailwindcss/postcss` into the Angular build's PostCSS pipeline
- `frontend/src/styles.css` is the single entry point: `@import "tailwindcss";` followed by `@plugin "daisyui";`
- To configure daisyUI themes or Tailwind theme tokens, edit directly in `styles.css` (e.g.
  `@plugin "daisyui" { themes: ... }`) rather than adding a JS config file

## Coding preferences

- Make sure code changes are suitable for .editorconfig settings (root `.editorconfig` covers the backend;
  `frontend/.editorconfig` is a separate `root = true` file the Angular CLI generated for the frontend)
