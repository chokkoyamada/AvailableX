import { encodeSchedule, encodeScheduleForUrl, indexToTime } from '../../lib/encode';
import { ScheduleData } from '../../types/schedule';

describe('encode.ts', () => {
  describe('encodeSchedule', () => {
    it('should encode schedule data correctly', () => {
      const schedule: ScheduleData = {
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
      };

      const result = encodeSchedule(schedule);
      expect(result).toBe('20250301_24:54-69,84-96;25:60-72');
    });

    it('should handle empty dateRanges', () => {
      const schedule: ScheduleData = {
        baseDate: '20250301',
        dateRanges: []
      };

      const result = encodeSchedule(schedule);
      expect(result).toBe('20250301_');
    });
  });

  describe('encodeScheduleForUrl', () => {
    it('should encode and URI encode schedule data', () => {
      const schedule: ScheduleData = {
        baseDate: '20250301',
        dateRanges: [
          {
            relativeDay: 24,
            timeRanges: [
              { startIndex: 54, endIndex: 69 }
            ]
          }
        ]
      };

      const result = encodeScheduleForUrl(schedule);
      expect(result).toBe(encodeURIComponent('20250301_24:54-69'));
    });
  });

  describe('indexToTime', () => {
    it('should convert time index to hours and minutes', () => {
      expect(indexToTime(0)).toEqual([0, 0]);    // 00:00
      expect(indexToTime(4)).toEqual([1, 0]);    // 01:00
      expect(indexToTime(5)).toEqual([1, 15]);   // 01:15
      expect(indexToTime(32)).toEqual([8, 0]);   // 08:00
      expect(indexToTime(33)).toEqual([8, 15]);  // 08:15
      expect(indexToTime(95)).toEqual([23, 45]); // 23:45
    });
  });
});
