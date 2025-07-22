import Papa, { ParseError } from "papaparse";
import { AttendanceEntry, GLogEntry, EmployeeInfo } from "./attendanceTypes";
import { computeEarlyDeduct, computeLateDeduct } from "./computeDeductions";

/**
 * Parses the raw CSV text from a Google Logging export into an array of GLogEntry objects.
 *
 * @param text The CSV file contents as a string.
 * @returns    An array of `GLogEntry` objects parsed from the CSV.
 */
export function parseGLog(text: string): GLogEntry[] {
    // mapper for header name and count
    const headerCount: Record<string, number> = {};

    // parses CSV file
    const results = Papa.parse<Partial<GLogEntry>>(text, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header : string) => {
            // converts headers to lowercase and removes spaces
            const base = header.trim().toLowerCase();//.replace(/\s+/g, '');
            
            // handles duplicate headers (e.g. date)
            if (headerCount[base] == null || headerCount[base] == 0) {
                headerCount[base] = 0;
                return base;
            } else {
                // appends a number to the duplicate instance
                headerCount[base]++;
                return `${base}${headerCount[base]}`;
            }
        }
    });
    
    // some error
    if (results.errors.length > 0) {
        throw new Error(
            `Error parsing GLog CSV: ${results.errors
                .map((e: ParseError) => e.message)
                .join(", ")}`
            );
    }
    
    // maps results to a GLogEntry object
    return results.data.map((row : Partial<GLogEntry>): GLogEntry => ({
        no: (row.no ?? "").trim(),
        mchn: (row.mchn ?? "").trim(),
        enno: (row.enno ?? "").trim(),
        name: (row.name ?? "").trim(),
        mode: (row.mode ?? "").trim(),
        iomd: (row.iomd ?? "").trim(),
        datetime: (row.datetime ?? "").trim()
    }));
}

/**
 * Normalizes an array of `GLogEntry` records into the unified `AttendanceEntry` format.
 * Performs a database lookup to complete missing information and
 * transforms the data into an AttendanceEntry.
 *
 * @param data  The parsed Google Log entries to normalize.
 * @returns     A promise that resolves to an array of fully populated `AttendanceEntry` objects.
 */
export async function normalizeGLog(data : GLogEntry[]): Promise<AttendanceEntry[]> {
    // gets the employee ids
    const employeeIDs = Array.from(new Set(data.map((row) => row.enno)));
    
    // fetches the employees' details
    const employeeInfoList = await fetchEmployeeInfo(employeeIDs);

    // maps the employee details to their id
    const employeeInfoMap = new Map<number, EmployeeInfo>();
    employeeInfoList.forEach((info) => {
        employeeInfoMap.set(info.employeeID, info);
    });

    return data.map((row) => {
        const employeeInfo = employeeInfoMap.get(Number(row.enno));
        

       // completes the fields of AttendanceEntry
        const datetime = new Date(`${row.datetime}`);
        const middleInitial = employeeInfo?.middleName
            ? employeeInfo.middleName.trim().charAt(0).toUpperCase() + "."
            : "";
        const employeeName = `${employeeInfo?.lastName ?? ""}, ${employeeInfo?.firstName ?? ""}${middleInitial ? " " + middleInitial : ""}`;

        // maps the results to an AttendanceEntry
        return {
            datetime: datetime,
            employeeID: Number(row.enno),
            employeeName: employeeName,
            lateDeduct: computeLateDeduct(datetime),
            earlyDeduct: computeEarlyDeduct(datetime, employeeInfo?.salary ?? -999),
            remarks: "",
        }
    });
}

/**
 * Fetches detailed employee information for the given list of employee ids.
 *
 * @param employeeNames  An array of employee names to look up.
 * @returns              A promise that resolves to an array of `EmployeeInfo` objects
 *                       containing the matched employee data.
 */
async function fetchEmployeeInfo(employeeIDs : string[]): Promise<EmployeeInfo[]>{
    // create post request
    const res = await fetch('api/attendance/completeGLog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({employeeIDs}),
    });

    if(!res.ok){
        console.error('Failed to fetch employee info');
    }

    return await res.json();
}