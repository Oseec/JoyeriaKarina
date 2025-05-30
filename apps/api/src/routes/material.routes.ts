import { Router } from 'express';
import { getMateriales } from '../controllers/material.controller';
const router = Router();
router.get('/', getMateriales);
export default router;