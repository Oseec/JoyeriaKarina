import cors from 'cors';
import express from 'express';
import path from 'path';

import { expressjwt as jwt } from 'express-jwt';
import { connectDB } from './db';
import authRoutes from './routes/auth.routes';
import clientsRoutes from './routes/clients.routes';
import sobremRoutes from './routes/sobres.routes';
// …otras rutas

const app = express();
app.use(cors()); 
app.use(express.json());
app.use(
  express.static(path.resolve(__dirname, '../../../web'))
);

// Siempre conectar DB
app.use(async (_req, _res, next) => {
  await connectDB();
  next();
});

// Rutas públicas de auth
app.use('/api/auth', authRoutes);

// Middleware para proteger todo lo que venga tras /api
app.use(
  '/api',
  jwt({ secret: process.env.JWT_SECRET!, algorithms: ['HS256'] }),
  (req, _res, next) => {
    // @ts-ignore
    req.userId = req.auth.sub;
    next();
  }
);

// Rutas protegidas
app.use('/api/clients', clientsRoutes);
// …otras rutas CRUD
app.use('/api/sobres', sobremRoutes);

// Error handler
app.use((err: any, _req: any, res: any, _next: any) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ error: 'Token inválido o faltante' });
  } else {
    console.error(err);
    res.status(500).json({ error: 'Error interno' });
  }
});

const port = Number(process.env.PORT) || 4000;
app.listen(port, () => console.log(`API escuchando en http://localhost:${port}`));
