import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../../../../models/mongodb';
import { Employee } from '../../../../models/employeemodel';
import { EmployeeInfo } from '../../../utils/attendance/googleForm';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<EmployeeInfo[] | { message: string }>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    const { employeeNames } = req.body as { employeeNames?: string[] };

    if (!employeeNames || !Array.isArray(employeeNames) || employeeNames.length === 0) {
        return res.status(400).json({ message: 'Invalid input' });
    }

    try {
        await connectDB();

        const employees = await Employee.find({ employeeName: {$in: employeeNames} }).select('employeeName lastName firstName middleName totalSalary');

        const result = employees.map((e : Employee) => ({
            employeeID: e.employeeID,
            employeeName: `${e.lastName}, ${e.firstName}`, // check if may middle name
            salary: e.totalSalary,
        }));

        return res.status(200).json(result);
    }
    catch (err) {
        console.error('Error fetching employee info: ', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

