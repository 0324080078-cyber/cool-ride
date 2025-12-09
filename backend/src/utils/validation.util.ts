import Joi from 'joi';

// User Registration Validation
export const registerSchema = Joi.object({
  phone: Joi.string()
    .pattern(/^\+233[0-9]{9}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must be in format +233XXXXXXXXX',
      'any.required': 'Phone number is required',
    }),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).max(50).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'any.required': 'Password is required',
  }),
  userType: Joi.string().valid('passenger', 'rider').required(),
  fullName: Joi.string().min(2).max(100).required(),
});

// Login Validation
export const loginSchema = Joi.object({
  phone: Joi.string()
    .pattern(/^\+233[0-9]{9}$/)
    .required(),
  password: Joi.string().required(),
});

// OTP Verification
export const verifyOtpSchema = Joi.object({
  phone: Joi.string()
    .pattern(/^\+233[0-9]{9}$/)
    .required(),
  otp: Joi.string().length(6).pattern(/^[0-9]+$/).required(),
});

// Trip Creation Validation
export const createTripSchema = Joi.object({
  pickupLocation: Joi.object({
    lat: Joi.number().min(-90).max(90).required(),
    lng: Joi.number().min(-180).max(180).required(),
  }).required(),
  pickupAddress: Joi.string().min(3).max(200).required(),
  dropoffLocation: Joi.object({
    lat: Joi.number().min(-90).max(90).required(),
    lng: Joi.number().min(-180).max(180).required(),
  }).required(),
  dropoffAddress: Joi.string().min(3).max(200).required(),
  estimatedFare: Joi.number().min(0).required(),
  paymentMethod: Joi.string()
    .valid('cash', 'momo', 'card')
    .default('cash'),
});

// Fare Estimate Validation
export const estimateSchema = Joi.object({
  pickupLocation: Joi.object({
    lat: Joi.number().min(-90).max(90).required(),
    lng: Joi.number().min(-180).max(180).required(),
  }).required(),
  dropoffLocation: Joi.object({
    lat: Joi.number().min(-90).max(90).required(),
    lng: Joi.number().min(-180).max(180).required(),
  }).required(),
});

// Update Profile Validation
export const updateProfileSchema = Joi.object({
  fullName: Joi.string().min(2).max(100).optional(),
  email: Joi.string().email().optional(),
  emergencyContact: Joi.string()
    .pattern(/^\+233[0-9]{9}$/)
    .optional(),
  emergencyContactName: Joi.string().min(2).max(100).optional(),
  preferredPayment: Joi.string()
    .valid('cash', 'momo', 'card')
    .optional(),
});

// Location Update Validation
export const locationSchema = Joi.object({
  lat: Joi.number().min(-90).max(90).required(),
  lng: Joi.number().min(-180).max(180).required(),
});

// Rating Validation
export const ratingSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().max(500).optional(),
});

// Rider Registration Additional Fields
export const riderRegistrationSchema = Joi.object({
  ghanaId: Joi.string().required(),
  licenseNumber: Joi.string().required(),
  licenseExpiry: Joi.date().greater('now').required(),
  vehicleType: Joi.string().default('Keke/Pragia'),
  vehicleColor: Joi.string().required(),
  plateNumber: Joi.string().required(),
  momoNumber: Joi.string()
    .pattern(/^\+233[0-9]{9}$/)
    .optional(),
  momoNetwork: Joi.string()
    .valid('mtn', 'vodafone', 'airteltigo')
    .optional(),
});

// Validation Middleware
export const validate = (schema: Joi.ObjectSchema) => {
  return (req: any, res: any, next: any) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return res.status(400).json({
        status: 'error',
        message: 'Validation error',
        errors,
      });
    }

    req.body = value;
    next();
  };
};
