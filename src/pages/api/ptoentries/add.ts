import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../../../../models/mongodb';
import { Employee } from '../../../../models/employeemodel';
import PTOModel from '../../../../models/ptomodel';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  await connectDB();

  const { employeeID, date, credit } = req.body;

  if (!employeeID || !date || !credit) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const employee = await Employee.findOne({ employeeID });

    if (!employee) return res.status(404).json({ error: 'Employee not found' });

    if ((employee.numberOfPTOs ?? 0) < credit) {
      return res.status(400).json({ error: 'Insufficient PTO balance' });
    }

    const result = await PTOModel.create({ employeeID, date, credit });

    employee.numberOfPTOs = (employee.numberOfPTOs ?? 0) - credit;
    await employee.save();

    res.status(200).json({ message: 'PTO added and PTO balance updated', data: result });
  } catch (err) {
    console.error('Failed to add PTO:', err);
    res.status(500).json({ error: 'Server error' });
  }
}
