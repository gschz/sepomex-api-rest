/**
 * Controlador para manejo de documentación.
 * Proporciona la documentación de la API.
 * @module DocsController
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import type { Context } from 'elysia';
import { marked } from 'marked';

/**
 * Obtiene la documentación de la API procesando archivos Markdown.
 *
 * @param context - El contexto de la petición de Elysia.
 *
 * @returns Una promesa que resuelve con un objeto que contiene la documentación procesada y datos adicionales.
 *
 * @example
 * ```typescript
 * GET /api/docs
 * ```
 */
export const getApiDocs = async (context: Context) => {
   try {
      const docsPath = path.join(process.cwd(), 'docs');

      // Leer archivos markdown
      const [apiDocs, codigosFormato, endpoints] = await Promise.all([
         fs.readFile(path.join(docsPath, 'api-docs.md'), 'utf-8'),
         fs.readFile(path.join(docsPath, 'codigos-formato.md'), 'utf-8'),
         fs.readFile(path.join(docsPath, 'endpoints.md'), 'utf-8'),
      ]);

      // Convertir Markdown a HTML
      const documentation = {
         general: marked(apiDocs),
         formatoCodigos: marked(codigosFormato),
         endpoints: marked(endpoints),
      };

      // Datos adicionales (pueden venir de la configuración)
      const additionalData = {
         title: 'SEPOMEX API REST Docs',
         version: '1.0.0',
         baseUrl: process.env.API_URL || 'http://localhost:3000/api/v1', // Considerar usar config.API_URL
         meta: {
            autenticacion: 'No requiere autenticación - API de acceso público',
            formatos: {
               contentType: 'application/json',
               accept: 'application/json',
            },
            codigosEstado: {
               200: 'Petición exitosa',
               400: 'Error en los parámetros de la petición',
               404: 'Recurso no encontrado',
               500: 'Error del servidor',
            },
         },
      };

      // Retornar los datos para que Elysia los maneje
      return {
         ...additionalData,
         documentation,
      };
   } catch (error) {
      context.set.status = 500;
      return {
         error: 'Error al cargar la documentación',
         detalles: error instanceof Error ? error.message : 'Error desconocido',
      };
   }
};
