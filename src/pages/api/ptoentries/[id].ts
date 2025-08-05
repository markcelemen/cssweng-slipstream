import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../../../../models/mongodb';
import PTOModel from '../../../../models/ptomodel';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  await connectDB();

  try {
    const entries = await PTOModel.find({ employeeID: Number(id) }).sort({ date: 1 });
    res.status(200).json(entries);
  } catch (err) {
    console.error("Failed to fetch PTO entries:", err);
    res.status(500).json({ error: 'Server error' });
  }
}
