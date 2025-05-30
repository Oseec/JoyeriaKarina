import { RequestHandler } from 'express';
import { pool } from '../db';
import * as sql from 'mssql';

export const registerUser: RequestHandler = async (req, res, next) => {
  const { Username, PasswordHash, FullName, Role } = req.body;
  try {
    const result = await pool.request()
      .input('Username',     sql.NVarChar(50),  Username)
      .input('PasswordHash', sql.NVarChar(200), PasswordHash)
      .input('FullName',     sql.NVarChar(100), FullName    ?? null)
      .input('Role',         sql.NVarChar(20),  Role)
      .execute('sp_register_user');

    const newId = result.recordset[0].NewUserId;
    res.status(201).json({ id: newId });
  } catch (err) {
    console.error(err);
    next(err);
  }
};


export const getAllUsers: RequestHandler = async (_req, res, next) => {
  try {
    const result = await pool
      .request()
      .execute('sp_get_users');
    res.json(result.recordset);
  } catch (err) {
    console.error('[getAllUsers]', err);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};