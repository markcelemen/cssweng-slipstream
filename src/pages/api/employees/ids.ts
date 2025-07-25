import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../../../../models/mongodb';
import { Employee } from '../../../../models/employeemodel';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  try {
    const employees = await Employee.find({}, 'employeeID').sort({ employeeID: 1 });
    const ids = employees.map(e => e.employeeID);
    res.status(200).json(ids);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employee IDs' });
  }
}