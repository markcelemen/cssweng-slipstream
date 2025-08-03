import { createMocks } from 'node-mocks-http';
import { Employee } from '../../models/employeemodel';
import { connectDB } from '../../models/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import handler from '../pages/api/attendance/completeGForm'; 

jest.mock('../../models/mongodb', () => ({
  connectDB: jest.fn(),
}));

jest.mock('../../models/employeemodel', () => ({
  Employee: {
    find: jest.fn(),
  },
}));

describe('../pages/api/attendance/completeGForm', () => {
  const mockSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 405 if method is not POST', async () => {
    const { req, res } = createMocks({ method: 'GET' });

    await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

    expect(res._getStatusCode()).toBe(405);
    expect(JSON.parse(res._getData())).toEqual({ message: 'Method not allowed' });
  });

  it('returns 400 if body is missing or invalid', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {},
    });

    await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData())).toEqual({ message: 'Invalid input' });
  });

  it('returns 200 and employee info if query is successful', async () => {
    const employeeNames = [
      { lastName: 'Doe', firstName: 'John', middleInitial: 'A' },
    ];

    const mockEmployees = [
      {
        lastName: 'Doe',
        firstName: 'John',
        middleName: 'Allen',
        employeeID: 123,
        totalSalary: 50000,
      },
    ];

    mockSelect.mockResolvedValue(mockEmployees);
    (Employee.find as jest.Mock).mockReturnValue({ select: mockSelect });

    const { req, res } = createMocks({
      method: 'POST',
      body: { employeeNames },
    });

    await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

    expect(connectDB).toHaveBeenCalled();
    expect(Employee.find).toHaveBeenCalledWith({
      $or: [
        {
          lastName: 'Doe',
          firstName: 'John',
          middleName: new RegExp('^A', 'i'),
        },
      ],
    });
    expect(mockSelect).toHaveBeenCalledWith('employeeID lastName firstName middleName totalSalary');

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual([
      {
        lastName: 'Doe',
        firstName: 'John',
        middleName: 'Allen',
        employeeID: 123,
        salary: 50000,
      },
    ]);
  });

  it('returns 500 on internal error', async () => {
    (Employee.find as jest.Mock).mockImplementation(() => {
      throw new Error('DB failed');
    });

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        employeeNames: [{ lastName: 'Smith', firstName: 'Anna', middleInitial: 'M' }],
      },
    });

    await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({ message: 'Internal Server Error' });
  });
});