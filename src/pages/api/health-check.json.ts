import type { APIRoute } from 'astro';

import { env } from 'cloudflare:workers';

import { buildCorsHeaders, preflightResponse } from '@lib/http';

const ALLOWED_METHODS = 'GET, OPTIONS';

// Outputs: /api/health-check.json
export const GET: APIRoute = ({ request }) => {
  const cors = buildCorsHeaders(request, env, ALLOWED_METHODS);

  return new Response(JSON.stringify({ response: 'Service running smoothly' }), {
    status: 200,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });
};

export const OPTIONS: APIRoute = ({ request }) =>
  preflightResponse(buildCorsHeaders(request, env, ALLOWED_METHODS));
