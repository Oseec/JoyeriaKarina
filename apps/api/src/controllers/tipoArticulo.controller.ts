import { RequestHandler } from 'express';
import { pool } from '../db';

export const getTiposArticulo: RequestHandler = async (_req, res, next) => {
  try {
    const result = await pool.request().execute('sp_get_tipos_articulo');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener tipos de artículo' });
  }
};
