import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../../../../models/mongodb';
import { Employee } from '../../../../models/employeemodel';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  await connectDB();

  const { ids } = req.body;

  if (!Array.isArray(ids)) {
    return res.status(400).json({ error: 'Invalid request format: expected { ids: number[] }' });
  }

  try {
    const employees = await Employee.find({ employeeID: { $in: ids } });
    res.status(200).json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ error: 'Failed to fetch employee records' });
  }
}
