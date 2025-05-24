/**
 * database.ts
 * configuración de la conexión a la base de datos
 */

import pg from 'pg';
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from './config';
const { Pool } = pg;
import type { DbConfig } from '@/types';

const config: DbConfig = {
   user: DB_USER,
   password: DB_PASSWORD,
   host: DB_HOST,
   port: Number.parseInt(DB_PORT),
   database: DB_NAME,
};

export const pool = new Pool(config);
