import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../../../../models/mongodb';
import AttendanceEntryModel from '../../../../models/attendancemodel';
import { Employee } from '../../../../models/employeemodel';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  await connectDB();

  const entries = req.body;

  if (!Array.isArray(entries)) {
    return res.status(400).json({ error: 'Invalid data format: expected array' });
  }

  try {
    // Get all current employee IDs
    const existingEmployees = await Employee.find({}, 'employeeID firstName lastName middleName');
    const usedIds = new Set(existingEmployees.map(e => e.employeeID));

    // Helper to generate next 9-digit ID
    const getNextEmployeeID = () => {
      for (let i = 1; i < 1e9; i++) {
        const padded = i.toString().padStart(9, '0');
        if (!usedIds.has(Number(padded))) {
          usedIds.add(Number(padded));
          return Number(padded);
        }
      }
      throw new Error("⚠️ Exhausted employee ID space");
    };

    for (const entry of entries) {
      const { lastName, firstName, middleName = "" } = entry;

      const matchedEmployee = existingEmployees.find(e =>
        e.lastName.toLowerCase().trim() === lastName.toLowerCase().trim() &&
        e.firstName.toLowerCase().trim() === firstName.toLowerCase().trim() &&
        (e.middleName || "").toLowerCase().trim() === middleName.toLowerCase().trim()
      );

      let employee = matchedEmployee;

      // 👤 If not found, create a new employee with generated ID
      if (!employee) {
        const newId = getNextEmployeeID();

        employee = await Employee.create({
          employeeID: newId,
          lastName: lastName || "N/A",
          firstName: firstName || "N/A",
          middleName: middleName || "",
          department: "N/A",
          coordinator: false,
          position: "N/A",
          contactInfo: "09123456789",
          email: "employee@gmail.com",
          totalSalary: 0,
          basicSalary: 0,
          birthdate: "",
          numberOfPTOs: 0,
          remarks: "",
        });
      }

      await AttendanceEntryModel.create({
        datetime: entry.datetime,
        employeeID: employee.employeeID,
        lastName: employee.lastName,
        firstName: employee.firstName,
        middleName: employee.middleName || '',
        type: entry.type,
        source: entry.source,
        note: entry.note || '',
      });
    }

    return res.status(200).json({ message: 'GDoc entries uploaded successfully' });
  } catch (error) {
    console.error("❌ Error uploading GDoc entries:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
