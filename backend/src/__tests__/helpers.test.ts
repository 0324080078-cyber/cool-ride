import { calculateDistance, estimateDuration, formatPhoneNumber, isValidGhanaId } from '../utils/helpers.util';

describe('Helper Utilities', () => {
  describe('calculateDistance', () => {
    it('should calculate distance between two coordinates', () => {
      // Ho Technical University to Ho Market Circle
      const distance = calculateDistance(6.6119, 0.4699, 6.6200, 0.4800);
      expect(distance).toBeGreaterThan(0);
      expect(distance).toBeLessThan(2); // Should be less than 2km
    });

    it('should return 0 for same coordinates', () => {
      const distance = calculateDistance(6.6119, 0.4699, 6.6119, 0.4699);
      expect(distance).toBe(0);
    });
  });

  describe('estimateDuration', () => {
    it('should estimate duration for 1km', () => {
      const duration = estimateDuration(1);
      expect(duration).toBe(3); // 1km at 20km/h = 3 minutes
    });

    it('should estimate duration for 5km', () => {
      const duration = estimateDuration(5);
      expect(duration).toBe(15); // 5km at 20km/h = 15 minutes
    });
  });

  describe('formatPhoneNumber', () => {
    it('should format phone starting with 0', () => {
      const formatted = formatPhoneNumber('0245678901');
      expect(formatted).toBe('+233245678901');
    });

    it('should format phone without country code', () => {
      const formatted = formatPhoneNumber('245678901');
      expect(formatted).toBe('+233245678901');
    });

    it('should handle already formatted phone', () => {
      const formatted = formatPhoneNumber('+233245678901');
      expect(formatted).toBe('+233245678901');
    });
  });

  describe('isValidGhanaId', () => {
    it('should validate correct Ghana ID format', () => {
      expect(isValidGhanaId('GHA-123456789-0')).toBe(true);
    });

    it('should reject invalid Ghana ID format', () => {
      expect(isValidGhanaId('GHA123456789')).toBe(false);
      expect(isValidGhanaId('123456789')).toBe(false);
      expect(isValidGhanaId('GHA-12345678-0')).toBe(false);
    });
  });
});
