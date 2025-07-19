import { i, label } from "framer-motion/client";
import { ExperimentalPPRConfig } from "next/dist/server/lib/experimental/ppr";
import Papa, { ParseResult, ParseError } from "papaparse";
import { LiaTeamspeak } from "react-icons/lia";
import { GLogEntry, parseGLog, normalizeGLog } from './googleLog';
import { GFormEntry, parseGForm, normalizeGForm } from "./googleForm";


export interface AttendanceEntry {
    datetime: Date;
    employeeID: number;
    employeeName: string;
    lateDeduct: number,
    remarks: string;
}

export function parseCSV(file: File, existing: AttendanceEntry[], onMerged: (merged: AttendanceEntry[]) => void) {
    const reader = new FileReader();
    reader.onload = async (event) => {
        const text = event.target?.result as string;

        const headers = Papa.parse(text, { header: true }).meta.fields || [];
        const format = detectFormat(headers);

        let parsed: GLogEntry[] | GFormEntry[];
        let normalized: AttendanceEntry[];
        if (format === "GLog") {
            parsed = parseGLog(text);
            normalized = normalizeGLog(parsed);
        } else {
            parsed = parseGForm(text);
            console.log("GForm File parsed.");
            normalized = await normalizeGForm(parsed);
        }

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

function detectFormat(headers: string[]): "GLog" | "GForm" {
    console.log(headers);
    if (headers.includes("ID") && headers.includes("POSITION")) {
        return "GLog";
    } 
    else if (headers.includes("Timestamp") || headers.includes("ACTION")) {
        return "GForm";
    }
    else {
        throw new Error("Unknown CSV format");
    }
}

function mergeEntries(existing : AttendanceEntry[], incoming : AttendanceEntry[]) {
    const merged = [ ...existing, ...incoming ];

    return merged.sort((a, b) => {
        // return a.datetime - b.datetime; // sort by datetime
        return a.employeeID - b.employeeID;
    });
}

function isSafeToMerge(existing : AttendanceEntry[], incoming : AttendanceEntry[]) {
    if (incoming.length === 0) {
        return false;
    }
    
    const sampleRow = incoming[0];

    const exists = existing.some(e =>
        e.datetime === sampleRow.datetime &&
        e.employeeID === sampleRow.employeeID &&
        e.remarks === sampleRow.remarks
    );

    return !exists;
}
// change employee name formattting ?