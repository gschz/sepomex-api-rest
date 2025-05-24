/**
 * Rutas para el manejo de estados.
 * Define los endpoints relacionados con la consulta de estados y sus relaciones.
 * @module StatesRoutes
 */

import * as statesController from '@/controllers/states.controller';
import { Elysia, t } from 'elysia';

const states = new Elysia({ prefix: '/states' });

/**
 * Esquemas de validación para los parámetros de ruta utilizando TypeBox.
 */
const stateParamsSchema = t.Object({
   id: t.String({
      pattern: '^[0-9]{2}$',
      error: 'El código de estado debe ser un número de 2 dígitos',
   }),
});

/**
 * Define las rutas principales para la gestión de estados.
 */

/**
 * GET /states
 * Obtiene todos los estados.
 */
states.get('/', statesController.getAllStates);

/**
 * GET /states/:id
 * Obtiene un estado específico por su ID.
 *
 * @param params - Parámetro de ruta conteniendo `id` del estado.
 */
states.get('/:id', (context) => statesController.getStateById(context), {
   params: stateParamsSchema,
});

/**
 * Define las rutas para obtener relaciones de estados.
 */

/**
 * GET /states/:id/cities
 * Obtiene todas las ciudades de un estado específico.
 *
 * @param params - Parámetro de ruta conteniendo `id` del estado.
 */
states.get('/:id/cities', (context) => statesController.getCitiesByState(context), {
   params: stateParamsSchema,
});

/**
 * GET /states/:id/municipios
 * Obtiene todos los municipios de un estado específico.
 *
 * @param params - Parámetro de ruta conteniendo `id` del estado.
 */
states.get('/:id/municipios', (context) => statesController.getMunicipiosByState(context), {
   params: stateParamsSchema,
});

/**
 * GET /states/:id/asentamientos
 * Obtiene todos los asentamientos (colonias) de un estado específico.
 *
 * @param params - Parámetro de ruta conteniendo `id` del estado.
 */
states.get('/:id/asentamientos', (context) => statesController.getAsentamientosByState(context), {
   params: stateParamsSchema,
});

export default states;
