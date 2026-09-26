# Reviewer Reproducibility
1. Run `npm test` from the package root.
2. Verify the explicit as-of fixture and boundary cases: past, 0, 7, 8, 30, 31, 60, 61 days; blank, malformed, impossible dates; leap-day handling.
3. Inspect `logic.mjs` and confirm the state thresholds match `METHODOLOGY.md`.
4. Inspect CSV output logic and verify formula-leading text is neutralized, quotes/newlines escape correctly, and REVIEW rows remain exportable.
5. Serve the folder from a local static HTTP server and verify the app loads with no required external runtime service.