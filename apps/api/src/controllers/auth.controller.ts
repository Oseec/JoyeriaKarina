import { RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../db';

const SALT_ROUNDS = 10;
const SECRET = process.env.JWT_SECRET!;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN!;

export const register: RequestHandler = async (req, res, next) => {
  const { username, password, fullName, role } = req.body;
  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const result = await pool
      .request()
      .input('Username', username)
      .input('PasswordHash', hash)
      .input('FullName', fullName || null)
      .input('Role', role || 'employee')
      .execute('sp_register_user');

    const newId = result.recordset[0].NewUserId;
    res.status(201).json({ id: newId, username, fullName, role });
  } catch (err: any) {
    if (err.number === 2627) {
      res.status(409).json({ error: 'Username ya existe' });
    } else next(err);
  }
};

export const login: RequestHandler = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const result = await pool
      .request()
      .input('Username', username)
      .execute('sp_get_user_login');

    if (result.recordset.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    const { id: userId, PasswordHash, role } = result.recordset[0];
    const match = await bcrypt.compare(password, PasswordHash);
    if (!match) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ sub: userId, username, role }, SECRET, { expiresIn: EXPIRES_IN });
    res.json({ token, expiresIn: EXPIRES_IN });
  } catch (err) {
    next(err);
  }
};