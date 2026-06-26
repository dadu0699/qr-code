# QR Code Generator

This project serves as a QR code generator specifically designed for URLs.

## Table of Contents

- [Installation and Scripts](#installation-and-scripts)
- [Technologies Used](#technologies-used)
- [Server Functions](#server-functions)

## Installation and Scripts

To install the required dependencies, use the command `pnpm install`.

### Available Scripts

Below are the available scripts for this project:

- **dev / start:** Initializes the application's development environment.
- **build:** Type-checks and generates a production-ready version of the application.
- **preview:** Builds the application and serves it locally with Wrangler.
- **publish:** Builds the application and deploys it to Cloudflare with Wrangler.
- **format:** Formats the codebase with Prettier.
- **astro / wrangler:** Pass-through commands for the Astro and Wrangler CLIs.

```bash
# Install dependencies
pnpm install

# Available scripts
pnpm dev
pnpm build
pnpm preview
pnpm publish
pnpm format
```

## Technologies Used

- **Node.js v24:** Platform for JavaScript execution.
- **pnpm:** Package manager for Node.js.
- **Astro 6:** Web framework.
- **Cloudflare Workers:** SSR runtime, via the `@astrojs/cloudflare` adapter.

## Configuration

| Variable          | Description                                                                                 |
| ----------------- | ------------------------------------------------------------------------------------------- |
| `ALLOWED_ORIGINS` | Comma-separated origins allowed to call the API cross-origin. Empty means same-origin only. |

Defined in `wrangler.jsonc` (`vars`); override per environment as needed.

## Server Functions

The project utilizes Astro Server Endpoints (API Routes) for handling server-side operations. The endpoint for generating QR codes is located at `src/pages/api/qr/generate.ts`.

### `generate.ts`

This file handles the generation of QR codes from a provided URL using the `qrcode` library. It responds with an SVG image of the QR code and supports CORS requests.
