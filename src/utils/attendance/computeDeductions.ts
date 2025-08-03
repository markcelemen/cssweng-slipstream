

// TODO: Handle custom start and end times


/**
 * Computes the deduction amount based on how late an
 * employee clocked in compared to the expected start time.
 *
 * @param clockIn The `Date` object representing the employee's clock-in time.
 * @returns       A number representing the computed late deduction.
 */
export function computeLateDeduct(clockIn: Date): number {
    const startTime = new Date(clockIn);
    startTime.setHours(8, 0, 0, 0);

    const diff = clockIn.getTime() - startTime.getTime();
    const diffMinutes = Math.floor(diff / 60000);

    return diffMinutes > 0 ? diffMinutes : 0;
}

/**
 * Computes the deduction amount based on how early an
 * employee clocked out compared to the expected end time.
 *
 * @param clockOut The `Date` object representing the employee's clock‑out time.
 * @param salary   The employee's salary (used as a basis for calculating deductions).
 * @returns        A number representing the computed early‑out deduction.
 */
export function computeEarlyDeduct(clockOut: Date, salary: number): number{
    const endTime = new Date(clockOut);
    endTime.setHours(8, 0, 0, 0);

    const diff = endTime.getTime() - clockOut.getTime();
    const diffMinutes = Math.floor(diff / 60000);

    return diffMinutes > 0 ? (diffMinutes * salary / 10560) : 0;
}