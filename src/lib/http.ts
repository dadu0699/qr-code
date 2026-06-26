const CORS_MAX_AGE = '86400';

/**
 * Builds CORS headers for a response, reflecting the request `Origin` only when
 * it is present in the `ALLOWED_ORIGINS` allowlist. When the origin is missing
 * (same-origin requests) or not allowed, `Access-Control-Allow-Origin` is
 * omitted so the browser blocks cross-origin access by default.
 *
 * `Vary: Origin` is always set to prevent caches from serving the headers of
 * one origin to another.
 */
export const buildCorsHeaders = (
  request: Request,
  env: Env,
  methods: string,
): Record<string, string> => {
  const allowedOrigins = (env.ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': methods,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': CORS_MAX_AGE,
    Vary: 'Origin',
  };

  const origin = request.headers.get('Origin');
  if (origin && allowedOrigins.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  }

  return headers;
};

/** Standard CORS preflight response (204 No Content) using the given headers. */
export const preflightResponse = (corsHeaders: Record<string, string>): Response =>
  new Response(null, { status: 204, headers: corsHeaders });
