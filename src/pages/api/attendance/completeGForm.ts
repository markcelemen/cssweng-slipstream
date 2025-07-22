import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../../../../models/mongodb';
import { Employee } from '../../../../models/employeemodel';
import { EmployeeInfo } from '../../../utils/attendance/attendanceTypes';

/**
 * API route handler for fetching employee information.
 * 
 * Expects a request containing employee names in the body,
 * queries the database for matching employee records, and responds with an array of
 * `EmployeeInfo` objects. If an error occurs, responds with an error message.
 *
 * @param req The incoming Next.js API request.
 * @param res The outgoing Next.js API response, returning either:
 *            - An array of `EmployeeInfo` on success, or
 *            - An object with a `message` field on failure.
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<EmployeeInfo[] | { message: string }>
) {
    // checks if method is invalid
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' })
    }
    // gets request body
    const { employeeNames } = req.body as { employeeNames?: string[] };

    // checks input if invalid
    if (!employeeNames || !Array.isArray(employeeNames) || employeeNames.length === 0) {
        return res.status(400).json({ message: 'Invalid input' });
    }

    try {
        await connectDB();

        // fetches data from database
        const employees = await Employee.find({ employeeName: {$in: employeeNames} })
        .select('employeeID lastName firstName middleName totalSalary');

        // maps the results to an EmployeeInfo object
        const result = employees.map((e : any) => ({
            lastName: e.lastName,
            firstName: e.firstName,
            middleName: e.middleName,
            employeeID: e.employeeID,
            salary: e.totalSalary,
        }));

        return res.status(200).json(result);
    }
    // some error
    catch (err) {
        console.error('Error fetching employee info: ', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}