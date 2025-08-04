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
    for (const entry of entries) {
      const { lastName, firstName, middleName = "" } = entry;

      const employee = await Employee.findOne({
        lastName: new RegExp(`^${lastName}$`, "i"),
        firstName: new RegExp(`^${firstName}$`, "i"),
        middleName: new RegExp(`^${middleName}$`, "i"),
      });

      if (!employee) {
        console.warn(`No match found for: ${lastName}, ${firstName} ${middleName}`);
        continue;
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
    console.error("Error uploading GDoc entries:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
