// db/db.connection.ts
import * as dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../schema/schema';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOSTNAME,
  port: +process.env.DB_PORT!,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME,
});

export const db = drizzle(pool, { schema });
