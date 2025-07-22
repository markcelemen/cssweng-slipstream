import handler from '../pages/api/auth/login';
import { createMocks } from 'node-mocks-http';
import bcrypt from 'bcrypt';
import * as db from '../../models/mongodb';
import { Admin } from '../../models/adminmodel';
import * as cookie from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';


jest.mock('../../models/mongodb', () => ({
  connectDB: jest.fn(),
}));

jest.mock('../../models/adminmodel', () => ({
  Admin: {
    findOne: jest.fn(),
  },
}));

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

jest.mock('cookie', () => ({
  serialize: jest.fn(),
}));

describe('POST /api/admin/login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 405 for non-POST requests', async () => {
    const { req, res } = createMocks({ method: 'GET' });
    await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);
    expect(res._getStatusCode()).toBe(405);
  });

  it('returns 401 if admin not found', async () => {
    (Admin.findOne as jest.Mock).mockResolvedValue(null);

    const { req, res } = createMocks({
      method: 'POST',
      body: { username: 'admin', password: 'wrongpass' },
    });

    await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);
    expect(res._getStatusCode()).toBe(401);
    expect(JSON.parse(res._getData())).toEqual({
      success: false,
      message: 'Invalid credentials',
    });
  });

  it('returns 401 if password does not match', async () => {
    (Admin.findOne as jest.Mock).mockResolvedValue({ username: 'admin', password: 'hashed' });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const { req, res } = createMocks({
      method: 'POST',
      body: { username: 'admin', password: 'wrongpass' },
    });

    await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);
    expect(res._getStatusCode()).toBe(401);
    expect(JSON.parse(res._getData())).toEqual({
      success: false,
      message: 'Invalid credentials',
    });
  });

  it('returns 200 and sets cookie on successful login', async () => {
    (Admin.findOne as jest.Mock).mockResolvedValue({ username: 'admin', password: 'hashed' });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (cookie.serialize as jest.Mock).mockReturnValue('auth=admin-session-token');

    const { req, res } = createMocks({
      method: 'POST',
      body: { username: 'admin', password: 'correctpass' },
    });

    await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);
    expect(res._getStatusCode()).toBe(200);
    expect(res._getHeaders()['set-cookie']).toBe('auth=admin-session-token');
    expect(JSON.parse(res._getData())).toEqual({ success: true });
  });
});
