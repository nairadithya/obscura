# Obscura test hardening

## Active run

1. Reproduce it yourself on the matching surface through the project's verification skill or harness (Non-negotiables), even when a debug or instrumentation protocol says to ask the user to reproduce. Ask the user only with a stated, specific reason the control surface cannot reach the target, and only after driving it as far as it goes. If it won't reproduce directly, synthesize the trigger, tighten conditions, or instrument until it fires.
2. Binary-search the cause. Form the candidate hypotheses, then rule them out until one survives. Seed them with `how` over the affected subsystem and the **why** skill for regression history. Each pass, take the split that cuts the most remaining problem space, get runtime evidence, eliminate. When program state is unclear, add instrumentation or logging and read it as the code runs. Don't guess. For a long-running recurring check the user explicitly requested, use a `pi-subagents` scheduled workflow. For one bug hunt, keep driving the evidence-based loop in the current session. Confirm the surviving *mechanism* with runtime evidence before the step-3 architect/interrogate fan-out.
3. Plan the fix. If it crosses a function boundary, `architect` first. Delegate implementation to a subagent using the configured `worker` agent (`openai-codex/gpt-6-luna` at medium thinking by default) with a specific scope.
4. Verify on the same surface. The original repro now passes. "Inconclusive" or wrong-surface is not a pass. Unit tests show branch behavior, not bug absence.
5. Stage the commits so the failing repro lands before the fix in git history. See the **tdd** skill for the failing-test-first cadence when the bug has a cheap local test path. Skip it when the test would be expensive, integration-heavy, or unclear.
   skip: The user asked not to commit changes.
6. Run **Opening a PR**.
   skip: The user asked not to commit or push changes, so no PR was opened.

## Prototype

1. Scope the decision the prototype exists to make: which layout, which interaction, which density, or for an empirical fork which behavior, timing, or approach. No decision means no prototype. Route to Feature.
2. Gather references when the design space is open. Search for prior art, summarize a moodboard of themes, palettes, and layouts, let the user pick directions before building. Skip when the direction is set.
3. Build throwaway in an isolated scratch dir, separate from production source. For a visual decision, vanilla HTML/CSS/JS or the lightest stack that renders the idea, CDN deps, a dev server with hot reload. For a behavioral or timing decision, the smallest script that exercises the question. No production framework, no tests, no abstractions.
4. When comparing alternatives, build them behind one switcher (buttons or a keypress), each variant labeled. This is the **exhaust-the-design-space** principle made cheap.
5. Verify on the matching surface. For a visual decision, screenshot each variant through the project's verification skill or harness and drive the interaction. For a behavioral or timing decision, observe the thing you are deciding by logging the timing, printing the output, or watching the render. The observation is the test here, not an assertion.
6. Present alternatives, tradeoffs, and a recommendation. The output is the decision plus the throwaway artifact, not shippable code. Hand the chosen direction to **Feature** (or `architect` for the shape) for the real build. Say plainly that the prototype is throwaway.

## Throughput checkpoint

- **Blocking first steps.** Reproduce the compile, unit, and browser failures, then confirm the installed browsers.
- **Independent workstreams.** Chromium and Firefox loading paths were investigated separately. One owner integrated their fixtures and assertions.
- **Shared mutable state.** Browser launch code, scripts, and lockfile changes shared files, so one writer integrated them.
- **Smallest safe decomposition.** One worker owned the integrated harness because its browser-specific launch paths share a fixture and test contract.

## Design decision

Playwright's persistent context loads the built Chromium extension in Playwright's bundled Chromium. Selenium WebDriver installs the built Firefox extension temporarily through GeckoDriver. Playwright's Firefox connection endpoint cannot attach to web-ext's Firefox debugging protocol. Both tests load production manifests and bundles. Their fixtures use the Instagram origin so production host matches and navigation filters stay unchanged.

The design uses two browser drivers because Playwright supports extension loading through Chromium but not Firefox. It avoids test-only host overrides that would change URL handling and permission behavior. The Firefox test profile disables the HSTS preload list so its HTTP proxy serves deterministic fixture HTML instead of upgrading to the live site.

## Completed

- [x] Added Vitest, happy-dom, shared browser mocks, unit tests, and pure URL and DOM modules.
- [x] Fixed TypeScript errors and replaced the URL-length redirect test with path-segment matching.
- [x] Fixed initial page scanning so existing reel cards are hidden as well as dynamically added cards.
- [x] Added a real welcome page and registered the fresh-install listener in the background entry point.
- [x] Loaded the production extension in Playwright Chromium and Selenium Firefox against deterministic fixture content.
- [x] Added a repeatable `bun run test:e2e` command.

## Remaining issues

- [ ] Replace Instagram's generated `x1lliihq` reel-card class only after a robust selector is verified against the current Instagram DOM.
- [ ] Run the unit, type, production-build, and two-browser checks in GitHub Actions.

## Deferred features

- [ ] Add an options page for user-selected blockers.
- [ ] Track usage statistics.
- [ ] Add CSS-variable theming.
