import Papa from "papaparse";
import { AttendanceEntry, GFormEntry, GLogEntry, EmployeeUploadEntry } from "./attendanceTypes";
import { parseGLog, normalizeGLog } from './processGLog';
import { parseGForm, normalizeGForm, parseName } from "./processGForm";

/**
 * Parses the given CSV file and merges its normalized data into the existing table.
 * Calls `onMerged` with the merged entries when done.
 * 
 * @param file The CSV file to be parsed.
 * @param existing The current existing table entries.
 * @param onMerged A callback function that will be called after parsing and merging.
 */
export function parseCSV(file: File, existing: AttendanceEntry[], onMerged: (merged: AttendanceEntry[]) => void) {
    const reader = new FileReader();
    reader.onload = async (event) => {
        const text = event.target?.result as string;

        // isolate headers
        const headers = Papa.parse(text, { header: true }).meta.fields || [];
        // detect whether GLog or GForm
        const format = detectFormat(headers);

        // parse and normalize based on format
        let parsed: GLogEntry[] | GFormEntry[];
        let normalized: AttendanceEntry[];
        if (format === "GLog") {
            parsed = parseGLog(text);
            normalized = await normalizeGLog(parsed);
        } else {
            parsed = parseGForm(text);
            console.log("GForm File parsed.");
            normalized = await normalizeGForm(parsed);
        }

        // detect if can be merged
        if(isSafeToMerge(existing, normalized)) {
            console.log(existing, normalized);
            const merged = mergeEntries(existing, normalized);
            onMerged(merged);
            console.log("Safe to merge. Merged data sent.");
        }
        else {
            console.warn("Incoming batch already represented in existing data. Skipping merge.");
        }

    };
    reader.readAsText(file);
}

/**
 * Separates mismatches based on source logic.
 * GLog: unmatched entries have known ID, but unknown names.
 * GDoc: unmatched entries have names, but ID = 0.
 */
export function detectDBMismatches(entries: AttendanceEntry[]) {
    const glogMismatches = entries.filter(e =>
        e.employeeID && (e.firstName === "Unknown" || e.lastName === "Unknown")
  );

    const gdocMismatches = entries.filter(e =>
        e.employeeID === 0 && e.firstName && e.lastName
  );

  return { glogMismatches, gdocMismatches };
}

/**
 * Parses a payslip CSV file into a list of structured employee records.
 * @param file The uploaded CSV file
 * @returns Promise resolving to an array of employee entries
 */
export function parsePayslipCSV(file: File): Promise<EmployeeUploadEntry[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const text = reader.result as string;

      const { data, errors } = Papa.parse<Record<string, string>>(text, {
        header: true,
        skipEmptyLines: true,
      });

      if (errors.length > 0) {
        reject(errors);
        return;
      }

      const result: EmployeeUploadEntry[] = [];

      for (const row of data) {
        const fullName = row["Name"] ?? "";
        const { lastName, firstName, middleInitial } = parseName(fullName);

        result.push({
          employeeID: row["ID"]?.trim() ?? "",
          lastName,
          firstName,
          middleName: middleInitial,
          department: "",
          coordinator: "",
          position: row["Position"]?.trim() ?? "",
          contactInfo: row["BPI"]?.trim() ?? "",
          email: row["Email"]?.trim() ?? "",
          totalSalary: row["Monthly Total Pay"]?.trim() ?? "",
          basicSalary: row["Basic Pay"]?.trim() ?? "",
        });
      }

      resolve(result);
    };

    reader.onerror = reject;
    reader.readAsText(file);
  });
}

/**
 * Determines the format of the CSV file based on its headers.
 * 
 * @param headers  The array of header strings from the CSV.
 * @returns        `"GLog"` if the headers match the GLog format,
 *                 or `"GForm"` if they match the Google Form format.
 */
function detectFormat(headers: string[]): "GLog" | "GForm" {
    // selects a few specific headers from each format
    if (headers.includes("ACTION") && headers.includes("NAME OF EMPLOYEE")) {
        return "GForm";
    } 
    else if (headers.includes("No") || headers.includes("Mchn")) {
        return "GLog";
    }
    else {
        throw new Error("Unknown CSV format");
    }
}

/**
 * Merges two arrays of attendance entries into one.
 * Handles deduplication or other merge logic as needed.
 * 
 * @param existing The current list of attendance entries.
 * @param incoming The newly parsed attendance entries to merge in.
 * @returns        A new array containing the merged attendance entries.
 */
function mergeEntries(existing : AttendanceEntry[], incoming : AttendanceEntry[]) {
    // merge
    const merged = [ ...existing, ...incoming ];

    // sorts by employee ID in ascending format
    return merged.sort((a, b) => {
        return a.employeeID - b.employeeID;
    });
}

/**
 * Checks whether the incoming attendance entries can be safely merged
 * into the existing entries (e.g., no duplicates or conflicts).
 *
 * @param existing The current list of attendance entries.
 * @param incoming The new attendance entries to validate before merging.
 * @returns        `true` if it's safe to merge, otherwise `false`.
 */
function isSafeToMerge(existing : AttendanceEntry[], incoming : AttendanceEntry[]) {
    // checks if there are rows
    if (incoming.length === 0) {
        return false;
    }
    
    const isDuplicate = incoming.every(inc =>
        existing.some(e =>
            e.datetime === inc.datetime &&
            e.employeeID === inc.employeeID &&
            e.remarks === inc.remarks
        )
    );

    return !isDuplicate;
}