import { connectDB } from '../../../../models/mongodb';
import { Admin } from '../../../../models/adminmodel';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST allowed' });
  }

  try {
    await connectDB();
    const exists = await Admin.findOne();
    if (exists) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    await Admin.create({
      username: 'admin',
      password: 'changeme123',
    });

    res.status(201).json({ message: 'Admin created' });
  } catch (err: any) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}
