import Papa, { ParseError } from "papaparse";
import { AttendanceEntry } from "./attendance";

export interface GFormEntry {
    timestamp: string;
    nameofemployee: string;
    action: string;
    note: string;
    date: string;
    date1: string;
}

export interface EmployeeInfo {
    employeeName: string;
    employeeID: number;
    salary: number;
}

export function parseGForm(text: string): GFormEntry[] {
    console.log("bruh");
    const headerCount: Record<string, number> = {};
    const results = Papa.parse<Partial<GFormEntry>>(text, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header : string) => {
            console.log(header);
            const base = header.trim().toLowerCase().replace(/\s+/g, '');
            console.log(base);
            console.log(header)
            if (headerCount[base] == null || headerCount[base] == 0) {
                headerCount[base] = 0;
                return base;
            } else {
                headerCount[base]++;
                return `${base}${headerCount[base]}`;
            }
        }
    });

    if (results.errors.length > 0) {
        throw new Error(
            `Error parsing GForm CSV: ${results.errors
                .map((e: ParseError) => e.message)
                .join(", ")}`
        );
    }
    console.log(results.data);
    return results.data.map((row: Partial<GFormEntry>): GFormEntry => ({
        timestamp: (row.timestamp ?? "").trim(),
        nameofemployee: (row.nameofemployee ?? "").trim(),
        action: (row.action ?? "").trim(),
        note: (row.note ?? "").trim(),
        date: (row.date ?? "").trim(),
        date1: (row.date1 ?? "").trim(),
    }));
}

export async function normalizeGForm(data : GFormEntry[]): Promise<AttendanceEntry[]> {
    console.log(data);

    const employeeNames = Array.from(new Set(data.map((row) => row.nameofemployee)));
    const employeeInfoList = await fetchEmployeeInfo(employeeNames);

    const employeeInfoMap = new Map<string, EmployeeInfo>();
    employeeInfoList.forEach((info) => {
        employeeInfoMap.set(info.employeeName, info);
    });

    return data.map((row) => {
       const employeeInfo = employeeInfoMap.get(row.nameofemployee);

        const datetime = new Date(`${row.timestamp}`);
        const employeeID = employeeInfo?.employeeID ?? 0; // find alternative for default
        const employeeName = row.nameofemployee;
        const lateDeduct = computeLateDeduct(datetime, employeeInfo?.salary ?? 0);
        const remarks = row.note;
        return {
            datetime,
            employeeID,
            employeeName,
            lateDeduct,
            remarks
        }
    });
}

async function fetchEmployeeInfo(employeeNames : string[]): Promise<EmployeeInfo[]>{
    const res = await fetch('api/attendance/completeGForm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({employeeNames}),
    });

    if(!res.ok){
        console.error('Failed to fetch employee info');
    }

    return await res.json();
}
// how to handle custom late threshold
function computeLateDeduct(clockIn: Date, salary: number): number { // salary is used for early out deduction
    const startTime = new Date(clockIn);
    startTime.setHours(8, 0, 0, 0);

    const diff = clockIn.getTime() - startTime.getTime();
    const diffMinutes = Math.floor(diff / 60000);

    return diffMinutes > 0 ? diffMinutes : 0;
}

function computeEarlyDeduct(clockOut: Date, salary: number): number{
    return 0;
}