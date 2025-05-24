/**
 * Controlador para manejo de estados
 * Proporciona funcionalidades de consulta de estados y sus relaciones
 * @module StatesController
 */

import { pool } from '@/config/database';
import type { ApiResponse, StateController } from '@/types';
import type { Context } from 'elysia';

/**
 * Obtiene todos los estados ordenados alfabéticamente
 *
 * @param context Contexto de Elysia
 *
 * @example
 * GET /api/states
 *
 * @returns {StateController["GetAllReturn"]} JSON con lista de estados
 */
export const getAllStates = async (context: Context): StateController['GetAllReturn'] => {
   try {
      const queryText = `
      SELECT codigo_estado, nombre_estado 
      FROM estados 
      ORDER BY nombre_estado`;

      const { rows } = await pool.query(queryText);
      return {
         success: true,
         message: 'Estados obtenidos exitosamente',
         data: rows,
      };
   } catch (error) {
      context.set.status = 500;
      return {
         success: false,
         message: 'Error al obtener estados',
         error: error instanceof Error ? error.message : 'Error desconocido',
      };
   }
};

/**
 * Obtiene un estado específico por su ID
 *
 * @param context Contexto de Elysia con params.id conteniendo el código del estado
 *
 * @example
 * GET /api/states/14
 *
 * @returns {StateController["GetByIdReturn"]} JSON con información del estado o error 404
 */
export const getStateById = async (
   context: Context<{
      params: StateController['Params'];
   }>,
): StateController['GetByIdReturn'] => {
   try {
      const { id } = context.params;
      const queryText = `
      SELECT codigo_estado, nombre_estado 
      FROM estados 
      WHERE codigo_estado = $1`;

      const { rows } = await pool.query(queryText, [id]);
      if (rows.length === 0) {
         context.set.status = 404;
         return {
            success: false,
            message: 'Estado no encontrado',
         };
      }
      return {
         success: true,
         message: 'Estado encontrado',
         data: rows[0],
      };
   } catch (error) {
      context.set.status = 500;
      return {
         success: false,
         message: 'Error al buscar estado',
         error: error instanceof Error ? error.message : 'Error desconocido',
      };
   }
};

/**
 * Obtiene todas las ciudades de un estado específico
 *
 * @param context Contexto de Elysia con params.id conteniendo el código del estado
 *
 * @example
 * GET /api/states/14/cities
 *
 * @returns {StateController["GetCitiesReturn"]} JSON con lista de ciudades del estado
 */
export const getCitiesByState = async (
   context: Context<{
      params: StateController['Params'];
   }>,
): StateController['GetCitiesReturn'] => {
   try {
      const { id } = context.params;
      const queryText = `
      SELECT codigo_ciudad, nombre_ciudad 
      FROM ciudades 
      WHERE codigo_estado = $1 
      ORDER BY nombre_ciudad`;

      const { rows } = await pool.query(queryText, [id]);
      return {
         success: true,
         message: 'Ciudades del estado obtenidas exitosamente',
         data: rows,
      };
   } catch (error) {
      context.set.status = 500;
      return {
         success: false,
         message: 'Error al obtener ciudades del estado',
         error: error instanceof Error ? error.message : 'Error desconocido',
      };
   }
};

/**
 * Obtiene todos los municipios de un estado específico
 *
 * @param context Contexto de Elysia con params.id conteniendo el código del estado
 *
 * @example
 * GET /api/states/14/municipios
 *
 * @returns {StateController["GetMunicipiosReturn"]} JSON con lista de municipios del estado
 */
export const getMunicipiosByState = async (
   context: Context<{
      params: StateController['Params'];
   }>,
): StateController['GetMunicipiosReturn'] => {
   try {
      const { id } = context.params;
      const queryText = `
      SELECT codigo_municipio, nombre_municipio
      FROM municipios
      WHERE codigo_estado = $1
      ORDER BY nombre_municipio`;

      const { rows } = await pool.query(queryText, [id]);
      return {
         success: true,
         message: 'Municipios del estado obtenidos exitosamente',
         data: rows,
      };
   } catch (error) {
      context.set.status = 500;
      return {
         success: false,
         message: 'Error al obtener municipios del estado',
         error: error instanceof Error ? error.message : 'Error desconocido',
      };
   }
};

/**
 * Obtiene todos los asentamientos de un estado específico
 *
 * @param context Contexto de Elysia con params.id conteniendo el código del estado
 *
 * @example
 * GET /api/states/14/asentamientos
 *
 * @returns {StateController["GetAsentamientosReturn"]} JSON con lista de asentamientos del estado
 */
export const getAsentamientosByState = async (
   context: Context<{
      params: StateController['Params'];
   }>,
): StateController['GetAsentamientosReturn'] => {
   try {
      const { id } = context.params;
      const queryText = `
      SELECT DISTINCT cp.nombre_asentamiento, t.nombre_tipo_asentamiento
      FROM codigos_postales cp
      LEFT JOIN tipos_asentamiento t ON cp.codigo_tipo_asentamiento = t.codigo_tipo_asentamiento
      WHERE cp.codigo_estado = $1
      ORDER BY cp.nombre_asentamiento`;

      const { rows } = await pool.query(queryText, [id]);
      return {
         success: true,
         message: 'Asentamientos del estado obtenidos exitosamente',
         data: rows,
      };
   } catch (error) {
      context.set.status = 500;
      return {
         success: false,
         message: 'Error al obtener asentamientos del estado',
         error: error instanceof Error ? error.message : 'Error desconocido',
      };
   }
};
