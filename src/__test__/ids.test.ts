import { createMocks } from 'node-mocks-http';
import { Employee } from '../../models/employeemodel';
import { connectDB } from '../../models/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import handler from '../pages/api/employees/ids'; 

jest.mock('../../models/employeemodel', () => ({
  Employee: {
    find: jest.fn(),
  },
}));

jest.mock('../../models/mongodb', () => ({
  connectDB: jest.fn(),
}));

describe('../pages/api/employees/ids', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns sorted employee IDs successfully', async () => {
    const mockEmployees = [
      { employeeID: 1 },
      { employeeID: 2 },
      { employeeID: 3 },
    ];

    const mockSort = jest.fn().mockResolvedValue(mockEmployees);
    (Employee.find as jest.Mock).mockReturnValue({ sort: mockSort });

    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

    expect(connectDB).toHaveBeenCalled();
    expect(Employee.find).toHaveBeenCalledWith({}, 'employeeID');
    expect(mockSort).toHaveBeenCalledWith({ employeeID: 1 });
    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual([1, 2, 3]);
  });

  it('returns 500 on error during fetch', async () => {
    const mockSort = jest.fn().mockRejectedValue(new Error('DB error'));
    (Employee.find as jest.Mock).mockReturnValue({ sort: mockSort });

    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Failed to fetch employee IDs',
    });
  });
});