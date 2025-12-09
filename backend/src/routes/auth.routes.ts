import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../utils/validation.util';
import {
  registerSchema,
  loginSchema,
  verifyOtpSchema,
} from '../utils/validation.util';
import * as authController from '../controllers/auth.controller';

const router = Router();

// Routes
router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/verify-otp', validate(verifyOtpSchema), authController.verifyOtp);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authenticate, authController.logout);
router.post('/resend-otp', authController.resendOtp);

export default router;
