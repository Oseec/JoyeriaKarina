import { RequestHandler } from 'express';
import { pool } from '../db';

export const getUbicaciones: RequestHandler = async (_req, res, next) => {
  try {
    const result = await pool
      .request()
      .execute('sp_get_ubicaciones');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener ubicaciones' });
  }
};