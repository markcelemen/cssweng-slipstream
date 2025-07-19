import handler from '../pages/api/employees/update';
import { createMocks } from 'node-mocks-http';
import { connectDB } from '../../models/mongodb';
import { Employee } from '../../models/employeemodel';
import { NextApiRequest, NextApiResponse } from 'next';

jest.mock('../../models/mongodb', () => ({
  connectDB: jest.fn()
}));

jest.mock('../../models/employeemodel', () => ({
  Employee: {
    updateMany: jest.fn()
  }
}));

describe('/api/employees/update PUT', () => {
  it('returns 405 for non-PUT requests', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

    expect(res._getStatusCode()).toBe(405);
    expect(JSON.parse(res._getData())).toEqual({
      success: false,
      message: 'Method not allowed',
    });
  });

  it('returns 400 for invalid input', async () => {
    const { req, res } = createMocks({
      method: 'PUT',
      body: {
        employeeIDs: 'not-valid',
        updates: 'not-an-object',
      },
    });

    await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData())).toEqual({
      success: false,
      message: 'Invalid input',
    });
  });

  it('updates employees and returns 200 for valid input', async () => {
    const { req, res } = createMocks({
      method: 'PUT',
      body: {
        employeeIDs: [1001, 1002],
        updates: { department: 'HR' },
      },
    });

    const mockUpdateMany = Employee.updateMany as jest.Mock;
    mockUpdateMany.mockResolvedValue({ acknowledged: true });

    await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

    expect(connectDB).toHaveBeenCalled();
    expect(mockUpdateMany).toHaveBeenCalledWith(
      { employeeID: { $in: [1001, 1002] } },
      { $set: { department: 'HR' } }
    );
    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({ success: true });
  });

  it('returns 500 if update fails', async () => {
    const { req, res } = createMocks({
      method: 'PUT',
      body: {
        employeeIDs: [1001],
        updates: { position: 'Manager' },
      },
    });

    const mockUpdateMany = Employee.updateMany as jest.Mock;
    mockUpdateMany.mockRejectedValue(new Error('Database error'));

    await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      success: false,
      message: 'Database error',
    });
  });
});