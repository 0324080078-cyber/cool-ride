import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/error.middleware';
import Trip from '../models/Trip';
import Passenger from '../models/Passenger';
import { generateTransactionRef } from '../utils/helpers.util';

/**
 * Initiate payment for a trip
 */
export const initiatePayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { tripId, amount, method, provider } = req.body;

    // Validate trip
    const trip = await Trip.findByPk(tripId);
    if (!trip) {
      return next(new AppError('Trip not found', 404));
    }

    // Check if trip is completed
    if (trip.status !== 'completed') {
      return next(new AppError('Can only pay for completed trips', 400));
    }

    // Check if already paid
    if (trip.paymentStatus === 'completed') {
      return next(new AppError('Trip has already been paid', 400));
    }

    // Verify user owns this trip
    const passenger = await Passenger.findOne({
      where: { userId: req.userId },
    });

    if (!passenger || trip.passengerId !== passenger.id) {
      return next(new AppError('Unauthorized to pay for this trip', 403));
    }

    // Generate transaction reference
    const transactionRef = generateTransactionRef();

    // Handle different payment methods
    if (method === 'cash') {
      // Cash payment - mark as completed
      await trip.update({
        paymentMethod: 'cash',
        paymentStatus: 'completed',
      });

      return res.status(200).json({
        status: 'success',
        message: 'Cash payment recorded',
        data: {
          tripId: trip.id,
          transactionRef,
          paymentMethod: 'cash',
          amount: trip.actualFare,
        },
      });
    } else if (method === 'momo') {
      // Mobile Money payment
      // TODO: Integrate with Mobile Money API (MTN MoMo, Vodafone Cash, etc.)
      
      return res.status(200).json({
        status: 'success',
        message: 'Mobile Money payment initiated',
        data: {
          tripId: trip.id,
          transactionRef,
          paymentMethod: 'momo',
          provider,
          amount: trip.actualFare,
          // TODO: Add payment link or instructions
          instructions: 'Dial *XXX# to complete payment',
        },
      });
    } else if (method === 'card' || method === 'flutterwave') {
      // Flutterwave payment
      // TODO: Integrate with Flutterwave API
      
      return res.status(200).json({
        status: 'success',
        message: 'Card payment initiated',
        data: {
          tripId: trip.id,
          transactionRef,
          paymentMethod: 'card',
          amount: trip.actualFare,
          // TODO: Add Flutterwave payment link
          paymentUrl: 'https://checkout.flutterwave.com/...',
        },
      });
    } else {
      return next(new AppError('Invalid payment method', 400));
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Verify payment status
 */
export const verifyPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { transactionId, tripId } = req.body;

    const trip = await Trip.findByPk(tripId);
    if (!trip) {
      return next(new AppError('Trip not found', 404));
    }

    // TODO: Verify with payment gateway (Flutterwave, Mobile Money API)
    // For now, simulate verification
    
    // In production, you would:
    // 1. Call Flutterwave API to verify transaction
    // 2. Check Mobile Money transaction status
    // 3. Update trip payment status based on result

    const isPaymentSuccessful = true; // Placeholder

    if (isPaymentSuccessful) {
      await trip.update({
        paymentStatus: 'completed',
      });

      return res.status(200).json({
        status: 'success',
        message: 'Payment verified successfully',
        data: {
          tripId: trip.id,
          transactionId,
          paymentStatus: 'completed',
        },
      });
    } else {
      await trip.update({
        paymentStatus: 'failed',
      });

      return res.status(400).json({
        status: 'error',
        message: 'Payment verification failed',
        data: {
          tripId: trip.id,
          transactionId,
          paymentStatus: 'failed',
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get payment history
 */
export const getPaymentHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    // Get passenger profile
    const passenger = await Passenger.findOne({
      where: { userId: req.userId },
    });

    if (!passenger) {
      return next(new AppError('Passenger profile not found', 404));
    }

    // Get payment history (completed trips)
    const trips = await Trip.findAll({
      where: {
        passengerId: passenger.id,
        status: 'completed',
      },
      attributes: [
        'id',
        'pickupAddress',
        'dropoffAddress',
        'actualFare',
        'paymentMethod',
        'paymentStatus',
        'createdAt',
        'endTime',
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    const total = await Trip.count({
      where: {
        passengerId: passenger.id,
        status: 'completed',
      },
    });

    // Calculate totals
    const totalPaid = trips
      .filter((trip) => trip.paymentStatus === 'completed')
      .reduce((sum, trip) => sum + parseFloat(trip.actualFare?.toString() || '0'), 0);

    const totalPending = trips
      .filter((trip) => trip.paymentStatus === 'pending')
      .reduce((sum, trip) => sum + parseFloat(trip.actualFare?.toString() || '0'), 0);

    res.status(200).json({
      status: 'success',
      data: {
        payments: trips,
        summary: {
          totalPaid,
          totalPending,
          totalTrips: total,
        },
      },
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Process refund
 */
export const processRefund = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { tripId, reason } = req.body;

    const trip = await Trip.findByPk(tripId);
    if (!trip) {
      return next(new AppError('Trip not found', 404));
    }

    // Check if trip is cancelled
    if (trip.status !== 'cancelled') {
      return next(new AppError('Can only refund cancelled trips', 400));
    }

    // Check if payment was made
    if (trip.paymentStatus !== 'completed') {
      return next(new AppError('No payment to refund', 400));
    }

    // TODO: Process refund through payment gateway
    // For now, just update status

    await trip.update({
      paymentStatus: 'pending', // or add a 'refunded' status
    });

    res.status(200).json({
      status: 'success',
      message: 'Refund initiated successfully',
      data: {
        tripId: trip.id,
        amount: trip.actualFare,
        reason,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get payment methods
 */
export const getPaymentMethods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const passenger = await Passenger.findOne({
      where: { userId: req.userId },
    });

    if (!passenger) {
      return next(new AppError('Passenger profile not found', 404));
    }

    // Available payment methods
    const paymentMethods = [
      {
        type: 'cash',
        name: 'Cash',
        enabled: true,
        default: passenger.preferredPayment === 'cash',
      },
      {
        type: 'momo',
        name: 'Mobile Money',
        enabled: true,
        default: passenger.preferredPayment === 'momo',
        providers: ['MTN MoMo', 'Vodafone Cash', 'AirtelTigo'],
      },
      {
        type: 'card',
        name: 'Credit/Debit Card',
        enabled: true,
        default: passenger.preferredPayment === 'card',
        note: 'Powered by Flutterwave',
      },
    ];

    res.status(200).json({
      status: 'success',
      data: paymentMethods,
    });
  } catch (error) {
    next(error);
  }
};
