import { Router } from 'express';
import { getTiposArticulo } from '../controllers/tipoArticulo.controller';
const router = Router();
router.get('/', getTiposArticulo);
export default router;
