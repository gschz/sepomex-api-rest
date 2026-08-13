/**
 * Controlador para manejo de ciudades
 * Proporciona funcionalidades de consulta de ciudades y sus relaciones
 * @module CitiesController
 */

import { pool } from '@/config/database';
import type { CitiesController, CityRecord, PostalCodeRecord } from '@/types';
import type { Context } from 'elysia';

export const getAllCities = async (context: Context): CitiesController['GetAllReturn'] => {
   try {
      const { rows } = await pool.query<CityRecord>('SELECT * FROM get_all_cities()');
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

export const getCityById = async (
   context: Context<{
      params: CitiesController['Params'];
   }>,
): CitiesController['GetByIdReturn'] => {
   try {
      const { estado, ciudad } = context.params;
      const { rows } = await pool.query<CityRecord>('SELECT * FROM get_city_by_id($1, $2)', [estado, ciudad]);
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

export const getColoniasByCity = async (
   context: Context<{
      params: CitiesController['Params'];
   }>,
): CitiesController['GetColoniasReturn'] => {
   try {
      const { estado, ciudad } = context.params;
      const { rows } = await pool.query<PostalCodeRecord>(
         'SELECT * FROM get_settlements_by_city($1, $2, $3, $4)',
         [estado, ciudad, 100, 0],
      );
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

export const getPostalCodesByCity = async (
   context: Context<{
      params: CitiesController['Params'];
   }>,
): CitiesController['GetPostalCodesReturn'] => {
   try {
      const { estado, ciudad } = context.params;
      const { rows } = await pool.query<PostalCodeRecord>(
         'SELECT * FROM get_postal_codes_by_city($1, $2, $3, $4)',
         [estado, ciudad, 100, 0],
      );
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
