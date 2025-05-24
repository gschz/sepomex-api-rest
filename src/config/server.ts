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
   nodeEnv: NODE_ENV,
   security: { cors: CORS_CONFIG },
} = config;

export function configureServer(app: Elysia): void {
   app.use(helmet());
   app.use(cors(CORS_CONFIG));
   app.use(setupRateLimit());
}
