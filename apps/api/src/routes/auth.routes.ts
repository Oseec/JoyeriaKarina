import { Router } from 'express';
import { login } from '../controllers/auth.controller';
import { register } from '../controllers/auth.controller';
import { expressjwt } from 'express-jwt';
import { requireAdmin } from '../middleware/admin.middleware';

const router = Router();

// Login público
router.post('/login', login);

// Registro protegido: solo admin
router.post(
  '/register',
  expressjwt({ secret: process.env.JWT_SECRET!, algorithms: ['HS256'] }),
  requireAdmin,
  register
);

export default router;