import handler from '../pages/api/employees/index';
import { createMocks } from 'node-mocks-http';
import { Employee } from '../../models/employeemodel';
import * as db from '../../models/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

jest.mock('../../models/mongodb', () => ({
  connectDB: jest.fn()
}));

jest.mock('../../models/employeemodel', () => ({
  Employee: {
    find: jest.fn()
  }
}));

const mockEmployee = {
    employeeID: 80000001,
    lastName: 'Doe',
    firstName: 'John',
    middleName: 'X',
    department: 'IT',
    coordinator: 'Manager',
    position: 'Developer',
    contactInfo: '09123456789',
    email: 'john.doe@gmail.com',
    totalSalary: 50000,
    basicSalary: 40000
};

describe('GET /api/employees/index', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    it('returns 200 and employee data on success', async () => {
        (Employee.find as jest.Mock).mockResolvedValue([mockEmployee]);

        const { req, res } = createMocks({
        method: 'GET',
        });

        await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);
        expect(res._getStatusCode()).toBe(200);
        expect(JSON.parse(res._getData())).toEqual({
            success: true,
            data: [mockEmployee]
        });
    });

    it('returns 500 on database error', async () => {
        (Employee.find as jest.Mock).mockRejectedValue(new Error('DB fail'));

        const { req, res } = createMocks({
        method: 'GET',
        });

        await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

        expect(res._getStatusCode()).toBe(500);
        expect(JSON.parse(res._getData())).toEqual({
        success: false,
        message: 'DB fail',
        });
    });

    it('returns 405 on non-GET request', async () => {
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