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

// Outputs: /api/qr/generate
export const POST: APIRoute = async ({ request }) => {
  const { url, color } = (await request.json()) as QRCodeRequest;

  if (!url) {
    return new Response(JSON.stringify({ error: 'URL is required' }), {
      status: 400,
      headers: {
        ...commonHeaders,
        'Content-Type': 'application/json',
      },
    });
  }

  const parsedColor = {
    dark: color?.dark || defaultColor.dark,
    light: color?.light || defaultColor.light,
  };

  const qrImage = await QRCode.toString(url, { type: 'svg', color: parsedColor });

  return new Response(qrImage, {
    status: 200,
    headers: {
      ...commonHeaders,
      'Content-Type': 'image/svg+xml',
    },
  });
};
