import { createMocks } from 'node-mocks-http';
import { Employee } from '../../models/employeemodel';
import AttendanceEntryModel from '../../models/attendancemodel';
import { connectDB } from '../../models/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import handler from '../pages/api/attendance/uploadGlog'; 

jest.mock('../../models/mongodb', () => ({
  connectDB: jest.fn()
}));

jest.mock('../../models/employeemodel', () => ({
  Employee: {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn()
  }
}));

jest.mock('../../models/attendancemodel', () => ({
  __esModule: true,
  default: {
    create: jest.fn()
  }
}));

describe('POST /api/employees/uploadGDocEntries', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates attendance entries and new employees if not existing', async () => {
    const mockEmployees = [
      { employeeID: 12345678, firstName: 'John', lastName: 'Doe', middleName: '' }
    ];

    const newEntry = {
      employeeID: 87654321,
      firstName: 'Jane',
      lastName: 'Smith',
      middleName: '',
      datetime: '2025-08-06T08:00:00Z',
      type: 'IN',
      source: 'GDoc',
      note: ''
    };

    (Employee.find as jest.Mock).mockResolvedValue(mockEmployees);
    (Employee.create as jest.Mock).mockResolvedValue({
      ...newEntry,
      department: 'N/A',
      coordinator: false,
      position: 'N/A',
      contactInfo: '09123456789',
      email: 'employee@gmail.com',
      totalSalary: 0,
      basicSalary: 0,
      birthdate: '',
      numberOfPTOs: 0,
      remarks: ''
    });
    (AttendanceEntryModel.create as jest.Mock).mockResolvedValue({});

    const { req, res } = createMocks({
      method: 'POST',
      body: [newEntry],
    });

    await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

    expect(connectDB).toHaveBeenCalled();
    expect(Employee.find).toHaveBeenCalled();
    expect(Employee.create).toHaveBeenCalled();
    expect(AttendanceEntryModel.create).toHaveBeenCalledWith({
      datetime: newEntry.datetime,
      employeeID: newEntry.employeeID,
      lastName: newEntry.lastName,
      firstName: newEntry.firstName,
      middleName: newEntry.middleName,
      type: newEntry.type,
      source: newEntry.source,
      note: '',
    });

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({
      message: 'GDoc entries uploaded successfully'
    });
  });

  it('returns 400 for non-array input', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: { not: 'an array' },
    });

    await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Invalid data format: expected array',
    });
  });

  it('returns 405 for unsupported methods', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

    expect(res._getStatusCode()).toBe(405);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Method not allowed',
    });
  });

  it('returns 500 on server error', async () => {
    (Employee.find as jest.Mock).mockRejectedValue(new Error('DB Error'));

    const { req, res } = createMocks({
      method: 'POST',
      body: [{
        employeeID: 12345678,
        firstName: 'Test',
        lastName: 'User',
        datetime: '2025-08-06T08:00:00Z',
        type: 'IN',
        source: 'GDoc'
      }],
    });

    await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Internal Server Error'
    });
  });
});