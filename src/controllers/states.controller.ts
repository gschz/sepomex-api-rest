/**
 * Controlador para manejo de estados
 * Proporciona funcionalidades de consulta de estados y sus relaciones
 * @module StatesController
 */

import { pool } from '@/config/database';
import type { CityRecord, MunicipalityRecord, PostalCodeRecord, StateController, StateRecord } from '@/types';
import type { Context } from 'elysia';

export const getAllStates = async (context: Context): StateController['GetAllReturn'] => {
   try {
      const { rows } = await pool.query<StateRecord>('SELECT * FROM get_all_states()');
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

export const getStateById = async (
   context: Context<{
      params: StateController['Params'];
   }>,
): StateController['GetByIdReturn'] => {
   try {
      const { estado } = context.params;
      const { rows } = await pool.query<StateRecord>('SELECT * FROM get_state_by_id($1)', [estado]);
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

export const getCitiesByState = async (
   context: Context<{
      params: StateController['Params'];
   }>,
): StateController['GetCitiesReturn'] => {
   try {
      const { estado } = context.params;
      const { rows } = await pool.query<CityRecord>('SELECT * FROM get_cities_by_state($1)', [estado]);
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

export const getMunicipiosByState = async (
   context: Context<{
      params: StateController['Params'];
   }>,
): StateController['GetMunicipiosReturn'] => {
   try {
      const { estado } = context.params;
      const { rows } = await pool.query<MunicipalityRecord>('SELECT * FROM get_municipalities_by_state($1)', [
         estado,
      ]);
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

export const getAsentamientosByState = async (
   context: Context<{
      params: StateController['Params'];
   }>,
): StateController['GetAsentamientosReturn'] => {
   try {
      const { estado } = context.params;
      const { rows } = await pool.query<PostalCodeRecord>(
         'SELECT * FROM get_postal_codes_by_state($1, $2, $3)',
         [estado, 100, 0],
      );
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
