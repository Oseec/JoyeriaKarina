import { Router } from 'express';
import { createTipoLetra } from '../controllers/tipoLetra.controller';

const router = Router();

// POST /api/tipoLetra/create
router.post('/create', createTipoLetra);

export default router;
