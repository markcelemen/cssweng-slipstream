import nodemailer from 'nodemailer';
import type { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { to, subject, text, attachments } = req.body;

  const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    auth: {
      user: process.env.BREVO_USER,
      pass: process.env.BREVO_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"CSSWENG System" <csswengmongodb@gmail.com>`,
      to,
      subject,
      text,
      attachments,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('[BREVO EMAIL ERROR]', error);
    res.status(500).json({ success: false, error });
  }
}
