import { describe, expect, it } from 'vitest';

import { buildCorsHeaders, preflightResponse } from '@lib/http';

const requestWithOrigin = (origin?: string) =>
  new Request('https://qr.example.com/api/qr/generate', {
    headers: origin ? { Origin: origin } : {},
  });

describe('buildCorsHeaders', () => {
  const env = (allowed: string) => ({ ALLOWED_ORIGINS: allowed }) as Env;

  it('always sets methods, headers, max-age and Vary', () => {
    const headers = buildCorsHeaders(requestWithOrigin(), env(''), 'POST, OPTIONS');

    expect(headers['Access-Control-Allow-Methods']).toBe('POST, OPTIONS');
    expect(headers['Access-Control-Allow-Headers']).toBe('Content-Type');
    expect(headers['Access-Control-Max-Age']).toBe('86400');
    expect(headers['Vary']).toBe('Origin');
  });

  it('omits Allow-Origin for same-origin requests (no Origin header)', () => {
    const headers = buildCorsHeaders(
      requestWithOrigin(),
      env('https://qr.example.com'),
      'POST, OPTIONS',
    );
    expect(headers['Access-Control-Allow-Origin']).toBeUndefined();
  });

  it('reflects the Origin when it is in the allowlist', () => {
    const headers = buildCorsHeaders(
      requestWithOrigin('https://qr.example.com'),
      env('https://other.example,https://qr.example.com'),
      'POST, OPTIONS',
    );
    expect(headers['Access-Control-Allow-Origin']).toBe('https://qr.example.com');
  });

  it('omits Allow-Origin when the Origin is not allowed', () => {
    const headers = buildCorsHeaders(
      requestWithOrigin('https://evil.example'),
      env('https://qr.example.com'),
      'POST, OPTIONS',
    );
    expect(headers['Access-Control-Allow-Origin']).toBeUndefined();
  });

  it('trims and ignores empty entries in the allowlist', () => {
    const headers = buildCorsHeaders(
      requestWithOrigin('https://qr.example.com'),
      env(' https://qr.example.com , '),
      'POST, OPTIONS',
    );
    expect(headers['Access-Control-Allow-Origin']).toBe('https://qr.example.com');
  });
});

describe('preflightResponse', () => {
  it('returns a 204 with the given headers', () => {
    const headers = { Vary: 'Origin' };
    const response = preflightResponse(headers);

    expect(response.status).toBe(204);
    expect(response.headers.get('Vary')).toBe('Origin');
  });
});
