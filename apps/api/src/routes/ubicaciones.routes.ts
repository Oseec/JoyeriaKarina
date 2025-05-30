import { Router } from 'express';
import { getUbicaciones } from '../controllers/ubicaciones.controller';

const router = Router();
router.get('/', getUbicaciones);
export default router;