import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/error.middleware';
import Rider from '../models/Rider';
import Trip from '../models/Trip';
import Vehicle from '../models/Vehicle';
import { calculateDistance } from '../utils/helpers.util';

/**
 * Get nearby riders
 */
export const getNearbyRiders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { lat, lng, radius = 5 } = req.query;

    if (!lat || !lng) {
      return next(new AppError('Latitude and longitude are required', 400));
    }

    // Get online riders
    const riders = await Rider.findAll({
      where: {
        isOnline: true,
        status: 'approved',
      },
      include: [{ model: Vehicle, as: 'vehicle' }],
    });

    // Filter by distance and add distance field
    const nearbyRiders = riders
      .map((rider) => {
        if (!rider.currentLocation) return null;

        const location = rider.currentLocation as any;
        const distance = calculateDistance(
          parseFloat(lat as string),
          parseFloat(lng as string),
          location.lat,
          location.lng
        );

        if (distance <= parseFloat(radius as string)) {
          return {
            id: rider.id,
            fullName: rider.fullName,
            rating: rider.rating,
            totalTrips: rider.totalTrips,
            vehicle: rider.get('vehicle'),
            location: rider.currentLocation,
            distance,
          };
        }

        return null;
      })
      .filter((rider) => rider !== null)
      .sort((a: any, b: any) => a.distance - b.distance);

    res.status(200).json({
      status: 'success',
      data: nearbyRiders,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update rider location
 */
export const updateLocation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { lat, lng } = req.body;

    const rider = await Rider.findOne({
      where: { userId: req.userId },
    });

    if (!rider) {
      return next(new AppError('Rider profile not found', 404));
    }

    await rider.update({
      currentLocation: { lat, lng, updatedAt: new Date() },
    });

    // TODO: Broadcast location update via WebSocket

    res.status(200).json({
      status: 'success',
      message: 'Location updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle online/offline status
 */
export const toggleOnlineStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { isOnline } = req.body;

    const rider = await Rider.findOne({
      where: { userId: req.userId },
    });

    if (!rider) {
      return next(new AppError('Rider profile not found', 404));
    }

    if (rider.status !== 'approved') {
      return next(
        new AppError(
          'Your account must be approved before you can go online',
          403
        )
      );
    }

    await rider.update({ isOnline });

    res.status(200).json({
      status: 'success',
      message: `You are now ${isOnline ? 'online' : 'offline'}`,
      data: {
        isOnline: rider.isOnline,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get rider earnings
 */
export const getEarnings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { startDate, endDate } = req.query;

    const rider = await Rider.findOne({
      where: { userId: req.userId },
    });

    if (!rider) {
      return next(new AppError('Rider profile not found', 404));
    }

    // Build query filters
    const whereClause: any = {
      riderId: rider.id,
      status: 'completed',
      paymentStatus: 'completed',
    };

    if (startDate) {
      whereClause.createdAt = {
        ...whereClause.createdAt,
        $gte: new Date(startDate as string),
      };
    }

    if (endDate) {
      whereClause.createdAt = {
        ...whereClause.createdAt,
        $lte: new Date(endDate as string),
      };
    }

    // Get trips and calculate earnings
    const trips = await Trip.findAll({
      where: whereClause,
    });

    const totalFares = trips.reduce(
      (sum, trip) => sum + parseFloat(trip.actualFare?.toString() || '0'),
      0
    );

    const commissionRate = 0.2; // 20% commission
    const commission = totalFares * commissionRate;
    const earnings = totalFares - commission;

    res.status(200).json({
      status: 'success',
      data: {
        totalFares,
        commission,
        earnings,
        trips: trips.length,
        averagePerTrip: trips.length > 0 ? earnings / trips.length : 0,
        breakdown: {
          fares: totalFares,
          platformFee: -commission,
          bonuses: 0, // TODO: Implement bonus system
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get daily earnings summary
 */
export const getDailyEarnings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const rider = await Rider.findOne({
      where: { userId: req.userId },
    });

    if (!rider) {
      return next(new AppError('Rider profile not found', 404));
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const trips = await Trip.findAll({
      where: {
        riderId: rider.id,
        status: 'completed',
        createdAt: {
          $gte: today,
          $lt: tomorrow,
        },
      },
    });

    const totalFares = trips.reduce(
      (sum, trip) => sum + parseFloat(trip.actualFare?.toString() || '0'),
      0
    );

    const commission = totalFares * 0.2;
    const earnings = totalFares - commission;

    res.status(200).json({
      status: 'success',
      data: {
        date: today.toISOString().split('T')[0],
        trips: trips.length,
        earnings,
        totalFares,
        commission,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update rider vehicle information
 */
export const updateVehicle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      vehicleType,
      color,
      plateNumber,
      capacity,
      registrationDoc,
      insuranceDoc,
      insuranceExpiry,
    } = req.body;

    const rider = await Rider.findOne({
      where: { userId: req.userId },
    });

    if (!rider) {
      return next(new AppError('Rider profile not found', 404));
    }

    // Find or create vehicle
    let vehicle = await Vehicle.findOne({
      where: { riderId: rider.id },
    });

    const vehicleData: any = {};
    if (vehicleType) vehicleData.vehicleType = vehicleType;
    if (color) vehicleData.color = color;
    if (plateNumber) vehicleData.plateNumber = plateNumber;
    if (capacity) vehicleData.capacity = capacity;
    if (registrationDoc) vehicleData.registrationDoc = registrationDoc;
    if (insuranceDoc) vehicleData.insuranceDoc = insuranceDoc;
    if (insuranceExpiry) vehicleData.insuranceExpiry = insuranceExpiry;

    if (vehicle) {
      await vehicle.update(vehicleData);
    } else {
      vehicleData.riderId = rider.id;
      vehicle = await Vehicle.create(vehicleData);
    }

    res.status(200).json({
      status: 'success',
      message: 'Vehicle information updated successfully',
      data: vehicle,
    });
  } catch (error) {
    next(error);
  }
};
