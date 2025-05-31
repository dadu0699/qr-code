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

- **dev:** Initializes the application's development environment.
- **build:** Generates a production-ready version of the application.
- **preview:** Previews the application within a development environment.
- **astro:** A command associated with the Astro framework.
- **functions:** Executes wrangler for pages in development mode.
- **publish:** Builds the application and deploys the pages using wrangler.

```bash
# Install dependencies
pnpm install

# Available scripts
pnpm dev
pnpm build
pnpm preview
pnpm astro
pnpm publish
```

## Technologies Used

- **Node.js v22:** Platform for JavaScript execution.
- **pnpm:** Package manager for Node.js.
- **Astro 5:** Web framework.
- **Cloudflare:** SSR adapter used with Cloudflare Pages functions.

## Server Functions

The project utilizes Astro Server Endpoints (API Routes) for handling server-side operations. The endpoint for generating QR codes is located at `src/pages/api/qr/generate.ts`.

### `generate.ts`

This file handles the generation of QR codes from a provided URL using the `qrcode` library. It responds with an SVG image of the QR code and supports CORS requests.
