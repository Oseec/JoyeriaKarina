import { RequestHandler } from 'express';
import { pool } from '../db';

export const createTipoReparacion: RequestHandler = async (req, res, next) => {
  const { Nombre, Precio } = req.body;
  try {
    const result = await pool
      .request()
      .input('Nombre', Nombre)
      .input('Precio', Precio)
      .execute('sp_create_tipo_reparacion');

    const newId = result.recordset[0].NewTipoReparacionId;
    res.status(201).json({ id: newId });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Error al crear tipo de reparación' });
  }
};
