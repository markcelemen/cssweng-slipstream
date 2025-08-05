import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../../../../models/mongodb';
import { Employee } from '../../../../models/employeemodel';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();
  const query = (req.query.q as string || "").toLowerCase().trim();

  if (!query) return res.status(200).json([]);

  const employees = await Employee.find({});
  const filtered = employees.filter(emp => {
    const fullName = `${emp.firstName} ${emp.middleName ?? ""} ${emp.lastName}`.toLowerCase();
    return (
      fullName.includes(query) ||
      emp.employeeID.toString().includes(query)
    );
  });

  res.status(200).json(filtered.slice(0, 10)); // return top 10 matches
}
