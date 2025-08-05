import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../../../../models/mongodb';
import AttendanceEntryModel from '../../../../models/attendancemodel';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' });

  const { id, note } = req.body;

  if (!id || note == null) {
    return res.status(400).json({ error: 'Missing id or note' });
  }

  await connectDB();

  try {
    const result = await AttendanceEntryModel.findByIdAndUpdate(id, { note }, { new: true });

    if (!result) return res.status(404).json({ error: 'Entry not found' });

    return res.status(200).json({ message: 'Note updated', updated: result });
  } catch (err) {
    console.error("Update error:", err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
