import { Router } from 'express';
import { registerController, loginController, refreshController } from '../controllers/authController';

const router = Router();

router.post('/register', registerController);
router.post('/login',    loginController);
router.post('/refresh',  refreshController);

export default router;
