import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../../../../models/mongodb';
import { IAttendanceEntry } from '../../../../models/attendancemodel';
import AttendanceEntryModel from '../../../../models/attendancemodel';

/**
 * API route handler for uploading finalized attendance entries into the database.
 * 
 * Expects a request containing an array of AttendanceEntry objects.
 *
 * @param req The incoming Next.js API request.
 * @param res The outgoing response: success or error message.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string; insertedCount?: number }>
) {
  // Reject unsupported methods
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const entries = req.body as IAttendanceEntry[];

  if (!Array.isArray(entries) || entries.length === 0) {
    return res.status(400).json({ message: 'Invalid or empty data' });
  }

  try {
    await connectDB();

    const formattedEntries = entries.map(entry => ({
      datetime: new Date(entry.datetime),
      employeeID: entry.employeeID,
        employeeName: entry.employeeName,
        lastName: entry.lastName,
        firstName: entry.firstName,
        middleName: entry.middleName,
        lateDeduct: entry.lateDeduct,
        earlyDeduct: entry.earlyDeduct,
      remarks: entry.remarks || "",
    }));

    const result = await AttendanceEntryModel.insertMany(formattedEntries, { ordered: false });

    return res.status(200).json({
      message: 'Attendance uploaded successfully',
      insertedCount: result.length
    });
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}