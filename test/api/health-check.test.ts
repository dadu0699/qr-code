import type { APIContext } from 'astro';

import { describe, expect, it } from 'vitest';

import { GET, OPTIONS } from '../../src/pages/api/health-check.json';

const context = (method: string) =>
  ({
    request: new Request('https://qr.example.com/api/health-check.json', { method }),
  }) as unknown as APIContext;

describe('GET /api/health-check.json', () => {
  it('reports the service as running', async () => {
    const response = await GET(context('GET'));
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/json');
    expect(await response.json()).toEqual({ response: 'Service running smoothly' });
  });

  it('responds to the preflight with 204', async () => {
    const response = await OPTIONS(context('OPTIONS'));
    expect(response.status).toBe(204);
    expect(response.headers.get('Access-Control-Allow-Methods')).toBe('GET, OPTIONS');
  });
});
