import { Router } from 'express';
import { registerUser } from '../controllers/users.controller';
import { getAllUsers } from '../controllers/users.controller';

const router = Router();

router.post('/create', registerUser);

router.get('/', getAllUsers);

export default router;
