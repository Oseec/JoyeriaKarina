import { Router } from 'express';
import {
  getAllSobres,
  getSobresConcluidos,
  getSobreById,
  createSobre,
  updateSobre,
  getSobresByEstado,          
  generateMensajeRecogerSobre,
} from '../controllers/sobres.controller';

const router = Router();

router.get('/', getAllSobres);
router.get('/listo', getSobresConcluidos);
router.get('/estado/:idEstado', getSobresByEstado);
router.get('/:id/mensaje',     generateMensajeRecogerSobre);    
router.get('/:id', getSobreById);
router.post('/', createSobre);
router.put('/:id', updateSobre);


// (NO router.delete por decisión de no borrar sobres)

export default router;