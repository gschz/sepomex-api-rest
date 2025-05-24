/**
 * Punto de entrada principal de la aplicación Elysia.
 * Configura el servidor, monta las rutas y maneja errores.
 * @module App
 */

import config from '@/config/config';
import { configureServer } from '@/config/server';
import routes from '@/routes/index.routes';
import { Elysia, NotFoundError } from 'elysia';

const { port: PORT, nodeEnv: NODE_ENV, apiUrl: API_URL } = config;

const app = new Elysia();

// Configuración del servidor
configureServer(app);

// Montaje de rutas principales
app.use(routes);

// Manejo centralizado de errores
app.onError(({ code, error, set }) => {
   if (error instanceof NotFoundError) {
      set.status = 404;
      return {
         status: 404,
         message: 'Recurso no encontrado',
      };
   }

   // Manejo de otros errores
   console.error(`[Error ${code || 'UNKNOWN'}]: ${error instanceof Error ? error.message : String(error)}`);

   // Establecer el código de estado adecuado para errores no manejados específicamente
   // Aseguramos que set.status sea tratado como número para la comparación
   const statusCode = typeof set.status === 'number' ? set.status : 500; // Valor por defecto si no es número
   set.status = statusCode < 400 ? 500 : statusCode; // No sobrescribir códigos de estado de cliente (4xx)

   return {
      status: set.status,
      message: 'Error interno del servidor',
      error:
         NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined,
   };
});

// Iniciar servidor si no estamos en un entorno de prueba
if (process.env.NODE_ENV !== 'test') {
   app.listen(PORT, () => {
      console.log(`
${NODE_ENV.toUpperCase()} Server is running!

 Modo: ${NODE_ENV.padEnd(28)}
 Puerto: ${PORT.toString().padEnd(26)}
 URL Base: ${API_URL.padEnd(24)}
 Documentación: ${`${API_URL}/docs`.padEnd(20)}
    `);
   });
}

export default app;
