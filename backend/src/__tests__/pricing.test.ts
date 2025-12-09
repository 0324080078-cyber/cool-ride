import { calculateFare, isNightTime, getFareEstimate } from '../utils/pricing.util';

describe('Pricing Utilities', () => {
  describe('isNightTime', () => {
    it('should return true for night hours', () => {
      const nightDate = new Date('2024-12-09T23:00:00'); // 11 PM
      expect(isNightTime(nightDate)).toBe(true);
    });

    it('should return false for day hours', () => {
      const dayDate = new Date('2024-12-09T14:00:00'); // 2 PM
      expect(isNightTime(dayDate)).toBe(false);
    });

    it('should handle early morning hours', () => {
      const earlyMorning = new Date('2024-12-09T02:00:00'); // 2 AM
      expect(isNightTime(earlyMorning)).toBe(true);
    });
  });

  describe('calculateFare', () => {
    it('should calculate daytime fare correctly', () => {
      const fare = calculateFare({
        distance: 2.5,
        duration: 10,
        isDayTime: true,
        surgeMultiplier: 1,
      });
      
      // Base 3 + Distance (2.5 * 0.5) + Time (10 * 0.2) = 3 + 1.25 + 2 = 6.25
      expect(fare).toBeCloseTo(6.25, 2);
    });

    it('should calculate nighttime fare correctly', () => {
      const fare = calculateFare({
        distance: 2.5,
        duration: 10,
        isDayTime: false,
        surgeMultiplier: 1,
      });
      
      // Night base fare starts at 15 GHS
      expect(fare).toBeGreaterThanOrEqual(15);
      expect(fare).toBeLessThanOrEqual(20); // Capped at 20 GHS
    });

    it('should apply surge multiplier', () => {
      const normalFare = calculateFare({
        distance: 2.5,
        duration: 10,
        isDayTime: true,
        surgeMultiplier: 1,
      });
      
      const surgeFare = calculateFare({
        distance: 2.5,
        duration: 10,
        isDayTime: true,
        surgeMultiplier: 1.5,
      });
      
      expect(surgeFare).toBeCloseTo(normalFare * 1.5, 2);
    });
  });

  describe('getFareEstimate', () => {
    it('should return estimate with breakdown', () => {
      const estimate = getFareEstimate(2.5, 10);
      
      expect(estimate).toHaveProperty('estimatedFare');
      expect(estimate).toHaveProperty('isDayRate');
      expect(estimate).toHaveProperty('breakdown');
      expect(estimate.breakdown).toHaveProperty('baseFare');
      expect(estimate.breakdown).toHaveProperty('distanceCharge');
      expect(estimate.breakdown).toHaveProperty('timeCharge');
    });
  });
});
