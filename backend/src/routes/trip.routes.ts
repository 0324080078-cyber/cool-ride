import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../utils/validation.util';
import {
  createTripSchema,
  estimateSchema,
  ratingSchema,
} from '../utils/validation.util';
import * as tripController from '../controllers/trip.controller';

const router = Router();

// Routes
router.use(authenticate);
router.post('/estimate', validate(estimateSchema), tripController.getEstimate);
router.post('/', authorize('passenger'), validate(createTripSchema), tripController.createTrip);
router.get('/history', tripController.getTripHistory);
router.get('/:tripId', tripController.getTripDetails);
router.patch('/:tripId/status', tripController.updateTripStatus);
router.post('/:tripId/cancel', tripController.cancelTrip);
router.post('/:tripId/rate', validate(ratingSchema), tripController.rateTrip);

export default router;
