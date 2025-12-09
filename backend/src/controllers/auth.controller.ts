import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../middleware/error.middleware';
import User from '../models/User';
import Passenger from '../models/Passenger';
import Rider from '../models/Rider';
import { getRedisClient } from '../config/redis';
import { generateOTP, formatPhoneNumber } from '../utils/helpers.util';

/**
 * Register a new user (passenger or rider)
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { phone, email, password, userType, fullName } = req.body;

    // Format phone number
    const formattedPhone = formatPhoneNumber(phone);

    // Check if user already exists
    const existingUser = await User.findOne({
      where: { phone: formattedPhone },
    });

    if (existingUser) {
      return next(new AppError('User with this phone number already exists', 409));
    }

    // Create user
    const user = await User.create({
      phone: formattedPhone,
      email,
      password,
      userType,
      isVerified: false,
    });

    // Create profile based on user type
    if (userType === 'passenger') {
      await Passenger.create({
        userId: user.id,
        fullName,
      });
    } else if (userType === 'rider') {
      await Rider.create({
        userId: user.id,
        fullName,
        status: 'pending',
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = Date.now() + parseInt(process.env.OTP_EXPIRES_IN || '300000', 10);

    // Store OTP in Redis
    try {
      const redisClient = getRedisClient();
      await redisClient.setEx(
        `otp:${formattedPhone}`,
        300, // 5 minutes
        JSON.stringify({ otp, expiry: otpExpiry })
      );
    } catch (redisError) {
      console.error('Redis error:', redisError);
      // Continue without Redis - OTP will be in response for development
    }

    // TODO: Send OTP via SMS (Twilio)
    // For now, return OTP in response (remove in production)
    const response: any = {
      status: 'success',
      message: 'User registered successfully. Please verify your phone number.',
      data: {
        userId: user.id,
        phone: formattedPhone,
        userType: user.userType,
      },
    };

    // In development, include OTP in response
    if (process.env.NODE_ENV === 'development') {
      response.data.otp = otp;
    }

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { phone, password } = req.body;

    // Format phone number
    const formattedPhone = formatPhoneNumber(phone);

    // Find user
    const user = await User.findOne({
      where: { phone: formattedPhone },
      include: [
        { model: Passenger, as: 'passengerProfile' },
        { model: Rider, as: 'riderProfile' },
      ],
    });

    if (!user) {
      return next(new AppError('Invalid phone number or password', 401));
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return next(new AppError('Invalid phone number or password', 401));
    }

    // Check if user is active
    if (!user.isActive) {
      return next(new AppError('Your account has been deactivated', 403));
    }

    // Generate tokens
    const jwtSecret = process.env.JWT_SECRET;
    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

    if (!jwtSecret || !jwtRefreshSecret) {
      return next(new AppError('Server configuration error', 500));
    }

    const token = jwt.sign(
      { userId: user.id, userType: user.userType },
      jwtSecret,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id, userType: user.userType },
      jwtRefreshSecret,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );

    // Update last login
    await user.update({ lastLogin: new Date() });

    // Get profile based on user type
    let profile = null;
    if (user.userType === 'passenger') {
      profile = user.get('passengerProfile');
    } else if (user.userType === 'rider') {
      profile = user.get('riderProfile');
    }

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          phone: user.phone,
          email: user.email,
          userType: user.userType,
          isVerified: user.isVerified,
          profile,
        },
        token,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify OTP
 */
export const verifyOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { phone, otp } = req.body;

    // Format phone number
    const formattedPhone = formatPhoneNumber(phone);

    // Get OTP from Redis
    let storedOtpData: any = null;
    try {
      const redisClient = getRedisClient();
      const data = await redisClient.get(`otp:${formattedPhone}`);
      if (data) {
        storedOtpData = JSON.parse(data);
      }
    } catch (redisError) {
      console.error('Redis error:', redisError);
      return next(new AppError('OTP verification service unavailable', 503));
    }

    if (!storedOtpData) {
      return next(new AppError('OTP expired or not found', 400));
    }

    // Check if OTP is expired
    if (Date.now() > storedOtpData.expiry) {
      return next(new AppError('OTP has expired', 400));
    }

    // Verify OTP
    if (storedOtpData.otp !== otp) {
      return next(new AppError('Invalid OTP', 400));
    }

    // Mark user as verified
    const user = await User.findOne({
      where: { phone: formattedPhone },
    });

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    await user.update({ isVerified: true });

    // Delete OTP from Redis
    try {
      const redisClient = getRedisClient();
      await redisClient.del(`otp:${formattedPhone}`);
    } catch (redisError) {
      console.error('Redis error:', redisError);
    }

    // Generate tokens
    const jwtSecret = process.env.JWT_SECRET;
    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

    if (!jwtSecret || !jwtRefreshSecret) {
      return next(new AppError('Server configuration error', 500));
    }

    const token = jwt.sign(
      { userId: user.id, userType: user.userType },
      jwtSecret,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id, userType: user.userType },
      jwtRefreshSecret,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );

    res.status(200).json({
      status: 'success',
      message: 'Phone number verified successfully',
      data: {
        user: {
          id: user.id,
          phone: user.phone,
          userType: user.userType,
          isVerified: user.isVerified,
        },
        token,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Refresh access token
 */
export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return next(new AppError('Refresh token is required', 400));
    }

    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret || !jwtRefreshSecret) {
      return next(new AppError('Server configuration error', 500));
    }

    // Verify refresh token
    const decoded = jwt.verify(token, jwtRefreshSecret) as any;

    // Generate new access token
    const newToken = jwt.sign(
      { userId: decoded.userId, userType: decoded.userType },
      jwtSecret,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.status(200).json({
      status: 'success',
      data: {
        token: newToken,
      },
    });
  } catch (error) {
    next(new AppError('Invalid or expired refresh token', 401));
  }
};

/**
 * Logout user
 */
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // In a stateless JWT system, logout is handled client-side
    // But we can implement token blacklisting using Redis if needed

    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Resend OTP
 */
export const resendOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { phone } = req.body;

    // Format phone number
    const formattedPhone = formatPhoneNumber(phone);

    // Check if user exists
    const user = await User.findOne({
      where: { phone: formattedPhone },
    });

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    if (user.isVerified) {
      return next(new AppError('Phone number already verified', 400));
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = Date.now() + parseInt(process.env.OTP_EXPIRES_IN || '300000', 10);

    // Store OTP in Redis
    try {
      const redisClient = getRedisClient();
      await redisClient.setEx(
        `otp:${formattedPhone}`,
        300,
        JSON.stringify({ otp, expiry: otpExpiry })
      );
    } catch (redisError) {
      console.error('Redis error:', redisError);
      return next(new AppError('OTP service unavailable', 503));
    }

    // TODO: Send OTP via SMS

    const response: any = {
      status: 'success',
      message: 'OTP sent successfully',
    };

    // In development, include OTP in response
    if (process.env.NODE_ENV === 'development') {
      response.data = { otp };
    }

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
