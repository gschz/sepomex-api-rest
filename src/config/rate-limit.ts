/**
 * rate-limit.ts
 * configuración del rate limit para la API usando elysia-rate-limit
 */

import { rateLimit } from 'elysia-rate-limit';
import config from './config';

const {
   security: { rateLimit: MAX_REQUESTS, rateLimitWindow: WINDOW_MS },
} = config;

export function setupRateLimit() {
   return rateLimit({
      max: MAX_REQUESTS,
      duration: WINDOW_MS,
      errorResponse: new Response(
         JSON.stringify({
            status: 429,
            message: 'Demasiadas peticiones, por favor intente más tarde',
         }),
         {
            status: 429,
            headers: { 'Content-Type': 'application/json' },
         },
      ),
   });
}
