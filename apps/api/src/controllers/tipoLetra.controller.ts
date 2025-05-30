import { Request, Response } from 'express';
import { pool } from '../db';

export async function createTipoLetra(req: Request, res: Response) {
  const { NombreTipoLetra } = req.body;
  try {
    const result = await pool
      .request()
      .input('NombreTipoLetra', NombreTipoLetra)
      .execute('sp_create_tipo_letra');
    const newId = result.recordset[0].NewTipoLetraId;
    res.status(201).json({ id: newId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'No se pudo crear Tipo de Letra' });
  }
}