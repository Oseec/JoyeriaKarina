import dotenv from 'dotenv';
import mssql, { ConnectionPool, config as MSSQLConfig } from 'mssql';

dotenv.config();

export const dbConfig: MSSQLConfig = {
  server:   process.env.DB_HOST!,             // 172.22.192.1
  port:     Number(process.env.DB_PORT),      // 14330
  user:     process.env.DB_USER!,             // sa
  password: process.env.DB_PASS!,             // TuContraseñaSQL
  database: process.env.DB_NAME!,             // TuBaseDeDatos
  options: {
    encrypt: false,                           // desarrollo local
    trustServerCertificate: true
  }
};

export let pool: ConnectionPool;

export async function connectDB(): Promise<ConnectionPool> {
  if (!pool) {
    pool = await mssql.connect(dbConfig);
    console.log('Conectado a SQL Server');
  }
  return pool;
}
