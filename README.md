# SARGARA Industrial — Website

Multilingual industrial website for **Ningbo Sargara New Materials Co., Ltd.**
The homepage covers custom precision components, industrial sourcing, MRO,
quality coordination and export consolidation.

## Run locally

```bash
npm start
```

The dependency-free Node server listens on `PORT` (default `3000`) and serves
the site root.

## Private access

The site opens behind the SARGARA access screen.

- Default phrase: `sargara2026`
- Change it with the `ACCESS_PASSWORD` environment variable
- Several phrases: `ACCESS_PASSWORDS=a,b,c`
- Session length: `ACCESS_DAYS` (default 30)
- Open the site temporarily: create `access.pause` and redeploy
- Lock it again: delete `access.pause`
- Emergency bypass: `PUBLIC=true`

The gate is enforced by `server.mjs`, so the site must be hosted on a Node
runtime — a plain static host cannot protect the pages behind it.

## Pages

- `index.html` — English homepage (site root)
- `en/` — complete English page tree (147 pages)
- `zh/` — complete Simplified Chinese tree (147 pages)
- `ko/` — complete Korean tree (147 pages)
- `fr/`, `es/`, `ru/`, `ar/`, `ja/` — additional language entry pages
- `assets/` — 242 locally hosted images and source styles

## Deploy

Upload the contents of this repository (or the release zip) to the site root and
start it with `npm start`. The archive in the GitHub release already has files at
the archive root, ready for the hosting platform's deploy upload.
