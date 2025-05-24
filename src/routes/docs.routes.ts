/**
 * Rutas para la documentación de la API.
 * Define el endpoint para acceder a la documentación generada.
 * @module DocsRoutes
 */

import * as docsController from '@/controllers/docs.controller';
import { Elysia } from 'elysia';

const docs = new Elysia({ prefix: '/docs' });

/**
 * GET /
 * Sirve la documentación de la API.
 */
docs.get('/', docsController.getApiDocs);

export default docs;
