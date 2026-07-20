# URL Shortener Landing Page

## Overview

Build the main landing page for the URL shortener frontend application. The page presents the product's
core value proposition through a compact, focused layout: a logo/brand mark and a URL input where a visitor
can submit a long URL to be shortened. This work covers the frontend presentation and interaction only —
no backend API integration, no real shortening logic, and no persistence. Submitting the form does not need
to produce a working short link yet.

## Goals

- Give the application a real landing page in place of the current empty scaffold shell.
- Establish a small, lean, single-purpose page: a logo and a URL input, without unrelated content or clutter.
- Make the page usable and clear on both desktop and mobile viewport sizes.
- Establish visual/UX patterns (spacing, typography, component style) that later pages/features can build on.

## Non-Goals

- No backend integration: no HTTP calls, no real short-link generation, no persistence of submitted URLs.
- No routing to a "result" page or display of a generated short link — backend integration will define
  that flow later.
- No user accounts, authentication, or link history/management features.
- No analytics, link customization (custom aliases, expiration, QR codes, etc.) — out of scope for this page.

## User Stories

- As a visitor, I want to see immediately what this product does, so I understand I can shorten a URL here.
- As a visitor, I want a single, obvious place to paste a long URL, so I don't have to hunt for the right
  input.
- As a visitor, I want clear feedback if I try to submit something that isn't a valid URL, so I know how to
  fix my input.
- As a visitor on my phone, I want the page to be just as usable as on desktop, so I can shorten links on
  the go.

## Functional Requirements

- The page displays a logo or brand mark for the product near the top of the page.
- The page displays a single text input intended for pasting/typing a URL to be shortened.
- The page displays a clear call-to-action (e.g. a submit/shorten action) associated with the input.
- Basic client-side input validation gives the visitor feedback when the entered value is empty or is not
  a plausible URL, before any submission is attempted.
- Submitting a valid-looking URL does not need to result in a real short link; a placeholder interaction
  (e.g. a disabled/no-op action or a visible note that shortening isn't live yet) is acceptable for this
  phase.
- The page contains no other major sections (no navigation bar, footer links, marketing sections, etc.)
  beyond what's needed to present the logo, input, and call-to-action — the page should read as small and
  lean, not as a full marketing homepage.

## UI/UX Requirements

- Layout should be compact and centered, avoiding large amounts of empty chrome or unrelated sections.
- The logo and input should be the clear visual focus of the page.
- The page should be legible and usable across common desktop and mobile viewport widths.
- Visual style should be clean and modern, consistent with a lightweight utility tool rather than a heavy
  marketing site.
- Interactive elements (input, button) should have clear focus/hover/disabled states so the page feels
  polished even without live backend behavior.

## Open Questions

- Is there an existing logo/brand asset to use, or should a placeholder text-based logo be used for now? Please use a text based logo
- Should the page support a light/dark theme toggle at this stage, or is a single default theme sufficient? A dark theme is sufficient
- Is there a preferred product name/tagline to display alongside the logo? No need a name or tagline

## Future Work

- Wire the submit action to a real backend endpoint that generates and returns a short link.
- Display the generated short link to the visitor (e.g. inline result, copy-to-clipboard action).
- Add error handling for backend failures (invalid URL rejected server-side, rate limiting, etc.).
- Consider link history, custom aliases, or account-based features in later iterations.
