import { createMocks } from 'node-mocks-http';
import { Employee } from '../../models/employeemodel';
import AttendanceEntryModel from '../../models/attendancemodel';
import { connectDB } from '../../models/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import handler from '../pages/api/attendance/uploadGdoc'; 

jest.mock('../../models/mongodb', () => ({
  connectDB: jest.fn(),
}));

jest.mock('../../models/employeemodel', () => ({
  Employee: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock('../../models/attendancemodel', () => ({
  __esModule: true,
  default: {
    create: jest.fn(),
  },
}));

describe('POST /api/attendance/upload/gdoc', () => {
  const mockReq = {
    method: 'POST',
    body: [
      {
        lastName: 'Doe',
        firstName: 'John',
        middleName: 'A',
        employeeID: 'EMP123',
        datetime: '2025-08-07T08:00:00Z',
        type: 'IN',
        source: 'gdoc',
        note: 'On time',
      },
    ],
  };

  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 405 if method is not POST', async () => {
    await handler({ method: 'GET' } as any, mockRes as any);
    expect(mockRes.status).toHaveBeenCalledWith(405);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Method not allowed' });
  });

  it('returns 400 if body is not an array', async () => {
    await handler({ method: 'POST', body: {} } as any, mockRes as any);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Invalid data format: expected array' });
  });

  it('creates employee and attendance if employee not found', async () => {
    (Employee.findOne as jest.Mock).mockResolvedValue(null);
    (Employee.create as jest.Mock).mockResolvedValue({
      employeeID: 'EMP123',
      lastName: 'Doe',
      firstName: 'John',
      middleName: 'A',
    });

    await handler(mockReq as any, mockRes as any);

    expect(connectDB).toHaveBeenCalled();
    expect(Employee.findOne).toHaveBeenCalledWith({
      lastName: /^Doe$/i,
      firstName: /^John$/i,
      middleName: /^A$/i,
    });

    expect(Employee.create).toHaveBeenCalled();
    expect(AttendanceEntryModel.create).toHaveBeenCalledWith({
      datetime: '2025-08-07T08:00:00Z',
      employeeID: 'EMP123',
      lastName: 'Doe',
      firstName: 'John',
      middleName: 'A',
      type: 'IN',
      source: 'gdoc',
      note: 'On time',
    });

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'GDoc entries uploaded successfully' });
  });

  it('returns 500 on error', async () => {
    (Employee.findOne as jest.Mock).mockRejectedValue(new Error('DB error'));

    await handler(mockReq as any, mockRes as any);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});