import type { NextApiRequest, NextApiResponse } from 'next';
import * as cookie from 'cookie';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Set-Cookie', cookie.serialize('auth', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(0), // or use maxAge: 0
    path: '/',
    sameSite: 'lax',
  }));

  res.status(200).json({ success: true });
}
