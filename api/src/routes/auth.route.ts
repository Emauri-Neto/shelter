import { Router } from 'express';
import {
    loginController,
    logoutController,
    refreshController,
    registerController,
    resetPasswordController,
    sendPasswordResetController,
    verifyEmailController
} from '../controllers/auth.controller';

const authRoutes = Router();

// prefix: /auth

authRoutes.post('/register', registerController);
authRoutes.post('/login', loginController);
authRoutes.get('/refresh', refreshController);
authRoutes.get('/logout', logoutController);
authRoutes.get('/email/verify/:code', verifyEmailController);
authRoutes.post('/password/forgot', sendPasswordResetController);
authRoutes.post('/password/reset', resetPasswordController);

export default authRoutes;
