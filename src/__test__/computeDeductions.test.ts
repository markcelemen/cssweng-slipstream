import { computeLateDeduct, computeEarlyDeduct } from '../utils/attendance/computeDeductions';


describe('computeLateDeduct', () => {
  it('returns 0 for on-time clock-in at 08:00', () => {
    const clockIn = new Date('2025-08-01T08:00:00');
    expect(computeLateDeduct(clockIn)).toBe(0);
  });

  it('returns 15 for clock-in at 08:15', () => {
    const clockIn = new Date('2025-08-01T08:15:00');
    expect(computeLateDeduct(clockIn)).toBe(15);
  });

  it('returns 0 for early clock-in before 08:00', () => {
    const clockIn = new Date('2025-08-01T07:45:00');
    expect(computeLateDeduct(clockIn)).toBe(0);
  });

  it('returns 1 for clock-in at 08:00:59', () => {
    const clockIn = new Date('2025-08-01T08:00:59');
    expect(computeLateDeduct(clockIn)).toBe(0); // still within the same minute
  });

  it('returns 1 for clock-in at 08:01:00', () => {
    const clockIn = new Date('2025-08-01T08:01:00');
    expect(computeLateDeduct(clockIn)).toBe(1);
  });
});

describe('computeEarlyDeduct', () => {
  const salary = 26400; // example salary

  it('returns 0 for on-time clock-out at 08:00', () => {
    const clockOut = new Date('2025-08-01T08:00:00');
    expect(computeEarlyDeduct(clockOut, salary)).toBe(0);
  });

  it('returns deduction for clock-out at 07:45', () => {
    const clockOut = new Date('2025-08-01T07:45:00');
    const expected = 15 * salary / 10560;
    expect(computeEarlyDeduct(clockOut, salary)).toBeCloseTo(expected);
  });

  it('returns 0 for late clock-out (after 08:00)', () => {
    const clockOut = new Date('2025-08-01T08:10:00');
    expect(computeEarlyDeduct(clockOut, salary)).toBe(0);
  });

  it('rounds down partial minutes (e.g. 07:59:59)', () => {
    const clockOut = new Date('2025-08-01T07:59:59');
    const expected = 0; // less than a full minute early
    expect(computeEarlyDeduct(clockOut, salary)).toBeCloseTo(expected);
  });
});
