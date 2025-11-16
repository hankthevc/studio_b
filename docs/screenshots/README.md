# Screenshot Placeholders

Phase 2 requires every app README to include a screenshot or Loom reference. Until real captures are produced, we store deterministic SVG placeholders in this directory. The `scripts/phase2_refresh_readmes.mjs` utility will auto-generate simple gradient cards per slug and keep them up to date whenever new apps land.

## Workflow
1. Run `node scripts/phase2_refresh_readmes.mjs` to refresh README sections and add any missing SVGs.
2. Replace a placeholder with a real capture by dropping a PNG/JPEG (same filename as the slug) once the app has polished visuals. The script will skip existing non-SVG assets.
3. Reference the image in each README using `![Slug screenshot](../../docs/screenshots/<slug>.svg)` so partners can preview the layout quickly.

All SVGs are intentionally lightweight (<2 KB) so they load instantly in GitHub READMEs and partner enablement docs.
