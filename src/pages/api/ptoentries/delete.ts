import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../../../../models/mongodb';
import PTOModel from '../../../../models/ptomodel';
import { Employee } from '../../../../models/employeemodel';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') return res.status(405).json({ error: 'Method not allowed' });

  await connectDB();

  const { employeeID, date } = req.body;

  if (!employeeID || !date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Find the PTO entry to delete
    const ptoEntry = await PTOModel.findOneAndDelete({
      employeeID,
      date: new Date(date),
    });

    if (!ptoEntry) {
      return res.status(404).json({ error: 'PTO entry not found' });
    }

    // Restore credit
    const employee = await Employee.findOne({ employeeID });
    if (employee) {
      employee.numberOfPTOs = (employee.numberOfPTOs ?? 0) + ptoEntry.credit;
      await employee.save();
    }

    res.status(200).json({ message: 'PTO deleted and credit restored', credit: ptoEntry.credit });
  } catch (err) {
    console.error("Failed to delete PTO entry:", err);
    res.status(500).json({ error: 'Failed to delete PTO' });
  }
}
