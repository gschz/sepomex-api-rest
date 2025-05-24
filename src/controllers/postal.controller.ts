/**
 * Controlador para manejo de códigos postales
 * Proporciona funcionalidades de búsqueda y filtrado de códigos postales.
 * @module PostalController
 */

import { pool } from '@/config/database';
import type { ApiResponse, PostalController } from '@/types';
import type { Context } from 'elysia';

/**
 * Busca asentamientos por nombre utilizando un término de búsqueda.
 *
 * @param context - El contexto de la petición de Elysia, incluyendo los parámetros de query.
 * @param context.query - Los parámetros de query que contienen el término de búsqueda `q`.
 *
 * @returns Una promesa que resuelve con un objeto ApiResponse que contiene una lista de registros de códigos postales que coinciden.
 *
 * @example
 * ```typescript
 * GET /api/postal/search?q=centro
 * ```
 */
export const searchByName = async (
   context: Context<{
      query: PostalController['SearchQuery'];
   }>,
): PostalController['SearchByNameReturn'] => {
   try {
      const { q } = context.query;
      // Consulta SQL con JOINS para obtener información relacionada
      const queryText = `
      SELECT cp.*, e.nombre_estado, m.nombre_municipio, c.nombre_ciudad
      FROM codigos_postales cp
      LEFT JOIN estados e ON cp.codigo_estado = e.codigo_estado
      LEFT JOIN municipios m ON cp.codigo_municipio = m.codigo_municipio 
        AND cp.codigo_estado = m.codigo_estado
      LEFT JOIN ciudades c ON cp.codigo_ciudad = c.codigo_ciudad 
        AND cp.codigo_estado = c.codigo_estado
      WHERE cp.nombre_asentamiento ILIKE $1`;

      const { rows } = await pool.query<PostalController['PostalCodeRecord']>(queryText, [`%${q}%`]);

      return {
         success: true,
         message: 'Búsqueda realizada con éxito',
         data: rows,
      };
   } catch (error) {
      context.set.status = 500;
      return {
         success: false,
         message: 'Error en la búsqueda',
         error: error instanceof Error ? error.message : 'Error desconocido',
      };
   }
};

/**
 * Obtiene información detallada de un código postal específico.
 * Incluye datos del estado, municipio, ciudad, tipo de asentamiento y zona.
 *
 * @param context - El contexto de la petición de Elysia, incluyendo los parámetros de ruta.
 * @param context.params - Los parámetros de ruta que contienen el código postal `codigo`.
 *
 * @returns Una promesa que resuelve con un objeto ApiResponse que contiene la información completa del código postal.
 *
 * @example
 * ```typescript
 * GET /api/postal/45050
 * ```
 */
export const getByPostalCode = async (
   context: Context<{
      params: PostalController['PostalParams'];
   }>,
): PostalController['GetByPostalCodeReturn'] => {
   try {
      const { codigo } = context.params;
      // Consulta SQL con múltiples JOINS para obtener información completa
      const queryText = `
      SELECT cp.*, e.nombre_estado, m.nombre_municipio, c.nombre_ciudad, 
             t.nombre_tipo_asentamiento, z.tipo_zona
      FROM codigos_postales cp
      LEFT JOIN estados e ON cp.codigo_estado = e.codigo_estado
      LEFT JOIN municipios m ON cp.codigo_municipio = m.codigo_municipio 
        AND cp.codigo_estado = m.codigo_estado
      LEFT JOIN ciudades c ON cp.codigo_ciudad = c.codigo_ciudad 
        AND cp.codigo_estado = c.codigo_estado
      LEFT JOIN tipos_asentamiento t ON cp.codigo_tipo_asentamiento = t.codigo_tipo_asentamiento
      LEFT JOIN zonas z ON cp.id_zona = z.id_zona
      WHERE cp.codigo_postal = $1`;

      const { rows } = await pool.query<PostalController['PostalCodeRecord']>(queryText, [codigo]);
      return {
         success: true,
         message: 'Código postal encontrado',
         data: rows,
      };
   } catch (error) {
      context.set.status = 500;
      return {
         success: false,
         message: 'Error al buscar código postal',
         error: error instanceof Error ? error.message : 'Error desconocido',
      };
   }
};

/**
 * Obtiene todos los códigos postales de un estado específico.
 *
 * @param context - El contexto de la petición de Elysia, incluyendo los parámetros de ruta.
 * @param context.params - Los parámetros de ruta que contienen el ID del estado `id`.
 *
 * @returns Una promesa que resuelve con un objeto ApiResponse que contiene una lista de registros de códigos postales del estado.
 *
 * @example
 * ```typescript
 * GET /api/postal/state/14
 * ```
 */
export const getByState = async (
   context: Context<{
      params: Pick<PostalController['LocationParams'], 'id'>;
   }>,
): PostalController['GetByStateReturn'] => {
   try {
      const { id } = context.params;
      // Consulta filtrada por estado
      const queryText = `
      SELECT cp.*, e.nombre_estado, m.nombre_municipio, c.nombre_ciudad
      FROM codigos_postales cp
      LEFT JOIN estados e ON cp.codigo_estado = e.codigo_estado
      LEFT JOIN municipios m ON cp.codigo_municipio = m.codigo_municipio 
        AND cp.codigo_estado = m.codigo_estado
      LEFT JOIN ciudades c ON cp.codigo_ciudad = c.codigo_ciudad 
        AND cp.codigo_estado = c.codigo_estado
      WHERE cp.codigo_estado = $1`;

      const { rows } = await pool.query<PostalController['PostalCodeRecord']>(queryText, [id]);
      return {
         success: true,
         message: 'Códigos postales del estado encontrados',
         data: rows,
      };
   } catch (error) {
      context.set.status = 500;
      return {
         success: false,
         message: 'Error al buscar códigos postales del estado',
         error: error instanceof Error ? error.message : 'Error desconocido',
      };
   }
};

/**
 * Obtiene códigos postales por municipio.
 * Filtra por estado y municipio para obtener resultados específicos.
 *
 * @param context - El contexto de la petición de Elysia, incluyendo los parámetros de ruta.
 * @param context.params - Los parámetros de ruta que contienen los códigos de estado y municipio.
 *
 * @returns Una promesa que resuelve con un objeto ApiResponse que contiene una lista de registros de códigos postales del municipio.
 *
 * @example
 * ```typescript
 * GET /api/postal/municipio/14/001
 * ```
 */
export const getByMunicipio = async (
   context: Context<{
      params: Pick<PostalController['LocationParams'], 'estado' | 'municipio'>;
   }>,
): PostalController['GetByMunicipioReturn'] => {
   try {
      const { estado, municipio } = context.params;
      // Consulta filtrada por estado y municipio
      const queryText = `
      SELECT cp.*, e.nombre_estado, m.nombre_municipio, c.nombre_ciudad
      FROM codigos_postales cp
      LEFT JOIN estados e ON cp.codigo_estado = e.codigo_estado
      LEFT JOIN municipios m ON cp.codigo_municipio = m.codigo_municipio 
        AND cp.codigo_estado = m.codigo_estado
      LEFT JOIN ciudades c ON cp.codigo_ciudad = c.codigo_ciudad 
        AND cp.codigo_estado = c.codigo_estado
      WHERE cp.codigo_estado = $1 AND cp.codigo_municipio = $2`;

      const { rows } = await pool.query<PostalController['PostalCodeRecord']>(queryText, [estado, municipio]);
      return {
         success: true,
         message: 'Códigos postales del municipio encontrados',
         data: rows,
      };
   } catch (error) {
      context.set.status = 500;
      return {
         success: false,
         message: 'Error al buscar códigos postales del municipio',
         error: error instanceof Error ? error.message : 'Error desconocido',
      };
   }
};

/**
 * Obtiene códigos postales por ciudad.
 * Filtra por estado y ciudad para obtener resultados específicos.
 *
 * @param context - El contexto de la petición de Elysia, incluyendo los parámetros de ruta.
 * @param context.params - Los parámetros de ruta que contienen los códigos de estado y ciudad.
 *
 * @returns Una promesa que resuelve con un objeto ApiResponse que contiene una lista de registros de códigos postales de la ciudad.
 *
 * @example
 * ```typescript
 * GET /api/postal/ciudad/14/001
 * ```
 */
export const getByCiudad = async (
   context: Context<{
      params: Pick<PostalController['LocationParams'], 'estado' | 'ciudad'>;
   }>,
): PostalController['GetByCiudadReturn'] => {
   try {
      const { estado, ciudad } = context.params;
      // Consulta filtrada por estado y ciudad
      const queryText = `
      SELECT cp.*, e.nombre_estado, m.nombre_municipio, c.nombre_ciudad
      FROM codigos_postales cp
      LEFT JOIN estados e ON cp.codigo_estado = e.codigo_estado
      LEFT JOIN municipios m ON cp.codigo_municipio = m.codigo_municipio 
        AND cp.codigo_estado = m.codigo_estado
      LEFT JOIN ciudades c ON cp.codigo_ciudad = c.codigo_ciudad 
        AND cp.codigo_estado = c.codigo_estado
      WHERE cp.codigo_estado = $1 AND cp.codigo_ciudad = $2`;

      const { rows } = await pool.query<PostalController['PostalCodeRecord']>(queryText, [estado, ciudad]);
      return {
         success: true,
         message: 'Códigos postales de la ciudad encontrados',
         data: rows,
      };
   } catch (error) {
      context.set.status = 500;
      return {
         success: false,
         message: 'Error al buscar códigos postales de la ciudad',
         error: error instanceof Error ? error.message : 'Error desconocido',
      };
   }
};
