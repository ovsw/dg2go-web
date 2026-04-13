# DG2GO Web

Static marketing and ordering site built with Eleventy 0.11, Nunjucks, and Gulp. Source content lives in `src/`; `dist/` and `src/_includes/css/` are generated output.

## Requirements

- Node `20.19.0` (see `.nvmrc`)
- npm

## Setup

1. Use the pinned Node version: `nvm use`
2. Install dependencies: `npm install`
3. Create a local env file if needed: `cp .env.example .env.development`

## Environment Variables

- `SANITY_PROJECT_ID`
  Defaults to `y6e2eewm` when unset.
- `SANITY_DATASET`
  Defaults to `production` when unset.
- `SANITY_READ_TOKEN`
  Optional. When present, collections that call `overlayDrafts(...)` will overlay draft Sanity documents during builds.
- `FOXYCART_API_KEY`
  Required for valid signed FoxyCart ordering links.

Environment is loaded from `.env.${NODE_ENV || "development"}` in `src/utils/sanityClient.js`.

## Scripts

- `npm start`
  Runs Gulp once, then starts `gulp watch` and `eleventy --serve`.
- `npm run build`
  Runs the production Gulp build and a production Eleventy build.
- `npm run lint`
  Runs the current JavaScript lint baseline across build scripts and source utilities.
- `npm run check`
  Runs lint plus a production build.

## Project Notes

- Treat `src/**` as the source of truth. Do not edit generated files in `dist/` or `src/_includes/css/`.
- If you add a stylesheet that must be inlined with `{% include "css/*.css" %}`, add it to `criticalStyles` in `gulp-tasks/sass.js`.
- Hidden internal routes such as `/specials-83290eh87d3e9023hu9d/` and `/on-the-road-43985436457/` are intentional and should not be renamed casually.
- FoxyCart ordering links depend on the `foxyEncrypt` shortcode in `.eleventy.js` and `FOXYCART_API_KEY`.
