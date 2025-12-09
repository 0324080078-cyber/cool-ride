/**
 * Generate a random OTP code
 */
export const generateOTP = (length: number = 6): string => {
  const digits = '0123456789';
  let otp = '';
  
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  
  return otp;
};

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 100) / 100; // Round to 2 decimal places
};

const toRad = (value: number): number => {
  return (value * Math.PI) / 180;
};

/**
 * Estimate travel duration based on distance
 * Returns duration in minutes
 */
export const estimateDuration = (distanceKm: number): number => {
  // Average speed in Ho Township: 20 km/h (accounting for traffic)
  const averageSpeed = 20;
  const durationHours = distanceKm / averageSpeed;
  const durationMinutes = Math.ceil(durationHours * 60);
  
  return durationMinutes;
};

/**
 * Format phone number to international format
 */
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // If it starts with 0, replace with +233
  if (cleaned.startsWith('0')) {
    return '+233' + cleaned.substring(1);
  }
  
  // If it doesn't start with country code, add +233
  if (!cleaned.startsWith('233')) {
    return '+233' + cleaned;
  }
  
  // If it starts with 233, add +
  if (cleaned.startsWith('233')) {
    return '+' + cleaned;
  }
  
  return phone;
};

/**
 * Mask phone number for privacy
 * Example: +233245678901 -> +233****8901
 */
export const maskPhoneNumber = (phone: string): string => {
  if (phone.length < 8) return phone;
  
  const visibleStart = 4;
  const visibleEnd = 4;
  const masked = phone.substring(0, visibleStart) +
    '****' +
    phone.substring(phone.length - visibleEnd);
  
  return masked;
};

/**
 * Generate a unique transaction reference
 */
export const generateTransactionRef = (): string => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `CR-${timestamp}-${randomStr}`.toUpperCase();
};

/**
 * Check if location is within Ho Township boundaries
 * Boundaries can be configured via environment variables
 */
export const isWithinHoTownship = (lat: number, lng: number): boolean => {
  // Approximate boundaries of Ho Township
  // These can be overridden via environment variables
  const bounds = {
    north: parseFloat(process.env.HO_BOUNDARY_NORTH || '6.65'),
    south: parseFloat(process.env.HO_BOUNDARY_SOUTH || '6.55'),
    east: parseFloat(process.env.HO_BOUNDARY_EAST || '0.50'),
    west: parseFloat(process.env.HO_BOUNDARY_WEST || '0.43'),
  };
  
  return (
    lat >= bounds.south &&
    lat <= bounds.north &&
    lng >= bounds.west &&
    lng <= bounds.east
  );
};

/**
 * Format currency (GHS)
 */
export const formatCurrency = (amount: number): string => {
  return `GHS ${amount.toFixed(2)}`;
};

/**
 * Calculate platform commission (20%)
 */
export const calculateCommission = (fare: number): {
  fare: number;
  commission: number;
  riderEarnings: number;
} => {
  const commissionRate = 0.20; // 20%
  const commission = fare * commissionRate;
  const riderEarnings = fare - commission;
  
  return {
    fare: Math.round(fare * 100) / 100,
    commission: Math.round(commission * 100) / 100,
    riderEarnings: Math.round(riderEarnings * 100) / 100,
  };
};

/**
 * Validate Ghana ID format
 */
export const isValidGhanaId = (id: string): boolean => {
  // Ghana ID format: GHA-XXXXXXXXX-X
  const regex = /^GHA-\d{9}-\d$/;
  return regex.test(id);
};

/**
 * Generate random color for vehicle identification
 */
export const getRandomVehicleColor = (): string => {
  const colors = [
    'Yellow',
    'Green',
    'Blue',
    'Red',
    'White',
    'Black',
    'Orange',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * Sleep/delay function for async operations
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Sanitize user input to prevent XSS
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '')
    .trim()
    .substring(0, 1000); // Limit length
};

/**
 * Check if time is within business hours
 */
export const isBusinessHours = (): boolean => {
  const now = new Date();
  const hour = now.getHours();
  // Business hours: 6 AM - 10 PM
  return hour >= 6 && hour < 22;
};

/**
 * Format date for display
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
