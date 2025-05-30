import { Router } from 'express';
import { createArticulo, /* otros handlers */ } from '../controllers/articulos.controller';
import { expressjwt } from 'express-jwt';

const router = Router();

router.post(
  '/', 
  expressjwt({ secret: process.env.JWT_SECRET!, algorithms: ['HS256'] }), 
  createArticulo
);

// … tus GET/PUT/DELETE de artículos …

export default router;
