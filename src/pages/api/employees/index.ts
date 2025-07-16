import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../../../../models/mongodb';
import { Employee } from '../../../../models/employeemodel';

// Gets the employee data from the database
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      await connectDB();
      const employees = await Employee.find({});
      return res.status(200).json({ success: true, data: employees });
    } catch (err: any) {
      console.error(" Failed to fetch employees:", err);
      return res.status(500).json({ success: false, message: err.message });
    }
  } else {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }
}
