/**
 * Rutas para el manejo de ciudades.
 * Define los endpoints relacionados con la consulta de ciudades y sus relaciones.
 * @module CitiesRoutes
 */

import * as citiesController from '@/controllers/cities.controller';
import { Elysia, t } from 'elysia';

const cities = new Elysia({ prefix: '/ciudades' });

/**
 * Esquemas de validación para los parámetros de ruta utilizando TypeBox.
 */
const cityParamsSchema = t.Object({
   estado: t.String({
      pattern: '^[0-9]{2}$',
      error: 'El código de estado debe ser un número de 2 dígitos',
   }),
   ciudad: t.String({
      pattern: '^[0-9]{2}$',
      error: 'El código de ciudad debe ser un número de 2 dígitos',
   }),
});

/**
 * Define las rutas principales para la gestión de ciudades.
 */

/**
 * GET /ciudades
 * Obtiene todas las ciudades con su información de estado.
 */
cities.get('/', citiesController.getAllCities, {
   detail: { tags: ['Ciudades'], summary: 'Listar todas las ciudades' },
});

/**
 * GET /ciudades/:estado/:ciudad
 * Obtiene información detallada de una ciudad específica por sus códigos.
 *
 * @param params - Parámetros de ruta conteniendo `estado` y `ciudad`.
 */
cities.get('/:estado/:ciudad', (context) => citiesController.getCityById(context), {
   params: cityParamsSchema,
   detail: { tags: ['Ciudades'], summary: 'Obtener una ciudad por estado y ciudad' },
});

/**
 * Define las rutas para obtener relaciones de ciudades.
 */

/**
 * GET /ciudades/:estado/:ciudad/colonias
 * Obtiene todas las colonias (asentamientos) de una ciudad específica.
 *
 * @param params - Parámetros de ruta conteniendo `estado` y `ciudad`.
 */
cities.get('/:estado/:ciudad/colonias', (context) => citiesController.getColoniasByCity(context), {
   params: cityParamsSchema,
   detail: { tags: ['Ciudades'], summary: 'Obtener colonias de una ciudad' },
});

/**
 * GET /ciudades/:estado/:ciudad/codigos-postales
 * Obtiene todos los códigos postales asociados a una ciudad específica.
 *
 * @param params - Parámetros de ruta conteniendo `estado` y `ciudad`.
 */
cities.get('/:estado/:ciudad/codigos-postales', (context) => citiesController.getPostalCodesByCity(context), {
   params: cityParamsSchema,
   detail: { tags: ['Ciudades'], summary: 'Obtener códigos postales de una ciudad' },
});

export default cities;
