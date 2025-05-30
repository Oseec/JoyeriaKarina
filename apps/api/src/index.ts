import cors from 'cors';
import express from 'express';
import path from 'path';

import { expressjwt as jwt } from 'express-jwt';
import { connectDB } from './db';
import authRoutes from './routes/auth.routes';
import clientsRoutes from './routes/clients.routes';
import usersRouter from './routes/users.routes';
import sobresRoutes from './routes/sobres.routes';
import ubicacionesRoutes from './routes/ubicaciones.routes';
import tipoArticuloRoutes from './routes/tipoArticulo.routes';
import materialRoutes     from './routes/material.routes';
import articulosRoutes from './routes/articulos.routes';
import estadoRoutes          from './routes/estado.routes';
import tipoReparacionRoutes from './routes/tipoReparacion.routes';
import tipoLetraRoutes from './routes/tipoLetra.routes';




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
app.use('/api/clientes', clientsRoutes);
// …otras rutas CRUD
app.use('/api/sobres', sobresRoutes);

app.use('/api/ubicaciones', ubicacionesRoutes);

app.use('/api/tiposArticulo', tipoArticuloRoutes);

app.use('/api/material', materialRoutes);

app.use('/api/articulos', articulosRoutes);

app.use('/api/estados',  estadoRoutes);

app.use('/api/tiposReparacion',  tipoReparacionRoutes);

app.use('/api/tipoLetra', tipoLetraRoutes);

app.use('/api/users', usersRouter);


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
