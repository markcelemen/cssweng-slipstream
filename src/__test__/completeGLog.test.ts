import { createMocks } from 'node-mocks-http';
import { Employee } from '../../models/employeemodel';
import { connectDB } from '../../models/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import handler from '../pages/api/attendance/completeGLog'; 

jest.mock('../../models/mongodb', () => ({
  connectDB: jest.fn(),
}));

jest.mock('../../models/employeemodel', () => ({
  Employee: {
    find: jest.fn(),
  },
}));

describe('../pages/api/attendance/completeGLog', () => {
  const mockSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 405 for non-POST requests', async () => {
    const { req, res } = createMocks({ method: 'GET' });

    await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

    expect(res._getStatusCode()).toBe(405);
    expect(JSON.parse(res._getData())).toEqual({ message: 'Method not allowed' });
  });

  it('returns 400 for missing or invalid employeeIDs in body', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {},
    });

    await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData())).toEqual({ message: 'Invalid input' });
  });

  it('returns 200 with employee info if found', async () => {
    const employeeIDs = ['123', '456'];

    const mockEmployees = [
      {
        employeeID: '123',
        lastName: 'Doe',
        firstName: 'Jane',
        middleName: 'A.',
        totalSalary: 60000,
      },
      {
        employeeID: '456',
        lastName: 'Smith',
        firstName: 'John',
        middleName: 'B.',
        totalSalary: 70000,
      },
    ];

    mockSelect.mockResolvedValue(mockEmployees);
    (Employee.find as jest.Mock).mockReturnValue({ select: mockSelect });

    const { req, res } = createMocks({
      method: 'POST',
      body: { employeeIDs },
    });

    await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

    expect(connectDB).toHaveBeenCalled();
    expect(Employee.find).toHaveBeenCalledWith({
      employeeID: { $in: employeeIDs },
    });
    expect(mockSelect).toHaveBeenCalledWith('employeeID lastName firstName middleName totalSalary');

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual([
      {
        employeeID: '123',
        lastName: 'Doe',
        firstName: 'Jane',
        middleName: 'A.',
        salary: 60000,
      },
      {
        employeeID: '456',
        lastName: 'Smith',
        firstName: 'John',
        middleName: 'B.',
        salary: 70000,
      },
    ]);
  });

  it('returns 500 on internal server error', async () => {
    (Employee.find as jest.Mock).mockImplementation(() => {
      throw new Error('DB failure');
    });

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        employeeIDs: ['123'],
      },
    });

    await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({ message: 'Internal Server Error' });
  });
});