import { Router } from 'express';

const router = Router();



import { createTipoReparacion } from '../controllers/tipoReparacion.controller';

router.post('/create', createTipoReparacion);

export default router;