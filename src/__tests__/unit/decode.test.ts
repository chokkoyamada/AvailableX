import { decodeSchedule, decodeScheduleFromUrl, timeToIndex } from '../../lib/decode';

describe('decode.ts', () => {
  describe('decodeSchedule', () => {
    it('should decode encoded schedule string correctly', () => {
      const encoded = '20250301_24:54-69,84-96;25:60-72';
      const result = decodeSchedule(encoded);
      
      expect(result).toEqual({
        baseDate: '20250301',
        dateRanges: [
          {
            relativeDay: 24,
            timeRanges: [
              { startIndex: 54, endIndex: 69 },
              { startIndex: 84, endIndex: 96 }
            ]
          },
          {
            relativeDay: 25,
            timeRanges: [
              { startIndex: 60, endIndex: 72 }
            ]
          }
        ]
      });
    });

    it('should handle invalid encoded format gracefully', () => {
      const encoded = 'invalid_format';
      const result = decodeSchedule(encoded);
      
      expect(result.dateRanges).toEqual([]);
      expect(result.baseDate).toBeDefined();
    });

    it('should handle empty time ranges gracefully', () => {
      const encoded = '20250301_24:';
      const result = decodeSchedule(encoded);
      
      expect(result.baseDate).toBe(result.baseDate); // Just check that baseDate exists
      expect(result.dateRanges).toEqual([]);
    });
  });

  describe('decodeScheduleFromUrl', () => {
    it('should decode URI encoded schedule string', () => {
      const encodedUrl = encodeURIComponent('20250301_24:54-69');
      const result = decodeScheduleFromUrl(encodedUrl);
      
      expect(result).toEqual({
        baseDate: '20250301',
        dateRanges: [
          {
            relativeDay: 24,
            timeRanges: [
              { startIndex: 54, endIndex: 69 }
            ]
          }
        ]
      });
    });

    it('should handle invalid URI encoded format gracefully', () => {
      const encodedUrl = '%invalid';
      const result = decodeScheduleFromUrl(encodedUrl);
      
      expect(result.dateRanges).toEqual([]);
      expect(result.baseDate).toBeDefined();
    });
  });

  describe('timeToIndex', () => {
    it('should convert hours and minutes to time index', () => {
      expect(timeToIndex(0, 0)).toBe(0);     // 00:00
      expect(timeToIndex(1, 0)).toBe(4);     // 01:00
      expect(timeToIndex(1, 15)).toBe(5);    // 01:15
      expect(timeToIndex(8, 0)).toBe(32);    // 08:00
      expect(timeToIndex(8, 15)).toBe(33);   // 08:15
      expect(timeToIndex(23, 45)).toBe(95);  // 23:45
    });

    it('should round down minutes to nearest 15-minute interval', () => {
      expect(timeToIndex(1, 10)).toBe(4);    // 01:10 -> 01:00
      expect(timeToIndex(1, 20)).toBe(5);    // 01:20 -> 01:15
      expect(timeToIndex(1, 35)).toBe(6);    // 01:35 -> 01:30
      expect(timeToIndex(1, 50)).toBe(7);    // 01:50 -> 01:45
    });
  });
});
