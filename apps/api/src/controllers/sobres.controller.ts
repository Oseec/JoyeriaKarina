import {  RequestHandler  } from 'express';
import { pool } from '../db';
import * as sql from 'mssql';

export const getAllSobres: RequestHandler = async (_req, res, next) => {
  try {
    const result = await pool.request().execute('sp_get_sobres');
    res.json(result.recordset);
    return; // <-- Promise<void>
  } catch (err) {
    console.error(err);
    next(err);  // delegamos al manejo de errores global
  }
};

export const getSobreById: RequestHandler = async (req, res, next) => {
  const id = Number(req.params.id);
  try {
    const result = await pool
      .request()
      .input('Id', sql.Int, id)
      .execute('sp_get_sobre_by_id');

    const rows = result.recordset;
    if (rows.length === 0) {
      res.status(404).json({ error: 'Sobre no encontrado' });
      return;  // <-- Promise<void>
    }

    res.json(rows[0]);
    return;  // <-- Promise<void>
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const createSobre: RequestHandler = async (req, res, next) => {
  const {
    idUbicacion,
    idArticulo,
    idTiposReparacion,
    PrecioTotal,
    idEstado,
    FechaIngreso,
    FechaEntrega,
    idCliente,
    Abono,
    SaldoPendiente,
    Tipo,
    FechaLimiteApartado,
    idTipoLetra,
    DescripcionDeGrabados,
    FechaLimiteEntrega,
    EnEspera,
    createdBy
  } = req.body;

  try {
    const result = await pool
      .request()
      .input('idUbicacion', sql.Int, idUbicacion)
      .input('idArticulo', sql.Int, idArticulo)
      .input('idTiposReparacion', sql.Int, idTiposReparacion)
      .input('PrecioTotal', sql.Money, PrecioTotal)
      .input('idEstado', sql.Int, idEstado)
      .input('FechaIngreso', sql.Date, FechaIngreso)
      .input('FechaEntrega', sql.Date, FechaEntrega)
      .input('idCliente', sql.Int, idCliente)
      .input('Abono', sql.Money, Abono)
      .input('SaldoPendiente', sql.Money, SaldoPendiente)
      .input('Tipo', sql.VarChar(50), Tipo)
      .input('FechaLimiteApartado', sql.Date, FechaLimiteApartado)
      .input('idTipoLetra', sql.Int, idTipoLetra)
      .input('DescripcionDeGrabados', sql.VarChar(2000), DescripcionDeGrabados)
      .input('FechaLimiteEntrega', sql.Date, FechaLimiteEntrega)
      .input('EnEspera', sql.Bit, EnEspera)
      .input('createdBy', sql.Int, createdBy)
      .execute('sp_create_sobre');

    const newId = result.recordset[0].NewSobreId;
    res.status(201).json({ id: newId, ...req.body });
    return;
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// PUT /api/sobres/:id
export const updateSobre: RequestHandler = async (req, res, next) => {
  const id = Number(req.params.id);

  // Extract fields that may come in the body
  const {
    idUbicacion,
    idArticulo,
    idTiposReparacion,
    PrecioTotal,
    idEstado,
    FechaIngreso,
    FechaEntrega,
    idCliente,
    Abono,
    SaldoPendiente,
    Tipo,
    FechaLimiteApartado,
    idTipoLetra,
    DescripcionDeGrabados,
    FechaLimiteEntrega,
    EnEspera,
  } = req.body;

  // @ts-ignore: userId lo pusimos en el middleware express-jwt
  const updatedBy: number = req.userId;

  try {
    await pool
      .request()
      .input('Id', sql.Int, id)
      .input('idUbicacion',           sql.Int,   idUbicacion         ?? null)
      .input('idArticulo',            sql.Int,   idArticulo          ?? null)
      .input('idTiposReparacion',     sql.Int,   idTiposReparacion   ?? null)
      .input('PrecioTotal',           sql.Money, PrecioTotal         ?? null)
      .input('idEstado',              sql.Int,   idEstado            ?? null)
      .input('FechaIngreso',          sql.Date,  FechaIngreso        ?? null)
      .input('FechaEntrega',          sql.Date,  FechaEntrega        ?? null)
      .input('idCliente',             sql.Int,   idCliente           ?? null)
      .input('Abono',                 sql.Money, Abono               ?? null)
      .input('SaldoPendiente',        sql.Money, SaldoPendiente      ?? null)
      .input('Tipo',                  sql.VarChar(50), Tipo           ?? null)
      .input('FechaLimiteApartado',   sql.Date,  FechaLimiteApartado ?? null)
      .input('idTipoLetra',           sql.Int,   idTipoLetra         ?? null)
      .input('DescripcionDeGrabados', sql.VarChar(2000), DescripcionDeGrabados ?? null)
      .input('FechaLimiteEntrega',    sql.Date,  FechaLimiteEntrega  ?? null)
      .input('EnEspera',              sql.Bit,   EnEspera            ?? null)
      .input('updatedBy',             sql.Int,   updatedBy)
      .execute('sp_update_sobre');

    res.json({ id, ...req.body, updatedBy });
    return;
  } catch (err: any) {
    console.error(err);
    if (err.number === 50001) {
      res.status(404).json({ error: err.message });
      return;
    }
    next(err);
  }
};

export const getSobresByEstado: RequestHandler = async (req, res, next) => {
  const idEstado = Number(req.params.idEstado);
  try {
    const result = await pool
      .request()
      .input('idEstado', sql.Int, idEstado)
      .execute('sp_get_sobres_by_estado');

    res.json(result.recordset);
    return;
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getSobresConcluidos: RequestHandler = async (_req, res, next) => {
  try {
    const result = await pool
      .request()
      .execute('sp_get_sobres_concluidos');
    res.json(result.recordset);
    return;
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const generateMensajeRecogerSobre: RequestHandler = async (req, res, next) => {
  const idSobre = Number(req.params.id);
  try {
    const result = await pool
      .request()
      .input('IdSobre', sql.Int, idSobre)
      .execute('sp_generate_mensaje_recoger_sobre');

    if (result.recordset.length === 0) {
      res.status(404).json({ error: 'Sobre no encontrado o estado inválido' });
      return;
    }

    const { Mensaje, Telefono } = result.recordset[0];
    res.json({ mensaje: Mensaje, telefono: Telefono });
    return;

  } catch (err: any) {
    console.error('[generateMensajeRecogerSobre]', err);

    if (err.number === 50001) {
      res.status(404).json({ error: err.message });
      return;
    }
    if (err.number === 50002) {
      res.status(400).json({ error: err.message });
      return;
    }

    // detalle extra para depurar
    res.status(500).json({
      error: 'Error interno al generar mensaje',
      detail: err.message
    });
    return;
  }
};