import { RequestHandler } from 'express';
import { pool } from '../db';

export const getMateriales: RequestHandler = async (_req, res, next) => {
  try {
    const result = await pool.request().execute('sp_get_material');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener materiales' });
  }
};