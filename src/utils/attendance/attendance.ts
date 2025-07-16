import { i, label } from "framer-motion/client";
import Papa, { ParseResult, ParseError } from "papaparse";
import { LiaTeamspeak } from "react-icons/lia";

export interface AttendanceEntry {
    datetime: Date;
    employeeID: string; // int?
    employeeName: string;
    // time: string; // datetime variable is enough, but separate them for display
    remarks: string;
}

interface GLogEntry {
    id: string;
    position: string;
    name: string;
    username: string;
    date: string;
    time: string;
    late: string;
    lateDeduct: string;
    irregular: string;
    undertime: string;
    undertimeDeduct: string;
    excused: string;
    note: string;
}

interface GFormEntry {
    timestamp: string;
    nameOfEmployee: string;
    action: string;
    note: string;
    date: string;
    date1: string;
}

export function parseCSV(file: File, existing: AttendanceEntry[], onMerged: (merged: AttendanceEntry[]) => void) {
    const reader = new FileReader();
    reader.onload = (event) => {
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
            normalized = normalizeGForm(parsed);
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
    if (headers.includes("ID") && headers.includes("Position")) {
        return "GLog";
    } 
    else if (headers.includes("Timestamp") || headers.includes("ACTION")) {
        return "GForm";
    }
    else {
        throw new Error("Unknown CSV format");
    }
}

function parseGLog(text: string): GLogEntry[] {
    const results = Papa.parse<Partial<GLogEntry>>(text, {
        header: true,
        skipEmptyLines: true,
    });

    if (results.errors.length > 0) {
        throw new Error(
            `Error parsing GLog CSV: ${results.errors
                .map((e: ParseError) => e.message)
                .join(", ")}`
            );
    }

    return results.data.map((row : Partial<GLogEntry>): GLogEntry => ({
        id: (row.id ?? "").trim(),
        position: (row.position ?? "").trim(),
        name: (row.name ?? "").trim(),
        username: (row.username ?? "").trim(),
        date: (row.date ?? "").trim(),
        time: (row.time ?? "").trim(),
        late: (row.late ?? "").trim(),
        lateDeduct: (row.lateDeduct ?? "").trim(),
        irregular: (row.irregular ?? "").trim(),
        undertime: (row.undertime ?? "").trim(),
        undertimeDeduct: (row.undertimeDeduct ?? "").trim(),
        excused: (row.excused ?? "").trim(),
        note: (row.note ?? "").trim(),
    }));
}

function parseGForm(text: string): GFormEntry[] {
    const headerCount: Record<string, number> = {};
    const results = Papa.parse<Partial<GFormEntry>>(text, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header : string) => {
            const base = header.trim().toLowerCase().replace(/\s+/g, "");
            if (headerCount[base] == null) {
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

    return results.data.map((row: Partial<GFormEntry>): GFormEntry => ({
        timestamp: (row.timestamp ?? "").trim(),
        nameOfEmployee: (row.nameOfEmployee ?? "").trim(),
        action: (row.action ?? "").trim(),
        note: (row.note ?? "").trim(),
        date: (row.date ?? "").trim(),
        date1: (row.date1 ?? "").trim(),
    }));
}

function normalizeGForm(data : GFormEntry[]): AttendanceEntry[] {

    return data.map((row) => {
        const datetime = new Date(`${row.timestamp}`);
        
        /* query database for employee data (id, salary, name?) if gform */

        // placeholder
        const employeeID = "1234567890";
        const employeeName = row.nameOfEmployee;
        const lateDeduct = 0; // computeLateDeduct(datetime, ); // get late threshold?
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

function normalizeGLog(data : GLogEntry[]): AttendanceEntry[] {

    return data.map((row) => {
        const datetime = new Date(`${row.date}T${row.time}`)
        const employeeID = row.id;
        const employeeName = row.name;
        const lateDeduct = row.lateDeduct;
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

function mergeEntries(existing : AttendanceEntry[], incoming : AttendanceEntry[]) {
    const merged = [ ...existing, ...incoming ];

    return merged.sort((a, b) => {
        const datetimeA = new Date(`$a.datetime`);
        const datetimeB = new Date(`$b.datetime`);

        return datetimeA.getTime() - datetimeB.getTime();
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



// parseCSV
// detectFormat
// parseGLog
// parseGForm
// normalizeGLog
// normalizeGForm
// mergeEntries

// change employee name formattting

// checkExistingEntries, like if already uploaded
// parseTime ?
// computeLate ?
// computeLateDeduct ?
// how to store first file and commence merging
// separate files or nah