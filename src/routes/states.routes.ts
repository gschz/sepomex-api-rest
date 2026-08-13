/**
 * Rutas para el manejo de estados.
 * Define los endpoints relacionados con la consulta de estados y sus relaciones.
 * @module StatesRoutes
 */

import * as statesController from '@/controllers/states.controller';
import { Elysia, t } from 'elysia';

const states = new Elysia({ prefix: '/estados' });

/**
 * Esquemas de validación para los parámetros de ruta utilizando TypeBox.
 */
const stateParamsSchema = t.Object({
   estado: t.String({
      pattern: '^[0-9]{2}$',
      error: 'El código de estado debe ser un número de 2 dígitos',
   }),
});

/**
 * Define las rutas principales para la gestión de estados.
 */

/**
 * GET /estados
 * Obtiene todos los estados.
 */
states.get('/', statesController.getAllStates, {
   detail: { tags: ['Estados'], summary: 'Listar todos los estados' },
});

/**
 * GET /estados/:estado
 * Obtiene un estado específico por su código.
 *
 * @param params - Parámetro de ruta conteniendo `estado` del estado.
 */
states.get('/:estado', (context) => statesController.getStateById(context), {
   params: stateParamsSchema,
   detail: { tags: ['Estados'], summary: 'Obtener un estado por código' },
});

/**
 * Define las rutas para obtener relaciones de estados.
 */

/**
 * GET /estados/:estado/ciudades
 * Obtiene todas las ciudades de un estado específico.
 *
 * @param params - Parámetro de ruta conteniendo `estado` del estado.
 */
states.get('/:estado/ciudades', (context) => statesController.getCitiesByState(context), {
   params: stateParamsSchema,
   detail: { tags: ['Estados'], summary: 'Obtener ciudades de un estado' },
});

/**
 * GET /estados/:estado/municipios
 * Obtiene todos los municipios de un estado específico.
 *
 * @param params - Parámetro de ruta conteniendo `estado` del estado.
 */
states.get('/:estado/municipios', (context) => statesController.getMunicipiosByState(context), {
   params: stateParamsSchema,
   detail: { tags: ['Estados'], summary: 'Obtener municipios de un estado' },
});

/**
 * GET /estados/:estado/asentamientos
 * Obtiene todos los asentamientos (colonias) de un estado específico.
 *
 * @param params - Parámetro de ruta conteniendo `estado` del estado.
 */
states.get('/:estado/asentamientos', (context) => statesController.getAsentamientosByState(context), {
   params: stateParamsSchema,
   detail: {
      tags: ['Estados'],
      summary: 'Obtener asentamientos de un estado',
   },
});

export default states;
