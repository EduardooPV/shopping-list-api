import { describe, it, expect } from '@jest/globals';
import { DateTimeHelper } from 'shared/utils/format-date-time';

describe('DateTimeHelper', () => {
  it('should format a full date and time correctly', () => {
    const date = new Date('2025-10-04T15:07:09Z');

    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    const formatted = DateTimeHelper.format(localDate);

    const day = localDate.getDate().toString().padStart(2, '0');
    const month = (localDate.getMonth() + 1).toString().padStart(2, '0');
    const year = localDate.getFullYear();
    const hours = localDate.getHours().toString().padStart(2, '0');
    const minutes = localDate.getMinutes().toString().padStart(2, '0');
    const seconds = localDate.getSeconds().toString().padStart(2, '0');

    expect(formatted).toBe(`${day}/${month}/${year} ${hours}:${minutes}:${seconds}`);
  });

  it('should pad single-digit day, month, hour, minute and second with zeros', () => {
    const date = new Date(2025, 0, 5, 3, 7, 9); // 5/1/2025 03:07:09
    const formatted = DateTimeHelper.format(date);
    expect(formatted).toBe('05/01/2025 03:07:09');
  });

  it('should format correctly for double-digit day and month', () => {
    const date = new Date(2025, 10, 15, 14, 30, 45); // 15/11/2025 14:30:45
    const formatted = DateTimeHelper.format(date);
    expect(formatted).toBe('15/11/2025 14:30:45');
  });
});
