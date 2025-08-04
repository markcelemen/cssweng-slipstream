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
    console.log("📥 Uploading entry:", entry); // log incoming entry

    const existingEmployee = await Employee.findOne({ employeeID: entry.employeeID });

    if (!existingEmployee) {
      console.log("Creating new employee:", entry.employeeID);
      await Employee.create({
        employeeID: entry.employeeID,
        lastName: entry.lastName || 'N/A',
        firstName: entry.firstName || 'N/A',
        middleName: '',
        department: 'N/A',
        coordinator: false,
        position: 'N/A',
        contactInfo: '09123456789',
        email: 'employee@gmail.com',
        totalSalary: 0,
        basicSalary: 0,
        birthdate: '',
        numberOfPTOs: 0,
        remarks: '',
      });
    }

    console.log("🕓 Creating attendance entry for:", entry.employeeID);

    await AttendanceEntryModel.create({
      datetime: new Date(entry.datetime),
      employeeID: entry.employeeID,
      lastName: entry.lastName || '',
      firstName: entry.firstName || '',
      middleName: '',
      type: entry.type,
      source: entry.source,
      note: entry.note || '',
    });
  }

  return res.status(200).json({ message: 'GLog entries uploaded successfully' });
} catch (error) {
  console.error("❌ Error uploading GLog entries:", error);
  return res.status(500).json({ error: 'Internal Server Error' });
}
}
