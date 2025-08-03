import nodemailer from 'nodemailer';
import type { NextApiRequest, NextApiResponse } from 'next';
import { createMocks } from 'node-mocks-http';
import handler from '../pages/api/email/send-brevo';

jest.mock('nodemailer');

const sendMailMock = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  // Mock createTransport to return an object with sendMail method
  (nodemailer.createTransport as jest.Mock).mockReturnValue({
    sendMail: sendMailMock,
  });
});

describe('/api/send-email handler', () => {
  it('returns 405 if method is not POST', async () => {
    const { req, res } = createMocks({ method: 'GET' });

    await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

    expect(res._getStatusCode()).toBe(405);
    expect(JSON.parse(res._getData())).toEqual({ error: 'Method not allowed' });
  });

  it('successfully sends email', async () => {
    sendMailMock.mockResolvedValue({});

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        to: 'test@example.com',
        subject: 'Hello',
        text: 'This is a test',
        attachments: [],
      },
    });

    await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      host: 'smtp-relay.brevo.com',
      port: 587,
      auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_PASS,
      },
    });

    expect(sendMailMock).toHaveBeenCalledWith({
      from: `"CSSWENG System" <csswengmongodb@gmail.com>`,
      to: 'test@example.com',
      subject: 'Hello',
      text: 'This is a test',
      attachments: [],
    });

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({ success: true });
  });

  it('returns 500 if sendMail fails', async () => {
    sendMailMock.mockRejectedValue(new Error('SMTP error'));

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        to: 'fail@example.com',
        subject: 'Failing Test',
        text: 'This should error',
        attachments: [],
      },
    });

    await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

    expect(res._getStatusCode()).toBe(500);
    const data = JSON.parse(res._getData());
    expect(data.success).toBe(false);
    expect(data.error).toBeDefined();
  });
});