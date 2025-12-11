import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../utils/validation.util';
import { locationSchema } from '../utils/validation.util';
import * as riderController from '../controllers/rider.controller';

const router = Router();

// Routes
router.use(authenticate);
router.get('/nearby', riderController.getNearbyRiders);
router.post('/location', authorize('rider'), validate(locationSchema), riderController.updateLocation);
router.post('/toggle-status', authorize('rider'), riderController.toggleOnlineStatus);
router.get('/earnings', authorize('rider'), riderController.getEarnings);
router.get('/earnings/daily', authorize('rider'), riderController.getDailyEarnings);
router.put('/vehicle', authorize('rider'), riderController.updateVehicle);

export default router;
