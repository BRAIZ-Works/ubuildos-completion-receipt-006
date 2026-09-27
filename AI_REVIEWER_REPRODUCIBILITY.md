# Reviewer Reproducibility
This public repository is the Day-05 publication projection. It intentionally does not duplicate the frozen product test package.

1. Verify the repository's `SHA256SUMS.txt` against the bounded files represented by `PUBLIC_MANIFEST.json`.
2. Inspect `logic.mjs` and confirm the state thresholds match `METHODOLOGY.md`: OVERDUE (<0), DUE_7 (0–7), DUE_30 (8–30), DUE_60 (31–60), LATER (>60), REVIEW (missing/invalid).
3. Open the public app and verify the visible synthetic records cover overdue, 7-day, 30-day, 60-day, later, and review states.
4. Change the explicit as-of date and confirm visible state changes follow the documented thresholds without guessing missing dates.
5. Export CSV and verify the visible source/computed fields are present and formula-leading text is neutralized.
6. Confirm the app loads with no required external runtime service.

The frozen product test suite and prior Fresh Independent QA evidence are preserved separately from this public projection; this document does not represent the public repository as the product-IQA package.