import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../../../../models/mongodb';
import AttendanceEntryModel from '../../../../models/attendancemodel';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  try {
    if (req.method === "DELETE") {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: "Missing ID" });
      }

      await AttendanceEntryModel.findByIdAndDelete(id);
      return res.status(200).json({ success: true });
    }

    if (req.method === "POST") {
      const { ids } = req.body;

      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ error: "No IDs provided" });
      }

      await AttendanceEntryModel.deleteMany({ _id: { $in: ids } });
      return res.status(200).json({ success: true, deletedCount: ids.length });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Error deleting attendance entry:", error);
    res.status(500).json({ error: "Failed to delete attendance record(s)" });
  }
}
