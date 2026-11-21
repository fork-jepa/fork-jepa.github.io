# Fork-JEPA project website

Anonymous research project page with an interactive gallery of recorded simulator executions, updated method diagrams, and quantitative results.

## Build and preview

Run `python3 scripts/build.py`, then serve the generated site with `python3 -m http.server 8000 --directory dist`.

The manuscript source PDF is intentionally excluded. Paper, Code, and Data & Checkpoints remain placeholders. Images under `static/images/paper/` contain only scientific artwork and no embedded author metadata. Quantitative results follow the updated manuscript; the existing gallery remains a collection of qualitative examples rather than a new evaluation.

Gallery source records are in `static/media/gallery/manifest.json`.
