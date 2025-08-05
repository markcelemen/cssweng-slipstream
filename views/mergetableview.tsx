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
  middleName?: string;
  datetime: string;
  type: "Check In" | "Check Out" | "Incomplete";
  source: "GLog" | "GDoc";
  note?: string;
}

const MergeTableView = () => {
    const [gdocData, setGdocData] = useState<any[]>([]);
    const [glogData, setGlogData] = useState<any[]>([]);
    const [payrollRows, setPayrollRows] = useState<any[]>([]);
    const [existingPayrollIDs, setExistingPayrollIDs] = useState<number[]>([]);
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

        const usedIDs = new Set(employees.map((e: any) => e.employeeID));
        let tempCounter = 1;

        const getNextEmployeeID = () => {
        while (usedIDs.has(tempCounter)) tempCounter++;
        const newId = tempCounter;
        usedIDs.add(newId);
        return parseInt(newId.toString().padStart(9, "0"));
        };

        const employeeMapByFullName = new Map<string, any>();
        employees.forEach((emp: any) => {
            const fullName = `${emp.lastName}, ${emp.firstName} ${emp.middleName || ""}`
            .replace(/\s+/g, " ")
            .replace(/["']/g, "")
            .replace(/\.+$/, "")
            .toLowerCase()
            .trim();
            employeeMapByFullName.set(fullName, emp);
        });

        // Step 1: Group entries by name + date
        const grouped: { [key: string]: any[] } = {};

        for (const row of rows) {
            const fullNameRaw = row["NAME OF EMPLOYEE"]?.trim() || "";
            const fullNameKey = fullNameRaw
            .replace(/\s+/g, " ")
            .replace(/["']/g, "")
            .replace(/\.+$/, "")
            .toLowerCase()
            .trim();

            const timestamp = new Date(row["TIMESTAMP"]);
            const action = row["ACTION"]?.toLowerCase();
            const note = row["NOTE"] || "";

            if (!timestamp || isNaN(timestamp.getTime())) {
            console.warn("Skipping row with invalid timestamp:", row);
            continue;
            }

            const dateKey = `${fullNameKey}_${timestamp.toDateString()}`;

            if (!grouped[dateKey]) grouped[dateKey] = [];

            grouped[dateKey].push({
            fullNameRaw,
            fullNameKey,
            timestamp,
            action,
            note,
            });
        }

        for (const entries of Object.values(grouped)) {
            entries.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

            const rawName = entries[0].fullNameRaw;
            const [last, rest] = rawName.split(",").map((s: string) => s.trim());
            const restParts = (rest || "").split(" ");
            const firstName = restParts[0] || "N/A";
            const middleName = restParts.slice(1).join(" ") || "";
            const lastName = last || "N/A";

            const matchedEmp = employeeMapByFullName.get(entries[0].fullNameKey);
            const employeeID = matchedEmp?.employeeID ?? getNextEmployeeID();

            const pushEntry = (timestamp: Date, type: "Check In" | "Check Out" | "Incomplete", note: string) => {
            result.push({
                employeeID,
                firstName,
                lastName,
                middleName,
                datetime: timestamp.toISOString(),
                type,
                source: "GDoc",
                note,
            });
            };

            if (entries.length === 1) {
            pushEntry(entries[0].timestamp, "Incomplete", entries[0].note);
            } else {
            pushEntry(entries[0].timestamp, "Check In", entries[0].note);
            pushEntry(entries[1].timestamp, "Check Out", entries[1].note);
            }
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

    const handlePayrollUpload = async (rows: any[]) => {
    processedGLogRef.current = [];
    setPayrollRows(rows);

    const ids = rows.map((r) => parseInt(r["ID"])).filter((id) => !isNaN(id));

    try {
        const res = await fetch("/api/employees/by-ids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
        });

        const existing = await res.json();
        if (Array.isArray(existing)) {
        const existingIDs = existing.map((e: any) => e.employeeID);
        setExistingPayrollIDs(existingIDs);
        console.log("Duplicate employee IDs found in payroll:", existingIDs);
        }
    } catch (err) {
        console.error("Failed to fetch existing employees:", err);
    }
    };

    const handleUploadPayroll = async () => {
        for (const row of payrollRows) {
            const id = parseInt(row["ID"]);
            const nameParts = (row["NAME"] || "").split(", ");
            const lastName = nameParts[0]?.trim() || "";
            const rest = nameParts[1] || "";
            const nameWords = rest.trim().split(" ");
            const middleName = nameWords.pop() || "";
            const firstName = nameWords.join(" ");

            const newEmployee = {
                employeeID: id,
                lastName,
                firstName,
                middleName,
                position: row["POSITION"] || "",
                totalSalary: parseFloat(row["MONTHLY TOTAL PAY"].replace(/[₱,]/g, "")),
                basicSalary: parseFloat(row["BASIC PAY"].replace(/[₱,]/g, "")),
                department: "N/A",
                coordinator: false,
                contactInfo: "09123456789",
                email: "employee@gmail.com",
                remarks: "",
            };


            try {
            const res = await fetch("/api/employees/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newEmployee),
            });

            if (!res.ok) {
                console.error("Failed to add:", newEmployee);
            }
            } catch (err) {
            console.error("Upload error:", err);
            }
        }

        alert("Payroll upload complete.");
        setPayrollRows([]);
    };

    const parsePayrollCSV = (text: string) => {
        const normalizedText = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
        const lines = normalizedText.split("\n").filter(Boolean);
        const headers = lines[0].split(",").map((h) => h.trim().toUpperCase());

        return lines.slice(1).map((line) => {
            const values = line.match(/(".*?"|[^",\n\r]+)(?=\s*,|\s*$)/g)?.map((val) =>
            val.replace(/^"|"$/g, "").trim()
            ) || [];

            const entry: any = {};
            headers.forEach((header, i) => {
            entry[header] = values[i];
            });
            return entry;
        });
        };

    const FileUploadButton = ({
        label,
        onFileParsed,
        source,
        }: {
        label: string;
        onFileParsed: (rows: any[]) => void;
        source?: "GLog" | "GDoc";
        }) => {
        const fileInputRef = useRef<HTMLInputElement>(null);

        const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;

            const text = await file.text();
            let rows;
            if (label.includes("GDoc")) {
            rows = parseGDocCSV(text);
            } else if (label.includes("Payroll")) {
            rows = parsePayrollCSV(text);
            } else {
            rows = parseCSVManually(text);
            }
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

        const parseGDocCSV = (text: string) => {
            const normalizedText = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
            const delimiter = normalizedText.includes("\t") ? "\t" : ",";

            const [headerLine, ...lines] = normalizedText.split("\n").filter(Boolean);
            const headers = headerLine.split(delimiter).map((h) => h.trim().toUpperCase());

            const getIndex = (label: string) =>
                headers.findIndex((h) => h === label.toUpperCase());

            const timestampIndex = getIndex("TIMESTAMP");
            const nameIndex = getIndex("NAME OF EMPLOYEE");
            const actionIndex = getIndex("ACTION");
            const noteIndex = getIndex("NOTE");

            return lines.map((line) => {
                const values = line.match(/(".*?"|[^",\t\n\r]+)(?=\s*,|\s*$)/g)?.map((val) =>
                val.replace(/^"|"$/g, "").trim()
                ) || [];

                if (
                [timestampIndex, nameIndex, actionIndex, noteIndex].some((i) => i === -1) ||
                values.length < Math.max(timestampIndex, nameIndex, actionIndex, noteIndex)
                ) {
                return null;
                }

                return {
                TIMESTAMP: values[timestampIndex],
                "NAME OF EMPLOYEE": values[nameIndex],
                ACTION: values[actionIndex],
                NOTE: values[noteIndex],
                };
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
                    source="GLog"
                    onFileParsed={(rows) => {
                        setPayrollRows([]);
                        processGLogData(rows).then((processed) => {
                        processedGLogRef.current = processed;
                        setGlogData(rows);
                        });
                    }}
                />
            </div>

            <FileUploadButton
                label="Upload GDoc"
                source="GDoc"
                onFileParsed={(rows) => {
                    setPayrollRows([]);
                    processGDocData(rows).then((processed) => {
                    processedGLogRef.current = processed;
                    setGdocData(rows);
                    });
                }}
            />

            <FileUploadButton
                label="Upload Payroll File"
                onFileParsed={(rows) => {
                    handlePayrollUpload(rows);
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
                    {payrollRows.length > 0 ? (
                    <Box mt={4}>
                        <div style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "8px" }}>
                        Payroll File Preview
                        </div>
                        <Table size="sm">
                        <Thead bg="#A4B465">
                            <Tr>
                            <Th>Employee ID</Th>
                            <Th>Last Name</Th>
                            <Th>First Name</Th>
                            <Th>Middle Name</Th>
                            <Th>Position</Th>
                            <Th>Monthly Pay</Th>
                            <Th>Basic Pay</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {payrollRows.map((row, idx) => {
                                const id = parseInt(row["ID"]);
                                const nameParts = (row["NAME"] || "").split(", ");
                                const lastName = nameParts[0]?.trim() || "";
                                const rest = nameParts[1] || "";
                                const nameWords = rest.trim().split(" ");
                                const middleName = nameWords.pop() || "";
                                const firstName = nameWords.join(" ");
                                return (
                                    <Tr
                                    key={idx}
                                    bg={idx % 2 === 0 ? "rgba(251, 252, 229, 0.93)" : "rgba(230, 226, 177, 0.93)"}
                                    >
                                    <Td style={{ color: existingPayrollIDs.includes(id) ? "red" : "inherit" }}>
                                    {id}
                                    {existingPayrollIDs.includes(id) && " ⚠️"}
                                    </Td>
                                    <Td>{lastName}</Td>
                                    <Td>{firstName}</Td>
                                    <Td>{middleName}</Td>
                                    <Td>{row["POSITION"]}</Td>
                                    <Td>{row["MONTHLY TOTAL PAY"]}</Td>
                                    <Td>{row["BASIC PAY"]}</Td>
                                    </Tr>
                                );
                            })}
                        </Tbody>
                        </Table>
                    </Box>
                    ) : processedGLogRef.current.length > 0 && (
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
                            <Tr
                                key={idx}
                                bg={idx % 2 === 0 ? "rgba(251, 252, 229, 0.93)" : "rgba(230, 226, 177, 0.93)"}
                            >
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
                        {payrollRows.length > 0 ? (
                        <Button
                        colorScheme="green"
                        onClick={handleUploadPayroll}
                        isDisabled={payrollRows.length === 0 || existingPayrollIDs.length > 0}
                        >
                        Upload Payroll to Database
                        </Button>
                        ) : (
                        <Button
                            colorScheme="green"
                            onClick={handleUpload}
                            isDisabled={processedGLogRef.current.length === 0}
                        >
                            Upload to Database
                        </Button>
                        )}
                    </Flex>
                </div>
            </div>


        </div>
    </div>
  );





};

export default MergeTableView;