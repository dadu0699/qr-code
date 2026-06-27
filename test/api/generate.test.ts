import type { APIContext } from 'astro';

import { describe, expect, it } from 'vitest';

import { OPTIONS, POST } from '../../src/pages/api/qr/generate';

const context = (request: Request) => ({ request }) as unknown as APIContext;

const postRaw = (body: string) =>
  context(
    new Request('https://qr.example.com/api/qr/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    }),
  );

const postJson = (data: unknown) => postRaw(JSON.stringify(data));

const errorMessage = async (response: Response) =>
  ((await response.json()) as { error: string }).error;

describe('POST /api/qr/generate — validation', () => {
  it('rejects a non-JSON body', async () => {
    const response = await POST(postRaw('not json'));
    expect(response.status).toBe(400);
    expect(await errorMessage(response)).toBe('Invalid JSON body');
  });

  it('rejects a non-object body', async () => {
    const response = await POST(postJson(42));
    expect(response.status).toBe(400);
    expect(await errorMessage(response)).toBe('Invalid request body');
  });

  it('rejects a missing url', async () => {
    const response = await POST(postJson({}));
    expect(response.status).toBe(400);
    expect(await errorMessage(response)).toBe('URL is required');
  });

  it('rejects a url over the maximum length', async () => {
    const response = await POST(postJson({ url: `https://e.com/${'a'.repeat(2050)}` }));
    expect(response.status).toBe(400);
  });

  it('rejects a malformed url', async () => {
    const response = await POST(postJson({ url: 'not a url' }));
    expect(response.status).toBe(400);
    expect(await errorMessage(response)).toBe('Invalid URL');
  });

  it('rejects a non-http(s) protocol', async () => {
    const response = await POST(postJson({ url: 'ftp://example.com' }));
    expect(response.status).toBe(400);
    expect(await errorMessage(response)).toBe('URL protocol must be http or https');
  });

  it('rejects a non-object color', async () => {
    const response = await POST(postJson({ url: 'https://astro.build', color: 'red' }));
    expect(response.status).toBe(400);
    expect(await errorMessage(response)).toBe('Invalid color');
  });

  it('rejects an invalid hex color', async () => {
    const response = await POST(postJson({ url: 'https://astro.build', color: { dark: 'rojo' } }));
    expect(response.status).toBe(400);
    expect(await errorMessage(response)).toBe('Invalid dark color');
  });
});

describe('POST /api/qr/generate — success', () => {
  it('returns an SVG for a valid url', async () => {
    const response = await POST(postJson({ url: 'https://astro.build' }));
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('image/svg+xml');
    expect(await response.text()).toContain('<svg');
  });

  it('applies the conventional dark-on-light default when no color is given', async () => {
    const response = await POST(postJson({ url: 'https://astro.build' }));
    expect((await response.text()).toLowerCase()).toContain('#000000');
  });

  it('accepts a valid custom hex color', async () => {
    const response = await POST(
      postJson({ url: 'https://astro.build', color: { dark: '#123', light: '#ffffff' } }),
    );
    expect(response.status).toBe(200);
  });
});

describe('OPTIONS /api/qr/generate', () => {
  it('responds to the preflight with 204', async () => {
    const request = new Request('https://qr.example.com/api/qr/generate', { method: 'OPTIONS' });
    const response = await OPTIONS(context(request));
    expect(response.status).toBe(204);
    expect(response.headers.get('Access-Control-Allow-Methods')).toBe('POST, OPTIONS');
  });
});
