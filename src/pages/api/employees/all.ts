import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../../../../models/mongodb';
import { Employee } from '../../../../models/employeemodel';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  try {
    const employees = await Employee.find({}, 'employeeID firstName lastName middleName');
    res.status(200).json(employees);
  } catch (error) {
    console.error("Error fetching all employees:", error);
    res.status(500).json({ error: 'Failed to fetch employee list' });
  }
}
