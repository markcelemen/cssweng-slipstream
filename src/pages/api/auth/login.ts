import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../../../../models/mongodb';
import { Admin } from '../../../../models/adminmodel';
import bcrypt from 'bcrypt';
import * as cookie from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  await connectDB();

  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });

  if (!admin) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  // Set cookie
  res.setHeader('Set-Cookie', cookie.serialize('auth', 'admin-session-token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 6, // 6 hours
    sameSite: 'lax',
    path: '/',
  }));

  res.status(200).json({ success: true });
}
