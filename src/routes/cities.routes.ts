/**
 * Rutas para el manejo de ciudades.
 * Define los endpoints relacionados con la consulta de ciudades y sus relaciones.
 * @module CitiesRoutes
 */

import * as citiesController from '@/controllers/cities.controller';
import type { CitiesController } from '@/types';
import { Elysia, t } from 'elysia';

const cities = new Elysia({ prefix: '/cities' });

/**
 * Esquemas de validación para los parámetros de ruta utilizando TypeBox.
 */
const cityParamsSchema = t.Object({
   estado: t.String({
      pattern: '^[0-9]{2}$',
      error: 'El código de estado debe ser un número de 2 dígitos',
   }),
   ciudad: t.String({
      pattern: '^[0-9]{3}$',
      error: 'El código de ciudad debe ser un número de 3 dígitos',
   }),
});

/**
 * Define las rutas principales para la gestión de ciudades.
 */

/**
 * GET /cities
 * Obtiene todas las ciudades con su información de estado.
 */
cities.get('/', citiesController.getAllCities);

/**
 * GET /cities/:estado/:ciudad
 * Obtiene información detallada de una ciudad específica por sus códigos.
 *
 * @param params - Parámetros de ruta conteniendo `estado` y `ciudad`.
 */
cities.get('/:estado/:ciudad', (context) => citiesController.getCityById(context), {
   params: cityParamsSchema,
});

/**
 * Define las rutas para obtener relaciones de ciudades.
 */

/**
 * GET /cities/:estado/:ciudad/colonias
 * Obtiene todas las colonias (asentamientos) de una ciudad específica.
 *
 * @param params - Parámetros de ruta conteniendo `estado` y `ciudad`.
 */
cities.get('/:estado/:ciudad/colonias', (context) => citiesController.getColoniasByCity(context), {
   params: cityParamsSchema,
});

/**
 * GET /cities/:estado/:ciudad/codigos
 * Obtiene todos los códigos postales asociados a una ciudad específica.
 *
 * @param params - Parámetros de ruta conteniendo `estado` y `ciudad`.
 */
cities.get('/:estado/:ciudad/codigos', (context) => citiesController.getPostalCodesByCity(context), {
   params: cityParamsSchema,
});

export default cities;
