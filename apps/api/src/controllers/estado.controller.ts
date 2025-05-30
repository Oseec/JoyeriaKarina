import { RequestHandler } from 'express';
import { pool } from '../db';

export const getEstados: RequestHandler = async (_req, res, next) => {
  try {
    const result = await pool.request().execute('sp_get_estados');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener estados' });
  }
};
