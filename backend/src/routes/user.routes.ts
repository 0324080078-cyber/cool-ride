import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../utils/validation.util';
import { updateProfileSchema } from '../utils/validation.util';
import * as userController from '../controllers/user.controller';

const router = Router();

// Routes
router.use(authenticate);
router.get('/profile', userController.getProfile);
router.put('/profile', validate(updateProfileSchema), userController.updateProfile);
router.post('/upload-photo', userController.uploadPhoto);
router.post('/change-password', userController.changePassword);
router.post('/deactivate', userController.deactivateAccount);

export default router;
