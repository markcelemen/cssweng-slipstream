import handler from '../pages/api/employees/add'; // Adjust the path
import { createMocks } from 'node-mocks-http';
import { Employee } from '../../models/employeemodel';
import * as db from '../../models/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

jest.mock('../../models/mongodb', () => ({
  connectDB: jest.fn()
}));

jest.mock('../../models/employeemodel', () => ({
  Employee: {
    create: jest.fn()
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

describe('POST /api/employee', () => {
  it('should create a new employee and return 201', async () => {
    
    (Employee.create as jest.Mock).mockResolvedValue(mockEmployee);

    const { req, res } = createMocks({
      method: 'POST',
      body: mockEmployee
    });

    await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

    expect(res._getStatusCode()).toBe(201);
    expect(JSON.parse(res._getData())).toEqual({
      success: true,
      data: mockEmployee
    });
  });

  it('should return 400 as there is a missing field', async () => {

    const incompleteEmployee = {
      employeeID: 80000002,
      lastName: 'Smith'
    };

    (Employee.create as jest.Mock).mockResolvedValue(incompleteEmployee);
    const { req, res } = createMocks({
      method: 'POST',
      body: incompleteEmployee
    });

    await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData())).toMatchObject({
      success: false,
      message: 'Missing required fields'
    });
  });

  it('should return 500 if there is an error creating the employee', async () => {
    const errorMessage = 'Database error';
    (Employee.create as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const { req, res } = createMocks({
      method: 'POST',
      body: mockEmployee
    });
    await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);
    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toMatchObject({
        success: false,
        message: 'Failed to add employee',
    });
});
        


  it('should return 405 for non-POST methods', async () => {
    const { req, res } = createMocks({
      method: 'GET'
    });

    await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

    expect(res._getStatusCode()).toBe(405);
    expect(JSON.parse(res._getData())).toEqual({
      success: false,
      message: 'Method not allowed'
    });
  });
});
