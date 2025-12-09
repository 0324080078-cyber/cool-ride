import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import * as paymentController from '../controllers/payment.controller';

const router = Router();

// Routes
router.use(authenticate);
router.post('/initiate', paymentController.initiatePayment);
router.post('/verify', paymentController.verifyPayment);
router.get('/history', paymentController.getPaymentHistory);
router.post('/refund', paymentController.processRefund);
router.get('/methods', paymentController.getPaymentMethods);

export default router;
