/**
 * server.config.ts
 * Configuración del servidor Elysia que incluye:
 * - Seguridad
 * - CORS
 * - Rate limiting
 */

import { cors } from '@elysiajs/cors';
import type { Elysia } from 'elysia';
import { helmet } from 'elysia-helmet';
import config from './config';
import { setupRateLimit } from './rate-limit';

const {
   security: { cors: CORS_CONFIG },
} = config;

export function configureServer(app: Elysia): void {
   app.use(
      helmet({
         contentSecurityPolicy: {
            directives: {
               // Scalar docs UI at /openapi loads its bundle from jsdelivr and
               // boots via an inline script; the helmet default (script-src 'self')
               // blocks both. Rest of the CSP stays at helmet defaults.
               scriptSrc: ["'self'", 'https://cdn.jsdelivr.net', "'unsafe-inline'"],
               // Scalar UI queries its integrations registry from api.scalar.com
               connectSrc: ["'self'", 'https://api.scalar.com', 'https://cdn.jsdelivr.net'],
            },
         },
      }),
   );
   app.use(cors(CORS_CONFIG));
   app.use(setupRateLimit());
}
