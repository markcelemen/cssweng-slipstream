import type { NextApiRequest, NextApiResponse } from 'next';
import { Employee } from '../../../../models/employeemodel';
import { connectDB } from '../../../../models/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      await connectDB();

      const employees = req.body;

      if (!Array.isArray(employees)) {
        return res.status(400).json({
          success: false,
          message: 'Request body must be an array of employee objects',
        });
      }

      const results = [];

      for (const emp of employees) {
        const {
          employeeID, lastName, firstName, middleName,
          department, coordinator, position, contactInfo,
          email, totalSalary, basicSalary
        } = emp;

        const requiredFields = [
          employeeID, lastName, firstName, middleName,
          department, coordinator, position, contactInfo,
          email, totalSalary, basicSalary
        ];

        if (requiredFields.some(field => field === undefined)) {
          results.push({
            employeeID,
            success: false,
            message: 'Missing required fields',
          });
          continue;
        }

        const updated = await Employee.findOneAndUpdate(
          { employeeID },
          {
            lastName,
            firstName,
            middleName,
            department,
            coordinator,
            position,
            contactInfo,
            email,
            totalSalary,
            basicSalary
          },
          {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true
          }
        );

        results.push({ employeeID, success: true, data: updated });
      }

      return res.status(200).json({ success: true, results });

    } catch (err: any) {
      console.error("Error processing employees:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to add or update employees",
        error: err.message || JSON.stringify(err),
      });
    }
  } else {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }
}
