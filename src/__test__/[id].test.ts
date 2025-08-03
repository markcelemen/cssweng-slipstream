import { createMocks } from 'node-mocks-http';
import { Employee } from '../../models/employeemodel';
import { connectDB } from '../../models/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import handler from '../pages/api/employees/[id]'; 

jest.mock('../../models/employeemodel', () => ({
  Employee: {
    findOne: jest.fn(),
  },
}));

jest.mock('../../models/mongodb', () => ({
  connectDB: jest.fn(),
}));

describe('../pages/api/employees/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns employee data if found', async () => {
    const mockEmployee = {
      employeeID: 123,
      name: 'Test Employee',
    };

    (Employee.findOne as jest.Mock).mockResolvedValue(mockEmployee);

    const { req, res } = createMocks({
      method: 'GET',
      query: {
        id: '123',
      },
    });

    await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

    expect(connectDB).toHaveBeenCalled();
    expect(Employee.findOne).toHaveBeenCalledWith({ employeeID: 123 });
    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual(mockEmployee);
  });

  it('returns 404 if employee not found', async () => {
    (Employee.findOne as jest.Mock).mockResolvedValue(null);

    const { req, res } = createMocks({
      method: 'GET',
      query: {
        id: '999',
      },
    });

    await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

    expect(res._getStatusCode()).toBe(404);
    expect(JSON.parse(res._getData())).toEqual({ error: 'Not found' });
  });

  it('returns 500 on database error', async () => {
    (Employee.findOne as jest.Mock).mockRejectedValue(new Error('DB error'));

    const { req, res } = createMocks({
      method: 'GET',
      query: {
        id: '500',
      },
    });

    await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Failed to fetch employee',
    });
  });
});