import type { NextApiRequest, NextApiResponse } from 'next';
import { Employee } from '../../../../models/employeemodel';
import { connectDB } from '../../../../models/mongodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDB();
  const { id } = req.query;

  try {
    const employee = await Employee.findOne({ employeeID: Number(id) });
    if (!employee) return res.status(404).json({ error: 'Not found' });
    res.status(200).json(employee);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch employee' });
  }
}
