/**
 * Rutas para el manejo de códigos postales.
 * Define los endpoints relacionados con la consulta de información de códigos postales.
 * @module PostalRoutes
 */

import * as postalController from '@/controllers/postal.controller';
import { Elysia, t } from 'elysia';

const postal = new Elysia({ prefix: '/codigos-postales' });

/**
 * Esquemas de validación para los parámetros y query strings utilizando TypeBox.
 */
const postalCodeParamsSchema = t.Object({
   codigo: t.String({
      pattern: '^[0-9]+$',
      error: 'El código postal debe ser numérico',
   }),
});

const locationParamsSchema = t.Object({
   estado: t.String({
      pattern: '^[0-9]{2}$',
      error: 'El código de estado debe ser un número de 2 dígitos',
   }),
   municipio: t.Optional(
      t.String({
         pattern: '^[0-9]{3}$',
         error: 'El código de municipio debe ser un número de 3 dígitos',
      }),
   ),
   ciudad: t.Optional(
      t.String({
         pattern: '^[0-9]{2}$',
         error: 'El código de ciudad debe ser un número de 2 dígitos',
      }),
   ),
});

const searchQueryParamsSchema = t.Object({
   q: t.String({
      minLength: 1,
      error: 'El término de búsqueda no puede estar vacío',
   }),
});

/**
 * Define las rutas principales para búsquedas de códigos postales.
 */

/**
 * GET /codigos-postales/buscar
 * Busca asentamientos por nombre utilizando un término de búsqueda en la query string.
 *
 * @param query - Parámetro de query string conteniendo `q` (término de búsqueda).
 */
postal.get('/buscar', (context) => postalController.searchByName(context), {
   query: searchQueryParamsSchema,
   detail: { tags: ['Códigos Postales'], summary: 'Buscar asentamientos por nombre' },
});

/**
 * GET /codigos-postales/:codigo
 * Obtiene información detallada de un código postal específico por su código.
 *
 * @param params - Parámetro de ruta conteniendo `codigo`.
 */
postal.get('/:codigo', (context) => postalController.getByPostalCode(context), {
   params: postalCodeParamsSchema,
   detail: { tags: ['Códigos Postales'], summary: 'Obtener detalle de un código postal' },
});

/**
 * Define las rutas para filtrar códigos postales por ubicación geográfica.
 */

/**
 * GET /codigos-postales/estado/:estado
 * Obtiene todos los códigos postales de un estado específico.
 *
 * @param params - Parámetro de ruta conteniendo `estado`.
 */
postal.get('/estado/:estado', (context) => postalController.getByState(context), {
   params: t.Pick(locationParamsSchema, ['estado']),
   detail: { tags: ['Códigos Postales'], summary: 'Obtener códigos postales por estado' },
});

/**
 * GET /codigos-postales/municipio/:estado/:municipio
 * Obtiene códigos postales por municipio, filtrando por códigos de estado y municipio.
 *
 * @param params - Parámetros de ruta conteniendo `estado` y `municipio`.
 */
postal.get('/municipio/:estado/:municipio', (context) => postalController.getByMunicipio(context), {
   params: t.Pick(locationParamsSchema, ['estado', 'municipio']),
   detail: { tags: ['Códigos Postales'], summary: 'Obtener códigos postales por municipio' },
});

/**
 * GET /codigos-postales/ciudad/:estado/:ciudad
 * Obtiene códigos postales por ciudad, filtrando por códigos de estado y ciudad.
 *
 * @param params - Parámetros de ruta conteniendo `estado` y `ciudad`.
 */
postal.get('/ciudad/:estado/:ciudad', (context) => postalController.getByCiudad(context), {
   params: t.Pick(locationParamsSchema, ['estado', 'ciudad']),
   detail: { tags: ['Códigos Postales'], summary: 'Obtener códigos postales por ciudad' },
});

export default postal;
