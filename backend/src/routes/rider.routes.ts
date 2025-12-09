import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// Placeholder controller functions
const getNearbyRiders = async (req: any, res: any) => {
  res.status(200).json({
    status: 'success',
    message: 'Get nearby riders endpoint - to be implemented',
  });
};

const updateLocation = async (req: any, res: any) => {
  res.status(200).json({
    status: 'success',
    message: 'Update rider location endpoint - to be implemented',
  });
};

const toggleOnlineStatus = async (req: any, res: any) => {
  res.status(200).json({
    status: 'success',
    message: 'Toggle online status endpoint - to be implemented',
  });
};

const getEarnings = async (req: any, res: any) => {
  res.status(200).json({
    status: 'success',
    message: 'Get earnings endpoint - to be implemented',
  });
};

// Routes
router.use(authenticate);
router.get('/nearby', getNearbyRiders);
router.post('/location', authorize('rider'), updateLocation);
router.post('/toggle-status', authorize('rider'), toggleOnlineStatus);
router.get('/earnings', authorize('rider'), getEarnings);

export default router;
