import type { APIRoute } from 'astro';

import { env } from 'cloudflare:workers';
import QRCode from 'qrcode';

import { buildCorsHeaders, preflightResponse } from '@lib/http';

interface QRCodeRequest {
  url: string;
  color?: {
    dark?: string;
    light?: string;
  };
}

const ALLOWED_METHODS = 'POST, OPTIONS';

// In the `qrcode` API, `dark` is the foreground (the modules) and `light` is
// the background. Default to conventional dark-on-light for maximum scanner
// compatibility; the UI overrides this with its own theme colors.
const defaultColor = {
  dark: '#000000',
  light: '#FFFFFF',
};

const MAX_URL_LENGTH = 2048;
const ALLOWED_PROTOCOLS = ['http:', 'https:'];
const HEX_COLOR_PATTERN = /^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

const isValidHexColor = (value: unknown): value is string =>
  typeof value === 'string' && HEX_COLOR_PATTERN.test(value);

// Outputs: /api/qr/generate
export const POST: APIRoute = async ({ request }) => {
  const cors = buildCorsHeaders(request, env, ALLOWED_METHODS);

  const error = (message: string, status: number) =>
    new Response(JSON.stringify({ error: message }), {
      status,
      headers: { ...cors, 'Content-Type': 'application/json' },
    });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return error('Invalid JSON body', 400);
  }

  if (typeof body !== 'object' || body === null) {
    return error('Invalid request body', 400);
  }

  const { url, color } = body as QRCodeRequest;

  if (typeof url !== 'string' || url.trim() === '') {
    return error('URL is required', 400);
  }

  if (url.length > MAX_URL_LENGTH) {
    return error(`URL exceeds maximum length of ${MAX_URL_LENGTH} characters`, 400);
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    return error('Invalid URL', 400);
  }

  if (!ALLOWED_PROTOCOLS.includes(parsedUrl.protocol)) {
    return error('URL protocol must be http or https', 400);
  }

  if (color !== undefined && (typeof color !== 'object' || color === null)) {
    return error('Invalid color', 400);
  }

  if (color?.dark !== undefined && !isValidHexColor(color.dark)) {
    return error('Invalid dark color', 400);
  }

  if (color?.light !== undefined && !isValidHexColor(color.light)) {
    return error('Invalid light color', 400);
  }

  const parsedColor = {
    dark: color?.dark || defaultColor.dark,
    light: color?.light || defaultColor.light,
  };

  let qrImage: string;
  try {
    qrImage = await QRCode.toString(url, { type: 'svg', color: parsedColor });
  } catch {
    return error('Failed to generate QR code', 500);
  }

  return new Response(qrImage, {
    status: 200,
    headers: { ...cors, 'Content-Type': 'image/svg+xml' },
  });
};

export const OPTIONS: APIRoute = ({ request }) =>
  preflightResponse(buildCorsHeaders(request, env, ALLOWED_METHODS));
