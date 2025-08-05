import type { NextApiRequest, NextApiResponse } from 'next';
import AttendanceEntryModel from '../../../../../models/attendancemodel';
import { connectDB } from '../../../../../models/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method,
  } = req;

  if (method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  await connectDB();

  try {
    const entries = await AttendanceEntryModel.find({ employeeID: Number(id) }).sort({ datetime: 1 });
    res.status(200).json(entries);
  } catch (err) {
    console.error("Failed to fetch attendance:", err);
    res.status(500).json({ error: 'Server error' });
  }
}
