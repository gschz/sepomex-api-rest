/**
 * E2E smoke tests for the SEPOMEX API REST.
 *
 * Requires:
 * - A running server (default: http://localhost:3000) — `bun run dev`
 * - A seeded database (schema + functions + views + data, and
 *   `REFRESH MATERIALIZED VIEW vm_codigos_postales`)
 *
 * Run: BASE_URL=http://localhost:3000/api/v2 bun test
 */

import { describe, expect, test } from 'bun:test';

const BASE = process.env.BASE_URL ?? 'http://localhost:3000/api/v2';

interface ApiEntry {
   codigo_postal?: string;
   nombre_estado?: string;
   nombre_ciudad?: string;
}

interface ApiResponse {
   success?: boolean;
   message?: string;
   data?: ApiEntry[] | ApiEntry | null;
}

async function get(path: string) {
   const res = await fetch(`${BASE}${path}`);
   const body = (await res.json()) as ApiResponse;
   return { status: res.status, body };
}

/** Casts the response data as an array (list endpoints). */
function entries(body: ApiResponse): ApiEntry[] {
   return (body.data as ApiEntry[] | null) ?? [];
}

describe('GET /states', () => {
   test('lists all 32 states', async () => {
      const { status, body } = await get('/states/');
      expect(status).toBe(200);
      expect(body.success).toBe(true);
      expect(entries(body)).toHaveLength(32);
   });

   test('returns a state by id', async () => {
      const { status, body } = await get('/states/09');
      expect(status).toBe(200);
      expect((body.data as ApiEntry | null)?.nombre_estado).toBe('Ciudad de México');
   });

   test('rejects a non-2-digit id', async () => {
      const { status } = await get('/states/9');
      expect(status).toBeGreaterThanOrEqual(400);
   });

   test('lists cities, municipios and asentamientos of a state', async () => {
      for (const path of ['/states/09/cities', '/states/09/municipios', '/states/09/asentamientos']) {
         const { status, body } = await get(path);
         expect(status).toBe(200);
         expect(entries(body).length).toBeGreaterThan(0);
      }
   });
});

describe('GET /cities', () => {
   test('lists all cities', async () => {
      const { status, body } = await get('/cities/');
      expect(status).toBe(200);
      expect(entries(body).length).toBeGreaterThan(600);
   });

   test('returns city by estado+ciudad', async () => {
      const { status, body } = await get('/cities/09/01');
      expect(status).toBe(200);
      expect((body.data as ApiEntry | null)?.nombre_ciudad).toBe('Ciudad de México');
   });

   test('lists colonias and postal codes of a city', async () => {
      for (const path of ['/cities/09/01/colonias', '/cities/09/01/codigos']) {
         const { status, body } = await get(path);
         expect(status).toBe(200);
         expect(entries(body).length).toBeGreaterThan(0);
      }
   });
});

describe('GET /postal', () => {
   test('searches settlements by name', async () => {
      const { status, body } = await get('/postal/search?q=centro');
      expect(status).toBe(200);
      expect(body.success).toBe(true);
      expect(entries(body).length).toBeGreaterThan(0);
   });

   test('returns a settlement by postal code', async () => {
      const { status, body } = await get('/postal/codigo/01000');
      expect(status).toBe(200);
      expect(entries(body)).toHaveLength(1);
      expect(entries(body)[0]?.codigo_postal).toBe('01000');
   });

   test('returns empty data for an unknown postal code', async () => {
      const { status, body } = await get('/postal/codigo/99999');
      expect(status).toBe(200);
      expect(entries(body)).toEqual([]);
   });

   test('filters by state, municipio and ciudad', async () => {
      for (const path of ['/postal/estado/09', '/postal/municipio/09/010', '/postal/ciudad/09/01']) {
         const { status, body } = await get(path);
         expect(status).toBe(200);
         expect(entries(body).length).toBeGreaterThan(0);
      }
   });

   test('rejects non-numeric postal code with 4xx', async () => {
      const { status } = await get('/postal/codigo/abc');
      expect(status).toBeGreaterThanOrEqual(400);
   });
});

describe('OpenAPI docs', () => {
   test('serves the Scalar UI and the JSON spec', async () => {
      const html = await fetch(`${BASE}/openapi`);
      expect(html.status).toBe(200);
      expect(await html.text()).toContain('api-reference');

      const spec = await fetch(`${BASE}/openapi/json`);
      expect(spec.status).toBe(200);
      const json = (await spec.json()) as { openapi: string; info?: { title?: string } };
      expect(json.openapi).toBe('3.0.3');
      expect(json.info?.title).toBe('SEPOMEX API REST');
   });
});
