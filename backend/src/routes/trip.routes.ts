import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// Placeholder controller functions
const createTrip = async (req: any, res: any) => {
  res.status(201).json({
    status: 'success',
    message: 'Create trip endpoint - to be implemented',
  });
};

const getEstimate = async (req: any, res: any) => {
  res.status(200).json({
    status: 'success',
    message: 'Get fare estimate endpoint - to be implemented',
  });
};

const getTripDetails = async (req: any, res: any) => {
  res.status(200).json({
    status: 'success',
    message: 'Get trip details endpoint - to be implemented',
  });
};

const updateTripStatus = async (req: any, res: any) => {
  res.status(200).json({
    status: 'success',
    message: 'Update trip status endpoint - to be implemented',
  });
};

const cancelTrip = async (req: any, res: any) => {
  res.status(200).json({
    status: 'success',
    message: 'Cancel trip endpoint - to be implemented',
  });
};

const rateTrip = async (req: any, res: any) => {
  res.status(200).json({
    status: 'success',
    message: 'Rate trip endpoint - to be implemented',
  });
};

// Routes
router.use(authenticate);
router.post('/estimate', getEstimate);
router.post('/', authorize('passenger'), createTrip);
router.get('/:tripId', getTripDetails);
router.patch('/:tripId/status', updateTripStatus);
router.post('/:tripId/cancel', cancelTrip);
router.post('/:tripId/rate', rateTrip);

export default router;
