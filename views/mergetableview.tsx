import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Flex,
} from "@chakra-ui/react";
import React, { useRef, useState} from "react";

interface MergedAttendanceEntry {
  employeeID: number;
  lastName: string;
  firstName: string;
  datetime: string;
  type: "Check In" | "Check Out" | "Incomplete";
  source: "GLog" | "GDoc";
  note?: string;
}


const MergeTableView = () => {
    const [gdocData, setGdocData] = useState<any[]>([]);
    const [glogData, setGlogData] = useState<any[]>([]);
    const processedGLogRef = useRef<MergedAttendanceEntry[]>([]);

    const handleCancel = () => {
    setGdocData([]);
    setGlogData([]);
    };

    const processGLogData = async (rows: any[]): Promise<MergedAttendanceEntry[]> => {
        const grouped: { [key: string]: any[] } = {};

        rows.forEach((entry) => {
            const employeeID = parseInt(entry["ENNO"]);
            const name = entry["NAME"]?.trim() || "";
            const datetime = new Date(entry["DATETIME"]);

            if (!employeeID || !name || isNaN(datetime.getTime())) return;

            const dateKey = `${employeeID}_${datetime.toDateString()}`;
            if (!grouped[dateKey]) grouped[dateKey] = [];
            grouped[dateKey].push({ employeeID, name, datetime });
        });

        const result: MergedAttendanceEntry[] = [];

        const uniqueIDs = [...new Set(rows.map(r => parseInt(r["ENNO"])))]
            .filter(id => !isNaN(id));


            const employees = await fetch("/api/employees/by-ids", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids: uniqueIDs }),
            })
            .then(res => res.json())
            .catch(err => {
                return [];
            });

            if (!Array.isArray(employees)) {
            console.error("Invalid response from /api/employees/by-ids:", employees);
            }




        const employeeMap = new Map<number, any>();

        if (Array.isArray(employees)) {
        employees.forEach((emp: any) => {
            employeeMap.set(emp.employeeID, emp);
        });
        } else {
        console.error("Invalid response from /api/employees/by-ids", employees);
        }

        for (const entries of Object.values(grouped)) {
            entries.sort((a, b) => a.datetime.getTime() - b.datetime.getTime());

            const employeeID = entries[0].employeeID;
            const fallbackName = entries[0].name.trim();
            const found = employeeMap.get(employeeID);

            const firstName = found ? found.firstName : "N/A";
            const lastName = found ? found.lastName : fallbackName;


            const pushEntry = (datetime: string, type: "Check In" | "Check Out" | "Incomplete") => {
            result.push({
                employeeID,
                firstName,
                lastName,
                datetime,
                type,
                source: "GLog",
                note: "",
            });
            };

            if (entries.length === 1) {
            pushEntry(entries[0].datetime.toISOString(), "Incomplete");
            } else {
            pushEntry(entries[0].datetime.toISOString(), "Check In");
            pushEntry(entries[1].datetime.toISOString(), "Check Out");
            }
        }

    return result;
    };

    const processGDocData = async (rows: any[]): Promise<MergedAttendanceEntry[]> => {
        const result: MergedAttendanceEntry[] = [];

        const employees = await fetch("/api/employees/all", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        }).then((res) => res.json()).catch(() => []);

        const employeeMapByFullName = new Map<string, any>();
        employees.forEach((emp: any) => {
            const fullName = `${emp.lastName}, ${emp.firstName} ${emp.middleName || ""}`
                .replace(/\s+/g, " ")
                .replace(/["']/g, "")
                .replace(/\.+$/, "")
                .toLowerCase()
                .trim();
            employeeMapByFullName.set(fullName.toLowerCase(), emp);
        });

        for (const row of rows) {
            const fullNameRaw = row["NAME OF EMPLOYEE"]?.trim() || "";
            const fullName = fullNameRaw
            .replace(/\s+/g, " ")
            .replace(/["']/g, "")
            .replace(/\.+$/, "")
            .toLowerCase()
            .trim();
            const timestamp = new Date(row["TIMESTAMP"]);
            const action = row["ACTION"]?.toLowerCase();
            const note = row["NOTE"] || "";

            if (!timestamp || isNaN(timestamp.getTime()) || !employeeMapByFullName.has(fullName)) {
            console.warn("Skipping unmatched or invalid row:", row);
            continue;
            }

            const emp = employeeMapByFullName.get(fullName);
            const type = action === "clock in" ? "Check In" : action === "clock out" ? "Check Out" : "Incomplete";

            result.push({
            employeeID: emp.employeeID,
            firstName: emp.firstName,
            lastName: emp.lastName,
            datetime: timestamp.toISOString(),
            type,
            source: "GDoc",
            note,
            });
        }

        return result;
        };

    const handleUpload = async () => {
        if (processedGLogRef.current.length === 0) {
            alert("No entries to upload.");
            return;
        }

        try {
            const isGDoc = processedGLogRef.current[0]?.source === "GDoc";
            const uploadUrl = isGDoc
            ? "/api/attendance/uploadGdoc"
            : "/api/attendance/uploadGlog";

            const response = await fetch(uploadUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(processedGLogRef.current),
            });

            if (!response.ok) {
            throw new Error("Failed to save entries");
            }

            alert(`${isGDoc ? "GDoc" : "GLog"} entries uploaded successfully!`);
            handleCancel();
        } catch (error) {
            console.error("Error uploading entries:", error);
            alert("Failed to upload entries. Please try again.");
        }
    };

    const FileUploadButton = ({
        label,
        onFileParsed,
        }: {
        label: string;
        onFileParsed: (rows: any[]) => void;
        }) => {
        const fileInputRef = useRef<HTMLInputElement>(null);

        const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;

            const text = await file.text();
            const rows = parseCSVManually(text);
            onFileParsed(rows);
        };

        const parseCSVManually = (text: string) => {
            const [headerLine, ...lines] = text.split("\n").filter(Boolean);
            const headers = headerLine.split(",").map((h) => h.trim().toUpperCase());

            return lines.map((line) => {
                const values = line.split(",").map(val => val.trim());
                if (values.length < headers.length) return null; // skip broken lines

                const entry: any = {};
                headers.forEach((header, i) => {
                entry[header] = values[i];
                });
                return entry;
            }).filter(Boolean);
        };


        return (
            <div className="FileUploadContainer">
            <span>{label}</span>
            <input type="file" accept=".csv" onChange={handleFileChange} ref={fileInputRef} />
            </div>
        );
        };

 return (
    <div className="BiggestFormWrapper" >
        <div className="HeaderPageWrapper">
            <div className="PageBiggestText"> 
                Merge Attendance Data
            </div>

            <div className="DescriptionofPage"> 
                Upload raw attendance files and merge them to generate entries in the attendance table
            </div>
      </div>

        <div className="ImportAreaWrapper">
        
            <div className="GlogWrapper">
               <FileUploadButton
                    label="Upload GLog"
                    onFileParsed={(rows) => {
                        processGLogData(rows).then((processed) => {
                        processedGLogRef.current = processed;
                        setGlogData(rows);
                        console.log("📄 Parsed GLog CSV rows:", rows);
                        console.log("🧠 Processed entries with employee info:", processed);
                        });
                    }}
                />
            </div>

            <FileUploadButton
                label="Upload GDoc"
                onFileParsed={(rows) => {
                    processGDocData(rows).then((processed) => {
                    processedGLogRef.current = processed;
                    setGdocData(rows);
                    console.log("📄 Parsed GDoc rows:", rows);
                    console.log("🧠 Processed GDoc entries:", processed);
                    });
                }}
            />

      </div>
    

        <div className="SummaryAndPreviewWrapper">
            <div className="FilePreviewWrapper">
                <div className="PreviewHeader">
                    <div className="FileName text">
                        
                        
                        
                        
                    </div>
                    <div className="TitleOfFile text">
                        Data Preview
                    </div>

                </div>
                <div className="ActualTableWrapper">
                    {processedGLogRef.current.length > 0 && (
                    <Box mt={4}>
                        <Table size="sm">
                        <Thead bg="#A4B465">
                        <Tr>
                            <Th>Employee ID</Th>
                            <Th>Last Name</Th>
                            <Th>First Name</Th>
                            <Th>Type</Th>
                            <Th>DateTime</Th>
                        </Tr>
                        </Thead>
                        <Tbody>
                            {processedGLogRef.current.map((entry, idx) => (
                            <Tr key={idx} bg={idx % 2 === 0 ? "rgba(251, 252, 229, 0.93)" : "rgba(230, 226, 177, 0.93)"}>
                                <Td>{entry.employeeID}</Td>
                                <Td>{entry.lastName}</Td>
                                <Td>{entry.firstName}</Td>
                                <Td>{entry.type}</Td>
                                <Td>{entry.datetime}</Td>
                            </Tr>
                            ))}
                        </Tbody>
                        </Table>
                    </Box>
                    )}
                    <Flex justify="flex-end" mt={4}>
                        <Button
                            colorScheme="green"
                            onClick={handleUpload}
                            isDisabled={processedGLogRef.current.length === 0}
                        >
                            Upload to Database
                        </Button>
                    </Flex>
                </div>
            </div>


        </div>
    </div>
  );





};

export default MergeTableView;