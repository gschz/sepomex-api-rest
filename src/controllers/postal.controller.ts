/**
 * Controlador para manejo de códigos postales
 * Proporciona funcionalidades de búsqueda y filtrado de códigos postales.
 * @module PostalController
 */

import { pool } from '@/config/database';
import type { PostalCodeRecord, PostalController } from '@/types';
import type { Context } from 'elysia';

export const searchByName = async (
   context: Context<{
      query: PostalController['SearchQuery'];
   }>,
): PostalController['SearchByNameReturn'] => {
   try {
      const { q } = context.query;
      const { rows } = await pool.query<PostalCodeRecord>(
         'SELECT * FROM search_settlements_by_name($1, $2, $3)',
         [q, 100, 0],
      );
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

export const getByPostalCode = async (
   context: Context<{
      params: PostalController['PostalParams'];
   }>,
): PostalController['GetByPostalCodeReturn'] => {
   try {
      const { codigo } = context.params;
      const { rows } = await pool.query<PostalCodeRecord>('SELECT * FROM search_by_postal_code($1)', [
         codigo,
      ]);
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

export const getByState = async (
   context: Context<{
      params: Pick<PostalController['LocationParams'], 'id'>;
   }>,
): PostalController['GetByStateReturn'] => {
   try {
      const { id } = context.params;
      const { rows } = await pool.query<PostalCodeRecord>(
         'SELECT * FROM get_postal_codes_by_state($1, $2, $3)',
         [id, 100, 0],
      );
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

export const getByMunicipio = async (
   context: Context<{
      params: Pick<PostalController['LocationParams'], 'estado' | 'municipio'>;
   }>,
): PostalController['GetByMunicipioReturn'] => {
   try {
      const { estado, municipio } = context.params;
      const { rows } = await pool.query<PostalCodeRecord>(
         'SELECT * FROM get_postal_codes_by_municipality($1, $2, $3, $4)',
         [estado, municipio, 100, 0],
      );
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

export const getByCiudad = async (
   context: Context<{
      params: Pick<PostalController['LocationParams'], 'estado' | 'ciudad'>;
   }>,
): PostalController['GetByCiudadReturn'] => {
   try {
      const { estado, ciudad } = context.params;
      const { rows } = await pool.query<PostalCodeRecord>(
         'SELECT * FROM get_postal_codes_by_city($1, $2, $3, $4)',
         [estado, ciudad, 100, 0],
      );
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
