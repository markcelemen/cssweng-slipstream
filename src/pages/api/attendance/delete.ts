import type { NextApiRequest, NextApiResponse } from 'next';
import AttendanceEntryModel from '../../../../models/attendancemodel';
import { connectDB } from '../../../../models/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  try {
    if (req.method === 'DELETE') {
      const { id } = req.body;

      if (!id) return res.status(400).json({ error: 'Missing attendance entry ID' });

      const deleted = await AttendanceEntryModel.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ error: 'Entry not found' });

      return res.status(200).json({ success: true, message: 'Attendance entry deleted' });
    }

    if (req.method === 'POST') {
      const { ids } = req.body;

      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ error: 'Missing entry IDs for bulk delete' });
      }

      await AttendanceEntryModel.deleteMany({ _id: { $in: ids } });

      return res.status(200).json({ success: true, message: `Deleted ${ids.length} entries` });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error("Error deleting attendance entry:", err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
