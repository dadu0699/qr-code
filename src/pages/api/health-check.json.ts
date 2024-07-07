import type { APIRoute } from 'astro';

// Outputs: /api/health-check.json
export const GET: APIRoute = async ({ params, request }) => {
  return new Response(
    JSON.stringify({ response: 'Service running smoothly' }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Max-Age': '86400',
      },
    }
  );
};
