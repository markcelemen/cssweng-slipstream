import Papa from "papaparse";

export interface GlogEntry {
  id: string;
  position: string;
  name: string;
  username: string;
  date: Date;
  time: string;
  late: string;
  lateDeduct: string;
  irregular: string;
  undertime: string;
  undertimeDeduct: string;
  excused: string;
  note: string;
}

export function parseCSV(file: File, onParsed: (data: GlogEntry[]) => void) {
  const headers = [
    "id",
    "position",
    "name",
    "username",
    "date",
    "time",
    "late",
    "lateDeduct",
    "irregular",
    "undertime",
    "undertimeDeduct",
    "excused",
    "note",
  ];

  Papa.parse(file, {
    header: false,
    skipEmptyLines: true,
    complete: (results) => {
      const raw = results.data as string[][];
      const rows = raw.slice(1).map((row) => {
        const entry: Partial<GlogEntry> = {};
        headers.forEach((key, i) => {
          if (key === "date") {
            const dateStr = row[i] + " " + row[i + 1];
            const parsed = dateStr ? new Date(dateStr) : null;
            entry[key as keyof GlogEntry] = parsed as any;
          } else {
            (entry as any)[key] = row[i] ?? "";
          }
        });
        return entry as GlogEntry;
      });

      onParsed(rows);
    },
  });
}