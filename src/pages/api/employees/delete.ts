import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../../../../models/mongodb';
import { Employee } from '../../../../models/employeemodel';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    try {
      await connectDB();
      const { employeeIDs } = req.body;

      if (!Array.isArray(employeeIDs)) {
        return res.status(400).json({ success: false, message: "Invalid employeeIDs array" });
      }

      await Employee.deleteMany({ employeeID: { $in: employeeIDs } });

      return res.status(200).json({ success: true, message: "Employees deleted" });
    } catch (err: any) {
      console.error("❌ Delete failed:", err);
      return res.status(500).json({ success: false, message: err.message });
    }
  } else {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }
}
