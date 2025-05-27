import { RequestHandler } from 'express';

export const requireAdmin: RequestHandler = (req, res, next) => {
  // @ts-ignore: express-jwt añade el payload a req.auth
  const role = (req.auth as any)?.role as string;
  if (role !== 'admin') {
    return res.status(403).json({ error: 'Solo administradores pueden registrar usuarios' });
  }
  next();
};