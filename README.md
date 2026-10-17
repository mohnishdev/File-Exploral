# Image Converter

An SEO-first collection of free online image and PDF utilities. The project has no authentication, database, or permanent file storage. Image operations, PDF tools, and PNG vectorization run locally in the browser.

## Requirements

- Node.js 20+
- npm

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Validation

```bash
npm run lint
npm run build
```

## Configuration

Set `NEXT_PUBLIC_SITE_URL` to the canonical origin before deploying so metadata, robots.txt, and sitemap.xml point to the production domain. The fallback domain is a reserved `.example` placeholder.

Set `CONTACT_EMAIL` to the support address before launch. AdSense is disabled by default: reserved placements remain visible until `NEXT_PUBLIC_ADSENSE_ENABLED=true`, a valid `NEXT_PUBLIC_ADSENSE_CLIENT_ID` (`ca-pub-...`), and numeric slot IDs are configured. Set slot IDs with `NEXT_PUBLIC_ADSENSE_SLOT_TOP`, `NEXT_PUBLIC_ADSENSE_SLOT_MIDDLE`, `NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM`, and `NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR`.

Before enabling ads, the site must be approved in AdSense, the appropriate Google Privacy & Messaging consent message must be configured and published for applicable regions, and the deployed consent and withdrawal experience must be verified. The `/ads.txt` route emits Google's seller record only when a valid publisher ID is configured; it returns 404 otherwise. Do not use a sample publisher ID or enable ads before consent setup is ready. The production domain remains a manual launch configuration.

## Project structure

- `app/` contains the homepage, `/image-tools` and `/pdf-tools` category hubs, canonical tool routes, guides, 404, robots, and sitemap. Previous `/tools/<slug>` URLs permanently redirect to the canonical category route.
- `components/layout/` contains the shared brand, responsive header, navigation, and footer.
- `components/tools/` contains reusable tool UI and isolated browser image/PDF workspaces.
- `components/ads/` contains reserved ad placements and opt-in AdSense integration; ads and the network script remain disabled until valid deployment configuration is supplied.
- `lib/tools.ts` is the shared source of tool descriptions, formats, FAQs, and related links.
- `lib/seo/` centralizes canonical routes, tool-specific metadata/content, social metadata, and structured data. Set `NEXT_PUBLIC_SITE_URL` to the production origin before deployment; Vercel's production URL is used when available, otherwise canonical tags use the reserved `.example` fallback.
- `lib/seo/tool-pages.ts` holds tool-specific search snippets, usage guidance, limitations, and FAQs; canonical tool routes are generated from the shared catalog and included in `app/sitemap.ts`.
- `lib/image/` contains reusable Canvas-based conversion, resize, compression, crop, rotate, and image-validation helpers.
- `lib/vectorize/` contains the browser-side PNG preprocessing, ImageTracerJS worker adapter, and generated-SVG sanitizer/optimizer. Generated paths are grouped by adjacent fill color, redundant path styling is removed, and coordinates are rounded to a practical precision to reduce SVG size. The PNG-to-SVG workspace defaults to a color-preserving, high-detail logo preset; signature artwork can use adaptive monochrome thresholding. Optional background removal detects flat backgrounds even when a transparent border surrounds them. Vectorization remains an approximation best suited to logos, icons, signatures, line art, and flat illustrations. Photographs and gradients are simplified and may create large SVG files.
- `lib/pdf/` contains local PDF.js rendering and pdf-lib manipulation for page editing, merge, split, structural repacking, PDF/image conversion, and image-to-PDF.
- `lib/processing/` defines browser and temporary-server processing contracts. No processing backend is implemented; the temporary processor contract always attempts cleanup and surfaces cleanup failures.
- `lib/validation/` contains general reusable file validation.

## Tool availability

Image and PDF tools process selected files locally in the browser; no upload endpoint or persistent file storage is used. PNG-to-SVG uses the open-source, Unlicense ImageTracerJS engine in a Web Worker and outputs sanitized vector paths rather than embedding the PNG. It is an approximation, not a perfect conversion, and is not optimized for photographic images. PDF structural repacking does not downsample/recompress embedded images and cannot guarantee a smaller file.
