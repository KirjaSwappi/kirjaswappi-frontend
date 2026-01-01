import { describe, it, expect } from 'vitest';
import { getDistanceInMeters } from '../../utility/distance';

describe('Distance Utility Functions', () => {
  describe('getDistanceInMeters', () => {
    it('should calculate distance between same points as 0', () => {
      const distance = getDistanceInMeters(60.1699, 24.9384, 60.1699, 24.9384);
      expect(distance).toBe(0);
    });

    it('should calculate distance between Helsinki and Espoo', () => {
      // Helsinki coordinates
      const helsinkiLat = 60.1699;
      const helsinkiLon = 24.9384;

      // Espoo coordinates (approximately 16km west of Helsinki)
      const espooLat = 60.2055;
      const espooLon = 24.6559;

      const distance = getDistanceInMeters(helsinkiLat, helsinkiLon, espooLat, espooLon);

      // Should be approximately 16km = 16000 meters
      expect(distance).toBeGreaterThan(15000); // Allow some margin for calculation precision
      expect(distance).toBeLessThan(17000);
    });

    it('should calculate distance between New York and London', () => {
      // New York coordinates
      const nyLat = 40.7128;
      const nyLon = -74.006;

      // London coordinates
      const londonLat = 51.5074;
      const londonLon = -0.1278;

      const distance = getDistanceInMeters(nyLat, nyLon, londonLat, londonLon);

      // Should be approximately 5585km = 5585000 meters
      expect(distance).toBeGreaterThan(5500000);
      expect(distance).toBeLessThan(5700000);
    });

    it('should be symmetric (distance A to B equals B to A)', () => {
      const lat1 = 60.1699;
      const lon1 = 24.9384;
      const lat2 = 61.4991;
      const lon2 = 23.7871;

      const distance1 = getDistanceInMeters(lat1, lon1, lat2, lon2);
      const distance2 = getDistanceInMeters(lat2, lon2, lat1, lon1);

      expect(distance1).toBe(distance2);
    });

    it('should handle negative coordinates', () => {
      const distance = getDistanceInMeters(-33.8688, 151.2093, 51.5074, -0.1278);
      // Sydney to London

      expect(distance).toBeGreaterThan(16000000); // Approximately 16,000km
      expect(distance).toBeLessThan(18000000);
    });

    it('should handle coordinates near the poles', () => {
      // North Pole to South Pole (should be approximately half the Earth's circumference)
      const distance = getDistanceInMeters(90, 0, -90, 0);

      expect(distance).toBeGreaterThan(19000000); // Approximately 20,000km
      expect(distance).toBeLessThan(21000000);
    });

    it('should handle small distances accurately', () => {
      // Two points 1km apart
      const lat1 = 60.1699;
      const lon1 = 24.9384;
      const lat2 = 60.1789; // Approximately 1km north
      const lon2 = 24.9384;

      const distance = getDistanceInMeters(lat1, lon1, lat2, lon2);

      expect(distance).toBeGreaterThan(900); // Should be close to 1000 meters
      expect(distance).toBeLessThan(1100);
    });

    it('should return finite numbers for valid inputs', () => {
      const distance = getDistanceInMeters(0, 0, 1, 1);

      expect(Number.isFinite(distance)).toBe(true);
      expect(distance).toBeGreaterThan(0);
    });

    it('should handle longitude wraparound (crossing international date line)', () => {
      // Point near international date line
      const distance1 = getDistanceInMeters(0, 179, 0, -179); // Should be close
      const distance2 = getDistanceInMeters(0, 179, 0, -178); // Should be farther

      expect(distance1).toBeLessThan(distance2);
    });
  });
});
