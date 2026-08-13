/**
 * Enrutador principal que combina todas las rutas de la API.
 * @module IndexRoutes
 */

import config from '@/config/config';
import { Elysia } from 'elysia';

import citiesRoutes from './cities.routes';
import postalRoutes from './postal.routes';
import statesRoutes from './states.routes';

const routes = new Elysia({ prefix: '/api/v2' });

const {
   apiUrl: API_URL,
   nodeEnv: NODE_ENV,
   security: { rateLimit: RATE_LIMIT, rateLimitWindow: RATE_LIMIT_WINDOW }, // Aunque rateLimit y rateLimitWindow se configuran globalmente, se mantienen aquí para la documentación del endpoint raíz
} = config;

// Montar los enrutadores de Elysia
routes.use(postalRoutes);
routes.use(statesRoutes);
routes.use(citiesRoutes);

/**
 * GET /
 * Endpoint raíz de la API que proporciona información general sobre la API y sus puntos finales.
 */
routes.get('/', () => {
   const apiInfo = {
      name: 'API SEPOMEX',
      description: 'API REST para consulta de códigos postales de México',
      version: '2.0.0',
      status: NODE_ENV,
      baseUrl: API_URL,
      documentation: `${API_URL}/openapi`,
      rateLimit: {
         requests: RATE_LIMIT,
         windowMs: `${RATE_LIMIT_WINDOW / 60000} minutos`,
      },
      endpoints: {
         postal: {
            base: '/postal',
            examples: ['/postal/codigo/45050', '/postal/search?q=centro'],
         },
         states: {
            base: '/states',
            examples: ['/states/14', '/states/14/cities'],
         },
         cities: {
            base: '/cities',
            examples: ['/cities/14/001', '/cities/14/001/colonias'],
         },
      },
   };

   return apiInfo;
});

export default routes;
