import type { NextApiRequest, NextApiResponse } from 'next';
import { Employee } from '../../../../models/employeemodel';
import { connectDB } from '../../../../models/mongodb';

//Adds the employee data into the database
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      await connectDB();

      const {
        employeeID, lastName, firstName, middleName,
        department, coordinator, position, contactInfo,
        email, totalSalary, basicSalary
      } = req.body;

      const requiredFields = [
        employeeID, lastName, firstName, middleName,
        department, coordinator, position, contactInfo,
        email, totalSalary, basicSalary
       ];

      if (requiredFields.some(field => field === undefined)) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields',
        });
      }
      console.log("Request Body:", req.body);
      const newEmployee = await Employee.create(req.body);
      return res.status(201).json({ success: true, data: newEmployee });
      
    } catch (err: any) {
        console.error("Error creating employee:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to add employee",
            error: err.message || JSON.stringify(err),
        });
        }
  } else {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }
}
