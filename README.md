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
pnpm functions
pnpm publish
```

## Technologies Used

- **Node.js v20:** Platform for JavaScript execution.
- **pnpm:** Package manager for Node.js.
- **Astro 4:** Web framework.
- **Cloudflare:** SSR adapter used with Cloudflare Pages functions.

## Functions

The project integrates functions for generating QR codes through specific endpoints located in the functions/api directory.

### `generate-qr.js`

This file encompasses two functions:

#### `onRequestOptions()`

This function configures necessary headers to allow requests from any origin and enables both POST and OPTIONS methods.

#### `onRequestPost(context)`

Responsible for generating a QR code from a URL provided in the request body. It leverages the qrcode library to craft the QR code image in SVG format, using customizable colors (dark and light). Subsequently, it returns the image as a response with the content type image/svg+xml.

```javascript
import QRCode from 'qrcode';

export async function onRequestOptions() {
  // Configuration of headers for OPTIONS requests
}

export async function onRequestPost(context) {
  // Handling POST requests to generate QR codes
}
```

These functions are designed to accommodate CORS requests, thereby permitting access from any origin.
