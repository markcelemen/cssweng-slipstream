import handler from '../pages/api/employees/delete';
import { createMocks } from 'node-mocks-http';
import { Employee } from '../../models/employeemodel';
import { connectDB } from '../../models/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

jest.mock('../../models/mongodb', () => ({
  connectDB: jest.fn()
}));

jest.mock('../../models/employeemodel', () => ({
  Employee: {
    deleteMany: jest.fn()
  }
}));

describe('DELETE /api/employees/delete', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

    it('returns 200 and deletes employees on success', async () => {
        const mockedEmployee = Employee as unknown as { deleteMany: jest.Mock };
        mockedEmployee.deleteMany.mockResolvedValue({ acknowledged: true });

        const { req, res } = createMocks({
            method: 'DELETE',
            body: {
            employeeIDs: [80000001, 80000002],
            },
        });

        await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

        expect(connectDB).toHaveBeenCalled();
        expect(mockedEmployee.deleteMany).toHaveBeenCalledWith({
            employeeID: { $in: [80000001, 80000002] },
        });
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
            employeeIDs: 'not-an-array',
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
        const mockedEmployee = Employee as unknown as { deleteMany: jest.Mock };
        mockedEmployee.deleteMany.mockRejectedValue(new Error('DB error'));

        const { req, res } = createMocks({
        method: 'DELETE',
        body: {
            employeeIDs: [80000001],
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