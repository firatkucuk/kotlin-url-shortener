# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

This is a Spring Boot + Kotlin project currently at the initial Spring Initializr scaffold stage. There is no
business logic yet — no controllers, services, persistence, or URL-shortening functionality has been implemented.
The only files are the generated application entry point, a placeholder context-loads test, and build config.

Note: the Java package is `io.firat.url_shortener` (underscore), not `io.firat.url-shortener`, because hyphens
are invalid in Java/Kotlin package names — this was a deliberate substitution during project generation, not a typo.

## Commands

This project uses the Gradle wrapper — always invoke `./gradlew`, not a system-installed `gradle`.

- Build: `./gradlew build`
- Run the app: `./gradlew bootRun`
- Run all tests: `./gradlew test`
- Run a single test class: `./gradlew test --tests "io.firat.url_shortener.UrlShortenerApplicationTests"`
- Run a single test method: `./gradlew test --tests "io.firat.url_shortener.UrlShortenerApplicationTests.contextLoads"`
- Clean build artifacts: `./gradlew clean`

## Tech stack

- Kotlin 2.3.21 on the JVM, Java toolchain version 25
- Spring Boot 4.1.0 with the Kotlin plugin (`kotlin("plugin.spring")`) — enables Spring's required
  all-open behavior for `@Configuration`/`@Service`/etc. classes despite Kotlin classes being final by default
- JUnit 5 (via `spring-boot-starter-test` and `kotlin-test-junit5`) is the test framework
- Compiler runs with `-Xjsr305=strict` (treats JSR-305 nullability annotations as strict Kotlin null-safety) and
  `-Xannotation-default-target=param-property`

## Architecture

Standard Maven/Gradle layout:
- `src/main/kotlin/io/firat/url_shortener/` — application code
- `src/main/resources/application.properties` — Spring configuration
- `src/test/kotlin/io/firat/url_shortener/` — tests

As the URL-shortener functionality is built out, expect this to grow into typical Spring Boot layers (REST
controllers, a service layer, a persistence layer for short-code ↔ URL mappings). No such structure exists yet,
so don't assume package names like `controller`, `service`, or `repository` until they're actually created.
