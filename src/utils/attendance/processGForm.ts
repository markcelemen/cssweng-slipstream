import Papa, { ParseError } from "papaparse";
import { AttendanceEntry, GFormEntry, EmployeeInfo } from "./attendanceTypes";
import { computeEarlyDeduct, computeLateDeduct } from "./computeDeductions";
import { info } from "console";

/**
 * Parses the raw CSV text from a Google Form export into an array of GFormEntry objects.
 *
 * @param text The CSV file contents as a string.
 * @returns    An array of `GFormEntry` objects parsed from the CSV.
 */
export function parseGForm(text: string): GFormEntry[] {
    // mapper for header name and count
    const headerCount: Record<string, number> = {};

    // parses CSV file
    const results = Papa.parse<Partial<GFormEntry>>(text, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header : string) => {
            // converts headers to lowercase and removes spaces
            const base = header.trim().toLowerCase().replace(/\s+/g, '');
            
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
            `Error parsing GForm CSV: ${results.errors
                .map((e: ParseError) => e.message)
                .join(", ")}`
        );
    }
    
    // maps results to a GFormEntry object
    return results.data.map((row: Partial<GFormEntry>): GFormEntry => ({
        timestamp: (row.timestamp ?? "").trim(),
        nameofemployee: (row.nameofemployee ?? "").trim(),
        action: (row.action ?? "").trim(),
        note: (row.note ?? "").trim(),
        date: (row.date ?? "").trim(),
        additionalnotes: (row.additionalnotes ?? "").trim(),
        date1: (row.date1 ?? "").trim(),
    }));
}

/**
 * Normalizes an array of `GFormEntry` records into the unified `AttendanceEntry` format.
 * Performs a database lookup to complete missing information and
 * transforms the data into an AttendanceEntry.
 *
 * @param data  The parsed Google Form entries to normalize.
 * @returns     A promise that resolves to an array of fully populated `AttendanceEntry` objects.
 */
export async function normalizeGForm(data : GFormEntry[]): Promise<AttendanceEntry[]> {
    // converts the raw name strings into parsed objects
    const parsedNames = data.map((row) => parseName(row.nameofemployee));

    // removes duplicates by turning the parsed objects into a unique string key
    const uniqueNameKeys = new Set<string>();
    const employeeNameQueries: { lastName: string; firstName: string; middleInitial: string }[] = [];

    parsedNames.forEach((n) => {
        const key = `${n.lastName.toLowerCase()}|${n.firstName.toLowerCase()}|${n.middleInitial.toLowerCase()}`;
        if (!uniqueNameKeys.has(key)) {
            uniqueNameKeys.add(key);
            employeeNameQueries.push(n);
        }
    });

    // fetches the employees' details
    const employeeInfoList = await fetchEmployeeInfo(employeeNameQueries);

    // maps the employee details using a key consistent with parseName
    const employeeInfoMap = new Map<string, EmployeeInfo>();
    employeeInfoList.forEach((info) => {
        const middleInitial = info.middleName 
        ? info.middleName.trim().charAt(0).toLowerCase() 
        : "";
        const key = `${info.lastName.toLowerCase()}|${info.firstName.toLowerCase()}|${(middleInitial).toLowerCase()}`;
        employeeInfoMap.set(key, info);
    });


    // ✅ now normalize each row
    return data.map((row) => {
        const parsedName = parseName(row.nameofemployee);
        const lookupKey = `${parsedName.lastName.toLowerCase()}|${parsedName.firstName.toLowerCase()}|${parsedName.middleInitial.toLowerCase()}`;
        const employeeInfo = employeeInfoMap.get(lookupKey);

        const datetime = new Date(row.timestamp);
        const middleInitial = employeeInfo?.middleName
            ? employeeInfo.middleName.trim().charAt(0).toUpperCase() + "."
            : "";
        const employeeName = `${employeeInfo?.lastName ?? ""}, ${employeeInfo?.firstName ?? ""}${middleInitial ? " " + middleInitial : ""}`;

        return {
            datetime: datetime,
            employeeID: employeeInfo?.employeeID ?? -999,
            employeeName: employeeName,
            lateDeduct: computeLateDeduct(datetime),
            earlyDeduct: computeEarlyDeduct(datetime, employeeInfo?.salary ?? -999),
            remarks: row.note
        };
    });

/*
    // gets the employee names
    const employeeNames = Array.from(new Set(data.map((row) => row.nameofemployee)));

    // fetches the employees' details
    const employeeInfoList = await fetchEmployeeInfo(employeeNameQueries);

    // maps the employee details to their name
    const employeeInfoMap = new Map<string, EmployeeInfo>();
    employeeInfoList.forEach((info) => {
        employeeInfoMap.set(info.employeeName, info);
    });

    return data.map((row) => {
       const employeeInfo = employeeInfoMap.get(row.nameofemployee);

       // completes the fields of AttendanceEntry
        const datetime = new Date(`${row.timestamp}`);
        const employeeID = employeeInfo?.employeeID ?? 0; // find alternative for default
        const employeeName = row.nameofemployee;
        const lateDeduct = computeLateDeduct(datetime);
        const earlyDeduct = computeEarlyDeduct(datetime, employeeInfo?.salary ?? -999)
        const remarks = row.note;

        // maps the results to an AttendanceEntry
        return {
            datetime,
            employeeID,
            employeeName,
            lateDeduct,
            earlyDeduct,
            remarks
        }
    });*/
}

/**
 * Parses a full name string (formatted as "LastName, FirstName MiddleInitial.")
 * into separate components: last name, first name, and middle initial.
 * 
 * @param fullName - The full name string to parse.
 * @returns An object containing:
 *  - `lastName`: The extracted last name.
 *  - `firstName`: The extracted first name.
 *  - `middleInitial`: The extracted middle initial (uppercase, without period). Empty string if none.
 */
function parseName(fullName: string): { lastName: string; firstName: string; middleInitial: string } {
    // Expected format: "Lastname, Firstname M."
    const [last, rest] = fullName.split(",").map(s => s.trim()); // split into ["Lastname", "Firstname M."]
    const parts = rest.split(" ").map(s => s.trim()).filter(Boolean); // ["Firstname", "M."]
    const first = parts[0] || "";
    const middleInitial = parts[1] ? parts[1].replace(".", "") : ""; // remove period if any

    return {
        lastName: last,
        firstName: first,
        middleInitial: middleInitial.toUpperCase(),
    };
}

/**
 * Fetches detailed employee information for the given list of employee names.
 *
 * @param employeeNames  An array of employee names to look up.
 * @returns              A promise that resolves to an array of `EmployeeInfo` objects
 *                       containing the matched employee data.
 */
async function fetchEmployeeInfo(employeeNames : {lastName: string, firstName: string, middleInitial: string}[]): Promise<EmployeeInfo[]>{
    // create post request
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