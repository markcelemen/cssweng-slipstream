import handler from '../pages/api/auth/logout';
import { createMocks } from 'node-mocks-http';
import * as cookie from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';

describe('POST /api/auth/logout', () => {

    jest.mock('cookie', () => ({
    serialize: jest.fn(),
    }));

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 200 and clears the auth cookie', async () => {
    const { req, res } = createMocks({
      method: 'POST',
        headers: {
            cookie: 'auth=admin-session-token',
        },
    });

    expect(req.headers.cookie).toBe('auth=admin-session-token');
    
    await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);
    
    expect(res._getStatusCode()).toBe(200);
    expect(res._getData()).toEqual(JSON.stringify({ success: true }));
    expect(res._getHeaders()['set-cookie']).not.toContain('admin-session-token');
  });

});