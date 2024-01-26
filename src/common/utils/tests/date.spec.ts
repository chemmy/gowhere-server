import { isValidDate, dateToIsoString } from '../date';

describe('utils/date', () => {
  describe('isValidDate', () => {
    it('should return false if null is passed', () => {
      const actual = isValidDate(null);
      expect(actual).toBe(false);
    });

    it('should return false if undefined is passed', () => {
      const actual = isValidDate(undefined);
      expect(actual).toBe(false);
    });

    it('should return false if invalid date is passed', () => {
      const actual = isValidDate('1abc');
      expect(actual).toBe(false);
    });

    it('should return false if valid date is passed', () => {
      const actual = isValidDate('2024-01-01');
      expect(actual).toBe(true);
    });
  });

  describe('dateToIsoString', () => {
    it('should return expected format for isoString given only date', () => {
      const actual = dateToIsoString('2024-01-01');
      expect(actual).toBe('2024-01-01T08:00:00');
    });

    it('should return expected format for isoString given date and time', () => {
      const actual = dateToIsoString('2024-01-01 09:30:15');
      expect(actual).toBe('2024-01-01T09:30:15');
    });
  });
});
