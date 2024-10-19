import type { APIRoute } from 'astro';

import QRCode from 'qrcode';

// Outputs: /api/qr/generate
export const POST: APIRoute = async ({ request }) => {
  const { url } = await request.json();

  const qrImage = await QRCode.toString(url, {
    type: 'svg',
    color: {
      dark: '#FFFFFF',
      light: '#3685FF',
    },
  });

  return new Response(qrImage, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml',
      'Access-Control-Allow-Origin': 'self',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Max-Age': '86400',
    },
  });
};
