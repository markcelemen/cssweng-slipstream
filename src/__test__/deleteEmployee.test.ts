import handler from '../pages/api/employees/delete';
import { createMocks } from 'node-mocks-http';
import { Employee } from '../../models/employeemodel';
import { connectDB } from '../../models/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import AttendanceEntryModel from '../../models/attendancemodel';
import PTOModel from '../../models/ptomodel';

// ✅ Mock all dependencies
jest.mock('../../models/mongodb', () => ({
  connectDB: jest.fn(),
}));

jest.mock('../../models/employeemodel', () => ({
  Employee: {
    deleteMany: jest.fn(),
  },
}));

jest.mock('../../models/attendancemodel', () => ({
  __esModule: true,
  default: {
    deleteMany: jest.fn(),
  },
}));

jest.mock('../../models/ptomodel', () => ({
  __esModule: true,
  default: {
    deleteMany: jest.fn(),
  },
}));

jest.setTimeout(10000); // Optional, for safety

describe('DELETE /api/employees/delete', () => {
  const mockDeleteEmployees = Employee.deleteMany as jest.Mock;
  const mockDeleteAttendance = AttendanceEntryModel.deleteMany as jest.Mock;
  const mockDeletePTO = PTOModel.deleteMany as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    (connectDB as jest.Mock).mockResolvedValue(undefined);
  });

  it('returns 200 and deletes employees and related data on success', async () => {
    mockDeleteEmployees.mockResolvedValue({ acknowledged: true });
    mockDeleteAttendance.mockResolvedValue({ acknowledged: true });
    mockDeletePTO.mockResolvedValue({ acknowledged: true });

    const { req, res } = createMocks({
      method: 'DELETE',
      body: {
        employeeIDs: [123, 456],
      },
    });

    await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

    expect(connectDB).toHaveBeenCalled();
    expect(mockDeleteEmployees).toHaveBeenCalledWith({ employeeID: { $in: [123, 456] } });
    expect(mockDeleteAttendance).toHaveBeenCalledWith({ employeeID: { $in: [123, 456] } });
    expect(mockDeletePTO).toHaveBeenCalledWith({ employeeID: { $in: [123, 456] } });

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({
      success: true,
      message: 'Employees deleted',
    });
  });

  it('returns 400 for invalid employeeIDs input', async () => {
    const { req, res } = createMocks({
      method: 'DELETE',
      body: {
        employeeIDs: 'invalid',
      },
    });

    await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData())).toEqual({
      success: false,
      message: 'Invalid employeeIDs array',
    });
  });

  it('returns 500 on database error', async () => {
    mockDeleteEmployees.mockRejectedValue(new Error('DB error'));

    const { req, res } = createMocks({
      method: 'DELETE',
      body: {
        employeeIDs: [123],
      },
    });

    await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      success: false,
      message: 'DB error',
    });
  });

  it('returns 405 for non-DELETE methods', async () => {
    const { req, res } = createMocks({
      method: 'POST',
    });

    await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

    expect(res._getStatusCode()).toBe(405);
    expect(JSON.parse(res._getData())).toEqual({
      success: false,
      message: 'Method not allowed',
    });
  });
});