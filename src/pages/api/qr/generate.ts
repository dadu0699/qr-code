import type { APIRoute } from 'astro';

import QRCode from 'qrcode';

interface QRCodeRequest {
  url: string;
  color?: {
    dark?: string;
    light?: string;
  };
}

const commonHeaders = {
  'Access-Control-Allow-Origin': 'self',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

const defaultColor = {
  dark: '#FFFFFF',
  light: '#3685FF',
};

const MAX_URL_LENGTH = 2048;
const ALLOWED_PROTOCOLS = ['http:', 'https:'];
const HEX_COLOR_PATTERN = /^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

const jsonError = (message: string, status: number) =>
  new Response(JSON.stringify({ error: message }), {
    status,
    headers: {
      ...commonHeaders,
      'Content-Type': 'application/json',
    },
  });

const isValidHexColor = (value: unknown): value is string =>
  typeof value === 'string' && HEX_COLOR_PATTERN.test(value);

// Outputs: /api/qr/generate
export const POST: APIRoute = async ({ request }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError('Invalid JSON body', 400);
  }

  if (typeof body !== 'object' || body === null) {
    return jsonError('Invalid request body', 400);
  }

  const { url, color } = body as QRCodeRequest;

  if (typeof url !== 'string' || url.trim() === '') {
    return jsonError('URL is required', 400);
  }

  if (url.length > MAX_URL_LENGTH) {
    return jsonError(`URL exceeds maximum length of ${MAX_URL_LENGTH} characters`, 400);
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    return jsonError('Invalid URL', 400);
  }

  if (!ALLOWED_PROTOCOLS.includes(parsedUrl.protocol)) {
    return jsonError('URL protocol must be http or https', 400);
  }

  if (color !== undefined && (typeof color !== 'object' || color === null)) {
    return jsonError('Invalid color', 400);
  }

  if (color?.dark !== undefined && !isValidHexColor(color.dark)) {
    return jsonError('Invalid dark color', 400);
  }

  if (color?.light !== undefined && !isValidHexColor(color.light)) {
    return jsonError('Invalid light color', 400);
  }

  const parsedColor = {
    dark: color?.dark || defaultColor.dark,
    light: color?.light || defaultColor.light,
  };

  let qrImage: string;
  try {
    qrImage = await QRCode.toString(url, { type: 'svg', color: parsedColor });
  } catch {
    return jsonError('Failed to generate QR code', 500);
  }

  return new Response(qrImage, {
    status: 200,
    headers: {
      ...commonHeaders,
      'Content-Type': 'image/svg+xml',
    },
  });
};
