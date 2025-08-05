import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../../../../models/mongodb';
import AttendanceEntryModel from '../../../../models/attendancemodel';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  try {
    const entries = await AttendanceEntryModel.find(
      {},
      'employeeID firstName lastName middleName datetime type source note'
    ).sort({ datetime: -1 });

    res.status(200).json(entries);
  } catch (error) {
    console.error("Error fetching attendance entries:", error);
    res.status(500).json({ error: 'Failed to fetch attendance records' });
  }
}
