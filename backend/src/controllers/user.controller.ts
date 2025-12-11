import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/error.middleware';
import User from '../models/User';
import Passenger from '../models/Passenger';
import Rider from '../models/Rider';
import Vehicle from '../models/Vehicle';

/**
 * Get user profile
 */
export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findByPk(req.userId, {
      include: [
        { model: Passenger, as: 'passengerProfile' },
        {
          model: Rider,
          as: 'riderProfile',
          include: [{ model: Vehicle, as: 'vehicle' }],
        },
      ],
    });

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Get appropriate profile
    let profile = null;
    if (user.userType === 'passenger') {
      profile = user.get('passengerProfile');
    } else if (user.userType === 'rider') {
      profile = user.get('riderProfile');
    }

    res.status(200).json({
      status: 'success',
      data: {
        id: user.id,
        phone: user.phone,
        email: user.email,
        userType: user.userType,
        isVerified: user.isVerified,
        isActive: user.isActive,
        profile,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      fullName,
      email,
      emergencyContact,
      emergencyContactName,
      preferredPayment,
    } = req.body;

    const user = await User.findByPk(req.userId);

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Update user email if provided
    if (email && email !== user.email) {
      await user.update({ email });
    }

    // Update profile based on user type
    if (user.userType === 'passenger') {
      const passenger = await Passenger.findOne({
        where: { userId: req.userId },
      });

      if (passenger) {
        const updates: any = {};
        if (fullName) updates.fullName = fullName;
        if (emergencyContact) updates.emergencyContact = emergencyContact;
        if (emergencyContactName)
          updates.emergencyContactName = emergencyContactName;
        if (preferredPayment) updates.preferredPayment = preferredPayment;

        await passenger.update(updates);
      }
    } else if (user.userType === 'rider') {
      const rider = await Rider.findOne({
        where: { userId: req.userId },
      });

      if (rider && fullName) {
        await rider.update({ fullName });
      }
    }

    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Upload profile photo
 */
export const uploadPhoto = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // TODO: Implement file upload with multer and cloud storage
    // For now, just a placeholder

    res.status(200).json({
      status: 'success',
      message: 'Photo upload endpoint - to be implemented with file storage',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Change password
 */
export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return next(new AppError('Current password is incorrect', 400));
    }

    // Update password
    await user.update({ password: newPassword });

    res.status(200).json({
      status: 'success',
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Deactivate account
 */
export const deactivateAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findByPk(req.userId);

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    await user.update({ isActive: false });

    res.status(200).json({
      status: 'success',
      message: 'Account deactivated successfully',
    });
  } catch (error) {
    next(error);
  }
};
