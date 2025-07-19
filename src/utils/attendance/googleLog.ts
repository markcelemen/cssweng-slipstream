

import Papa, { ParseResult, ParseError } from "papaparse";
import { AttendanceEntry } from "./attendance";

// turn lowercase
export interface GLogEntry {
    id: string;
    position: string;
    name: string;
    username: string;
    date: string;
    time: string;
    late: string;
    latededuct: string;
    irregular: string;
    undertime: string;
    undertimededuct: string;
    excused: string;
    note: string;
}

export function parseGLog(text: string): GLogEntry[] {
    const headerCount: Record<string, number> = {};
    const results = Papa.parse<Partial<GLogEntry>>(text, {
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
            `Error parsing GLog CSV: ${results.errors
                .map((e: ParseError) => e.message)
                .join(", ")}`
            );
    }
    console.log(results.data);
    return results.data.map((row : Partial<GLogEntry>): GLogEntry => ({
        id: (row.id ?? "").trim(),
        position: (row.position ?? "").trim(),
        name: (row.name ?? "").trim(),
        username: (row.username ?? "").trim(),
        date: (row.date ?? "").trim(),
        time: (row.time ?? "").trim(),
        late: (row.late ?? "").trim(),
        latededuct: (row.latededuct ?? "").trim(),
        irregular: (row.irregular ?? "").trim(),
        undertime: (row.undertime ?? "").trim(),
        undertimededuct: (row.undertimededuct ?? "").trim(),
        excused: (row.excused ?? "").trim(),
        note: (row.note ?? "").trim(),
    }));
}

export function normalizeGLog(data : GLogEntry[]): AttendanceEntry[] {
    console.log(data);
    return data.map((row) => {
        const datetime = new Date(`${row.time}`); //(`${row.date}T${row.time.getTime()}`)
        const employeeID = Number(row.id);
        const employeeName = row.name;
        const lateDeduct = Number(row.latededuct);
        const remarks = row.note;
        console.log(datetime);
        console.log(`${row.date}T${row.time}`)
        return {
            datetime,
            employeeID,
            employeeName,
            lateDeduct,
            remarks
        }
    });
}