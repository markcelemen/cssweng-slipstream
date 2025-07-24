import Papa from "papaparse";
import { AttendanceEntry, GFormEntry, GLogEntry } from "./attendanceTypes";
import { parseGLog, normalizeGLog } from './processGLog';
import { parseGForm, normalizeGForm } from "./processGForm";

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
    
    // select one row from incoming
    const sampleRow = incoming[0];

    // find that exact row in the existing entries
    const exists = existing.some(e =>
        e.datetime === sampleRow.datetime &&
        e.employeeID === sampleRow.employeeID &&
        e.remarks === sampleRow.remarks
    );

    return !exists;
}