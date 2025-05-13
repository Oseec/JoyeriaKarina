// src/controllers/clients.controller.ts
import { Request, Response , NextFunction, RequestHandler} from 'express';
import { pool } from '../db';

export const getAllClients: RequestHandler = async (req, res, next) => {
  try {
    const result = await pool
      .request()
      .query('SELECT id, NombreCliente, NumeroDeCedula, NumeroDeTelefono FROM Cliente');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
}

export const getClientById: RequestHandler = async (req, res, next) => {
  const id = Number(req.params.id);
  try {
    const result = await pool
      .request()
      .input('id', id)
      .query('SELECT id, NombreCliente, NumeroDeCedula, NumeroDeTelefono FROM Cliente WHERE id = @id');
    if (result.recordset.length === 0) {
      res.status(404).json({ error: 'Cliente no encontrado' });
      return;
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener el cliente' });
  }
}

export const createClient: RequestHandler = async (req, res, next) => {
  const { NombreCliente, NumeroDeCedula, NumeroDeTelefono } = req.body;
  try {
    const result = await pool
      .request()
      .input('NombreCliente', NombreCliente)
      .input('NumeroDeCedula', NumeroDeCedula)
      .input('NumeroDeTelefono', NumeroDeTelefono)
      .query(`
        INSERT INTO Cliente (NombreCliente, NumeroDeCedula, NumeroDeTelefono)
        VALUES (@NombreCliente, @NumeroDeCedula, @NumeroDeTelefono);
        SELECT SCOPE_IDENTITY() AS id;
      `);
    const newId = result.recordset[0].id;
    res.status(201).json({ id: newId, NombreCliente, NumeroDeCedula, NumeroDeTelefono });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear cliente' });
  }
}

export const updateClient: RequestHandler = async (req, res, next) => {
  const id = Number(req.params.id);
  const { NombreCliente, NumeroDeCedula, NumeroDeTelefono } = req.body;
  try {
    const result = await pool
      .request()
      .input('id', id)
      .input('NombreCliente', NombreCliente)
      .input('NumeroDeCedula', NumeroDeCedula)
      .input('NumeroDeTelefono', NumeroDeTelefono)
      .query(`
        UPDATE Cliente
        SET NombreCliente = @NombreCliente,
            NumeroDeCedula = @NumeroDeCedula,
            NumeroDeTelefono = @NumeroDeTelefono
        WHERE id = @id;
      `);
    if (result.rowsAffected[0] === 0) {
      res.status(404).json({ error: 'Cliente no encontrado' });
      return;
    }
    res.json({ id, NombreCliente, NumeroDeCedula, NumeroDeTelefono });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar cliente' });
  }
}

export const deleteClient: RequestHandler = async (req, res, next) => {
  const id = Number(req.params.id);
  try {
    const result = await pool
      .request()
      .input('id', id)
      .query('DELETE FROM Cliente WHERE id = @id');
    if (result.rowsAffected[0] === 0) {
      res.status(404).json({ error: 'Cliente no encontrado' });
      return;
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar cliente' });
  }
}