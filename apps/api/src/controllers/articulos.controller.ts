import { RequestHandler } from 'express';
import { pool } from '../db';

export const createArticulo: RequestHandler = async (req, res, next) => {
  const { idTipoArticulo, idMaterial, Peso, Cantidad, LogDescripcionArticulo } = req.body;
  try {
    const result = await pool
      .request()
      .input('idTipoArticulo', idTipoArticulo)
      .input('idMaterial',     idMaterial)
      .input('Peso',           Peso)
      .input('Cantidad',       Cantidad)
      .input('LogDescripcionArticulo', LogDescripcionArticulo)
      .execute('sp_create_articulo');

    const newId = result.recordset[0].NewArticuloId;
    res.status(201).json({ id: newId });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Error al crear artículo' });
  }
};