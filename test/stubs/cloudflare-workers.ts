// Stand-in for the `cloudflare:workers` virtual module under Node test runs.
// The object is mutable so individual tests can adjust `ALLOWED_ORIGINS`.
export const env: { ALLOWED_ORIGINS: string } = { ALLOWED_ORIGINS: '' };
