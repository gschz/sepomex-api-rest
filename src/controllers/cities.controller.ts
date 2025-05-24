/**
 * Controlador para manejo de ciudades
 * Proporciona funcionalidades de consulta de ciudades y sus relaciones
 * @module CitiesController
 */

import { pool } from '@/config/database';
import type { ApiResponse, CitiesController } from '@/types';
import type { Context } from 'elysia';

/**
 * Obtiene todas las ciudades con su información de estado.
 *
 * @param context - El contexto de la petición de Elysia.
 *
 * @returns Una promesa que resuelve con un objeto ApiResponse que contiene una lista de ciudades y sus estados.
 *
 * @example
 * ```typescript
 * GET /api/cities
 * ```
 */
export const getAllCities = async (context: Context): CitiesController['GetAllReturn'] => {
   try {
      const queryText = `
      SELECT c.codigo_ciudad, c.nombre_ciudad, 
             e.codigo_estado, e.nombre_estado
      FROM ciudades c
      JOIN estados e ON c.codigo_estado = e.codigo_estado
      ORDER BY e.nombre_estado, c.nombre_ciudad`;

      const { rows } = await pool.query(queryText);
      return {
         success: true,
         message: 'Ciudades obtenidas exitosamente',
         data: rows,
      };
   } catch (error) {
      context.set.status = 500;
      return {
         success: false,
         message: 'Error al obtener ciudades',
         error: error instanceof Error ? error.message : 'Error desconocido',
      };
   }
};

/**
 * Obtiene información detallada de una ciudad específica por sus códigos de estado y ciudad.
 *
 * @param context - El contexto de la petición de Elysia, incluyendo los parámetros de ruta.
 * @param context.params - Los parámetros de ruta que contienen los códigos de estado y ciudad.
 *
 * @returns Una promesa que resuelve con un objeto ApiResponse que contiene la información de la ciudad o un error 404 si no se encuentra.
 *
 * @example
 * ```typescript
 * GET /api/cities/14/001
 * ```
 */
export const getCityById = async (
   context: Context<{
      params: CitiesController['Params'];
   }>,
): CitiesController['GetByIdReturn'] => {
   try {
      const { estado, ciudad } = context.params;
      const queryText = `
      SELECT c.*, e.nombre_estado
      FROM ciudades c
      JOIN estados e ON c.codigo_estado = e.codigo_estado
      WHERE c.codigo_estado = $1 AND c.codigo_ciudad = $2`;

      const { rows } = await pool.query(queryText, [estado, ciudad]);
      if (rows.length === 0) {
         context.set.status = 404;
         return {
            success: false,
            message: 'Ciudad no encontrada',
         };
      }
      return {
         success: true,
         message: 'Ciudad encontrada',
         data: rows[0],
      };
   } catch (error) {
      context.set.status = 500;
      return {
         success: false,
         message: 'Error al buscar ciudad',
         error: error instanceof Error ? error.message : 'Error desconocido',
      };
   }
};

/**
 * Obtiene todas las colonias (asentamientos) de una ciudad específica por sus códigos de estado y ciudad.
 *
 * @param context - El contexto de la petición de Elysia, incluyendo los parámetros de ruta.
 * @param context.params - Los parámetros de ruta que contienen los códigos de estado y ciudad.
 *
 * @returns Una promesa que resuelve con un objeto ApiResponse que contiene una lista de colonias.
 *
 * @example
 * ```typescript
 * GET /api/cities/14/001/colonias
 * ```
 */
export const getColoniasByCity = async (
   context: Context<{
      params: CitiesController['Params'];
   }>,
): CitiesController['GetColoniasReturn'] => {
   try {
      const { estado, ciudad } = context.params;
      const queryText = `
      SELECT DISTINCT cp.nombre_asentamiento, t.nombre_tipo_asentamiento, z.tipo_zona
      FROM codigos_postales cp
      LEFT JOIN tipos_asentamiento t ON cp.codigo_tipo_asentamiento = t.codigo_tipo_asentamiento
      LEFT JOIN zonas z ON cp.id_zona = z.id_zona
      WHERE cp.codigo_estado = $1 AND cp.codigo_ciudad = $2
      ORDER BY cp.nombre_asentamiento`;

      const { rows } = await pool.query(queryText, [estado, ciudad]);
      return {
         success: true,
         message: 'Colonias de la ciudad obtenidas exitosamente',
         data: rows,
      };
   } catch (error) {
      context.set.status = 500;
      return {
         success: false,
         message: 'Error al obtener colonias de la ciudad',
         error: error instanceof Error ? error.message : 'Error desconocido',
      };
   }
};

/**
 * Obtiene todos los códigos postales de una ciudad específica por sus códigos de estado y ciudad.
 *
 * @param context - El contexto de la petición de Elysia, incluyendo los parámetros de ruta.
 * @param context.params - Los parámetros de ruta que contienen los códigos de estado y ciudad.
 *
 * @returns Una promesa que resuelve con un objeto ApiResponse que contiene una lista de códigos postales.
 *
 * @example
 * ```typescript
 * GET /api/cities/14/001/postal-codes
 * ```
 */
export const getPostalCodesByCity = async (
   context: Context<{
      params: CitiesController['Params'];
   }>,
): CitiesController['GetPostalCodesReturn'] => {
   try {
      const { estado, ciudad } = context.params;
      const queryText = `
      SELECT DISTINCT codigo_postal
      FROM codigos_postales
      WHERE codigo_estado = $1 AND cp.codigo_ciudad = $2
      ORDER BY codigo_postal`;

      const { rows } = await pool.query(queryText, [estado, ciudad]);
      return {
         success: true,
         message: 'Códigos postales de la ciudad obtenidos exitosamente',
         data: rows,
      };
   } catch (error) {
      context.set.status = 500;
      return {
         success: false,
         message: 'Error al obtener códigos postales de la ciudad',
         error: error instanceof Error ? error.message : 'Error desconocido',
      };
   }
};
