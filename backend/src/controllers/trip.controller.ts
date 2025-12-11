import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/error.middleware';
import Trip from '../models/Trip';
import Passenger from '../models/Passenger';
import Rider from '../models/Rider';
import User from '../models/User';
import Vehicle from '../models/Vehicle';
import {
  calculateDistance,
  estimateDuration,
  generateTransactionRef,
} from '../utils/helpers.util';
import { getFareEstimate } from '../utils/pricing.util';

/**
 * Get fare estimate
 */
export const getEstimate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { pickupLocation, dropoffLocation } = req.body;

    // Calculate distance
    const distance = calculateDistance(
      pickupLocation.lat,
      pickupLocation.lng,
      dropoffLocation.lat,
      dropoffLocation.lng
    );

    // Estimate duration
    const duration = estimateDuration(distance);

    // Get fare estimate
    const estimate = getFareEstimate(distance, duration);

    res.status(200).json({
      status: 'success',
      data: {
        ...estimate,
        distance,
        duration,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new trip
 */
export const createTrip = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      pickupLocation,
      pickupAddress,
      dropoffLocation,
      dropoffAddress,
      estimatedFare,
      paymentMethod,
    } = req.body;

    // Get passenger
    const passenger = await Passenger.findOne({
      where: { userId: req.userId },
    });

    if (!passenger) {
      return next(new AppError('Passenger profile not found', 404));
    }

    // Calculate if it's day or night rate
    const now = new Date();
    const hour = now.getHours();
    const isDayRate = hour >= 6 && hour < 22;

    // Create trip
    const trip = await Trip.create({
      passengerId: passenger.id,
      pickupLocation,
      pickupAddress,
      dropoffLocation,
      dropoffAddress,
      estimatedFare,
      isDayRate,
      paymentMethod: paymentMethod || 'cash',
      paymentStatus: 'pending',
      status: 'pending',
    });

    // TODO: Find and notify nearby riders via WebSocket

    res.status(201).json({
      status: 'success',
      message: 'Trip created successfully. Finding a rider...',
      data: {
        tripId: trip.id,
        status: trip.status,
        estimatedFare: trip.estimatedFare,
        pickupAddress: trip.pickupAddress,
        dropoffAddress: trip.dropoffAddress,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get trip details
 */
export const getTripDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { tripId } = req.params;

    const trip = await Trip.findByPk(tripId, {
      include: [
        {
          model: Passenger,
          as: 'passenger',
          include: [{ model: User, as: 'user' }],
        },
        {
          model: Rider,
          as: 'rider',
          include: [
            { model: User, as: 'user' },
            { model: Vehicle, as: 'vehicle' },
          ],
        },
      ],
    });

    if (!trip) {
      return next(new AppError('Trip not found', 404));
    }

    // Check if user has access to this trip
    const passenger = await Passenger.findOne({
      where: { userId: req.userId },
    });
    const rider = await Rider.findOne({
      where: { userId: req.userId },
    });

    const hasAccess =
      req.userType === 'admin' ||
      (passenger && trip.passengerId === passenger.id) ||
      (rider && trip.riderId === rider.id);

    if (!hasAccess) {
      return next(new AppError('You do not have access to this trip', 403));
    }

    res.status(200).json({
      status: 'success',
      data: trip,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update trip status
 */
export const updateTripStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { tripId } = req.params;
    const { status, riderId } = req.body;

    const trip = await Trip.findByPk(tripId);

    if (!trip) {
      return next(new AppError('Trip not found', 404));
    }

    // Validate status transitions
    const validTransitions: Record<string, string[]> = {
      pending: ['accepted', 'cancelled'],
      accepted: ['on-way', 'cancelled'],
      'on-way': ['arrived', 'cancelled'],
      arrived: ['in-progress', 'cancelled'],
      'in-progress': ['completed'],
    };

    if (!validTransitions[trip.status]?.includes(status)) {
      return next(new AppError('Invalid status transition', 400));
    }

    // Update trip
    const updates: any = { status };

    if (status === 'accepted' && riderId) {
      updates.riderId = riderId;
    }

    if (status === 'in-progress') {
      updates.startTime = new Date();
    }

    if (status === 'completed') {
      updates.endTime = new Date();
      updates.actualFare = trip.estimatedFare; // Can be adjusted based on actual distance
    }

    await trip.update(updates);

    // TODO: Notify passenger/rider via WebSocket

    res.status(200).json({
      status: 'success',
      message: 'Trip status updated successfully',
      data: {
        tripId: trip.id,
        status: trip.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cancel trip
 */
export const cancelTrip = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { tripId } = req.params;
    const { reason } = req.body;

    const trip = await Trip.findByPk(tripId);

    if (!trip) {
      return next(new AppError('Trip not found', 404));
    }

    // Check if trip can be cancelled
    if (['completed', 'cancelled'].includes(trip.status)) {
      return next(new AppError('Trip cannot be cancelled', 400));
    }

    // Get user profile
    const passenger = await Passenger.findOne({
      where: { userId: req.userId },
    });
    const rider = await Rider.findOne({
      where: { userId: req.userId },
    });

    // Determine who is cancelling
    const cancelledBy = passenger?.id || rider?.id || req.userId;

    await trip.update({
      status: 'cancelled',
      cancelledBy,
      cancellationReason: reason,
    });

    // TODO: Apply cancellation fees if applicable
    // TODO: Notify other party via WebSocket

    res.status(200).json({
      status: 'success',
      message: 'Trip cancelled successfully',
      data: {
        tripId: trip.id,
        status: trip.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Rate a trip
 */
export const rateTrip = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { tripId } = req.params;
    const { rating, comment } = req.body;

    const trip = await Trip.findByPk(tripId);

    if (!trip) {
      return next(new AppError('Trip not found', 404));
    }

    if (trip.status !== 'completed') {
      return next(new AppError('Can only rate completed trips', 400));
    }

    // Get user profile
    const passenger = await Passenger.findOne({
      where: { userId: req.userId },
    });
    const rider = await Rider.findOne({
      where: { userId: req.userId },
    });

    // Determine who is rating
    if (passenger && trip.passengerId === passenger.id) {
      // Passenger rating rider
      if (trip.riderRating) {
        return next(new AppError('You have already rated this trip', 400));
      }

      await trip.update({ riderRating: rating });

      // Update rider's overall rating
      if (trip.riderId) {
        const riderProfile = await Rider.findByPk(trip.riderId);
        if (riderProfile) {
          const trips = await Trip.count({
            where: { riderId: trip.riderId, status: 'completed' },
          });
          const totalRating = await Trip.sum('riderRating', {
            where: { riderId: trip.riderId, status: 'completed' },
          });
          const newRating = (totalRating + rating) / (trips + 1);
          await riderProfile.update({ rating: newRating });
        }
      }
    } else if (rider && trip.riderId === rider.id) {
      // Rider rating passenger
      if (trip.passengerRating) {
        return next(new AppError('You have already rated this trip', 400));
      }

      await trip.update({ passengerRating: rating });

      // Update passenger's overall rating
      const passengerProfile = await Passenger.findByPk(trip.passengerId);
      if (passengerProfile) {
        const trips = await Trip.count({
          where: { passengerId: trip.passengerId, status: 'completed' },
        });
        const totalRating = await Trip.sum('passengerRating', {
          where: { passengerId: trip.passengerId, status: 'completed' },
        });
        const newRating = (totalRating + rating) / (trips + 1);
        await passengerProfile.update({ rating: newRating });
      }
    } else {
      return next(new AppError('You are not authorized to rate this trip', 403));
    }

    res.status(200).json({
      status: 'success',
      message: 'Trip rated successfully',
      data: {
        tripId: trip.id,
        rating,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get trip history for user
 */
export const getTripHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    // Get user profile
    const passenger = await Passenger.findOne({
      where: { userId: req.userId },
    });
    const rider = await Rider.findOne({
      where: { userId: req.userId },
    });

    let trips;
    let total;

    if (passenger) {
      trips = await Trip.findAll({
        where: { passengerId: passenger.id },
        include: [
          {
            model: Rider,
            as: 'rider',
            include: [
              { model: User, as: 'user' },
              { model: Vehicle, as: 'vehicle' },
            ],
          },
        ],
        order: [['createdAt', 'DESC']],
        limit,
        offset,
      });

      total = await Trip.count({
        where: { passengerId: passenger.id },
      });
    } else if (rider) {
      trips = await Trip.findAll({
        where: { riderId: rider.id },
        include: [
          {
            model: Passenger,
            as: 'passenger',
            include: [{ model: User, as: 'user' }],
          },
        ],
        order: [['createdAt', 'DESC']],
        limit,
        offset,
      });

      total = await Trip.count({
        where: { riderId: rider.id },
      });
    } else {
      return next(new AppError('Profile not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: trips,
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
