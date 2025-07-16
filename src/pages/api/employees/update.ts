import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../../../../models/mongodb';
import { Employee } from '../../../../models/employeemodel';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    await connectDB();
    const { employeeIDs, updates } = req.body;

    if (!Array.isArray(employeeIDs) || typeof updates !== "object") {
      return res.status(400).json({ success: false, message: "Invalid input" });
    }

    await Employee.updateMany(
      { employeeID: { $in: employeeIDs } },
      { $set: updates }
    );

    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error("Update API error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}
