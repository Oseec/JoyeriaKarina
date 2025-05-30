import { Router } from 'express';
import { getEstados } from '../controllers/estado.controller';

const router = Router();
router.get('/', getEstados);
export default router;
