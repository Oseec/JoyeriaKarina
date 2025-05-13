import express from 'express';
import clientsRoutes from './routes/clients.routes';
import { connectDB, pool } from './db';

const app = express();
app.use(express.json());

app.get('/ping', async (_req, res) => {
  await connectDB();
  const result = await pool.request().query('SELECT 1 + 1 AS result');
  res.json(result.recordset);
});

// Conecta a BD y después pasa al router
app.use(
  '/api/clients',
  async (req, _res, next) => { 
    await connectDB();
    next();
  },
  clientsRoutes
);

const port = Number(process.env.PORT) || 4000;
app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`);
});
