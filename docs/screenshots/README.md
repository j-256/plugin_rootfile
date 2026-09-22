# Project cover

The cover renders `aliases-example.json` and `cartridge/controllers/Static.js` directly from the checked-out source. It is a source illustration, not a storefront capture. Capture fails when the source no longer fits the framing.

```sh
npm ci
npx playwright install chromium
npm run capture:cover
```

The Node dependencies are development tools only; the cartridge has no added runtime dependency. Chromium captures the source at 1440 x 900 without network access.

CI regenerates this image from source after verification, uploads it for review, and commits a changed `docs/screenshots/cover.png` on `main`. Pull requests only produce the review artifact. The weekly schedule and manual CI dispatch can refresh the image without an application change. A superseded build does not overwrite a newer source commit.

The project cover is rendered at 4x pixel density while preserving its logical viewport, so enlarged previews retain more detail. Higher density does not increase the displayed text size; use zoom to inspect small labels.
