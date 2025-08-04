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
  IconButton,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import React, { useRef, useState, useEffect} from "react";
import { AttendanceEntry } from "../src/utils/attendance/attendanceTypes";
import { parseCSV, detectDBMismatches, parsePayslipCSV } from "../src/utils/attendance/processAttendance"; 
import { set } from "mongoose";

interface MergedAttendanceEntry {
  lastName: string;
  firstName: string;
  middleInitial?: string;
  action: string;
  note: string;
  datetime: string;
}

const MergeTableView = () => {
    const [gdocData, setGdocData] = useState<any[]>([]);
    const [glogData, setGlogData] = useState<any[]>([]);
    const [crossMatchedEntries, setCrossMatchedEntries] = useState<MergedAttendanceEntry[]>([]);
    const unmatchedGdocCount = gdocData.length - crossMatchedEntries.length;
    const unmatchedGlogCount = glogData.length - crossMatchedEntries.length;



   const crossReferenceFiles = (gdoc: any[], glog: any[]) => {
    console.log("📥 GDoc parsed data:", gdoc);
    console.log("📥 GLog parsed data:", glog);

    const result: MergedAttendanceEntry[] = [];

    const glogMap = new Map<string, any[]>();
    glog.forEach((entry) => {
        const rawName = entry["NAME"];
        const name = rawName?.replace(/^"+|"+$/g, "").toUpperCase().trim(); // removes surrounding quotes
        if (!name) return;
        if (!glogMap.has(name)) glogMap.set(name, []);
        glogMap.get(name)!.push(entry);
    });

    console.log("🧠 GLog Name Keys:", [...glogMap.keys()]);

    gdoc.forEach((entry, i) => {
        const fullNameRaw = entry["NAME OF EMPLOYEE"]?.trim() || entry["Name of Employee"]?.trim();
        const fullName = fullNameRaw?.replace(/^"+|"+$/g, "");
        if (!fullName) {
        console.log(`⚠️ GDoc row ${i} is missing a name. Skipping.`);
        return;
        }

        const lastName = fullName.split(",")[0]?.toUpperCase();
        const nameParts = fullName.split(",")[1]?.trim().replace(/^"+|"+$/g, "").split(" ") || [];
        const firstName = nameParts.slice(0, -1).join(" ").replace(/^"+|"+$/g, "");
        const middleInitial = nameParts.slice(-1)[0]?.replace(/[".]/g, "") || "";

        const lastNameNormalized = lastName?.replace(/\s+/g, "").toUpperCase();

        console.log(`🔍 Looking for matches for lastName="${lastNameNormalized}" extracted from "${fullName}"`);

        const matches = [...glogMap.entries()].filter(([name]) => {
        const normalizedName = name.replace(/\s+/g, "").toUpperCase();
        console.log(`   ↪️ Comparing to GLog name="${normalizedName}"`);
        return normalizedName === lastNameNormalized;
        });

        if (matches.length === 0) {
        console.log(`❌ No match found for "${lastNameNormalized}"`);
        } else {
        matches.forEach(([key, glogEntries]) => {
            console.log(`✅ Match found: "${lastNameNormalized}" matched with GLog key "${key}" → entries:`, glogEntries);
            glogEntries.forEach((glogEntry) => {
            const entryToPush = {
                lastName: lastName || "",
                firstName: firstName,
                middleInitial: middleInitial,
                action: entry["ACTION"] || "",
                note: entry["NOTE"] || "",
                datetime: glogEntry["DATETIME"] || entry["TIMESTAMP"] || "",
            };

            console.log("✅ Entry pushed:", entryToPush);
            result.push(entryToPush);
            });
        });
        }
    });

    console.log("✅ Total matched entries:", result.length);
    setCrossMatchedEntries(result);
    };

    const handleCancel = () => {
    setCrossMatchedEntries([]);
    setGdocData([]);
    setGlogData([]);
    };

    const handleMerge = async () => {
        if (crossMatchedEntries.length === 0) {
        alert("No entries to merge.");
        return;
        }
        try {
            const response = await fetch("/api/attendance/uploadMerged", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(crossMatchedEntries),
            });

            if (!response.ok) {
                throw new Error("Failed to save entries");
            }

            alert("Entries merged successfully!");
            handleCancel();
        } catch (error) {
            console.error("Error merging entries:", error);
            alert("Failed to merge entries. Please try again.");
        }
    }

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
                const values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g)?.map(val =>
                val.replace(/^"+|"+$/g, "").trim()
                ) || [];

                const entry: any = {};
                headers.forEach((header, i) => {
                entry[header] = values[i];
                });
                return entry;
            });
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
                        setGlogData(rows);
                        if (gdocData.length > 0) crossReferenceFiles(gdocData, rows);
                    }}
                    />
            </div>

            <div className="GdocWrapper">
                <FileUploadButton
                    label="Upload GDoc"
                    onFileParsed={(rows) => {
                        setGdocData(rows);
                        if (glogData.length > 0) crossReferenceFiles(rows, glogData);
                    }}
                    />
            </div>

      </div>
    

        <div className="SummaryAndPreviewWrapper">
            <div className="MatchingSummaryWrapper">
                <div className="MatchingHeader text"> 
                
                Matching Summary

                </div>
                <div className="insideSummaryBox smalltext">
                    <div>
                        <span>{unmatchedGlogCount === 0 ? "✓" : "⚠️"}</span>{" "}
                        {unmatchedGlogCount === 0
                        ? "All GLog entries matched."
                        : `${unmatchedGlogCount} unmatched entries from GLog`}
                    </div>
                    <div>
                        <span>{unmatchedGdocCount === 0 ? "✓" : "⚠️"}</span>{" "}
                        {unmatchedGdocCount === 0
                        ? "All GDoc entries matched."
                        : `${unmatchedGdocCount} unmatched entries from GDoc`}
                    </div>
                </div>
                <div className="PrevAndNextButtonWrapper ReverseRowWrapper">
                    <button onClick={handleMerge}>Merge Files</button>
                    <button onClick={handleCancel}>Cancel</button>
                </div>
            </div>
            <div className="FilePreviewWrapper">
                <div className="PreviewHeader">
                    <div className="FileName text">
                        
                        
                        
                        
                    </div>
                    <div className="TitleOfFile text">
                        Merged Data Preview
                    </div>

                </div>
                <div className="ActualTableWrapper">
                    {crossMatchedEntries.length > 0 && (
                    <Box mt={4}>
                        <Table size="sm">
                        <Thead bg="#A4B465">
                        <Tr>
                            <Th>Last Name</Th>
                            <Th>First Name</Th>
                            <Th>Middle Initial</Th>
                            <Th>Action</Th>
                            <Th>Note</Th>
                            <Th>DateTime</Th>
                        </Tr>
                        </Thead>
                        <Tbody>
                            {crossMatchedEntries.map((entry, idx) => (
                                <Tr key={idx} bg={idx % 2 === 0 ? "rgba(251, 252, 229, 0.93)" : "rgba(230, 226, 177, 0.93)"}>
                                    <Td>{entry.lastName}</Td>
                                    <Td>{entry.firstName}</Td>
                                    <Td>{entry.middleInitial}</Td>
                                    <Td>{entry.action}</Td>
                                    <Td>{entry.note}</Td>
                                    <Td>{entry.datetime}</Td>
                                </Tr>
                                ))}
                        </Tbody>
                        </Table>
                    </Box>
                    )}
                </div>
                <div className="PagnationWrapper"> 
                    {
                        //PAGINATION NOT WORKING BEACUSE IM NOT SURE HOW THE OBJECTS WILL LOOK SORRY DEVS
                    }
                    <Flex
                        position="relative"
                       
                        align="center"
                        justify="center"
                        gap={2}
                        zIndex={10}
                        bg="#FFFCD9"
                        p={2}
                        borderRadius="md"
                        boxShadow="0px 0px 16px  rgba(0, 0, 0, 0.1)"
                        >
                        <IconButton
                            icon={<ChevronLeftIcon />}
                            aria-label="Previous page"
                            size="sm"
                            color="#638813"
                            
                            _hover={{ bg: "#E6E2B1",color: "#FFCF50" }}
                            isDisabled={false} 
                        />
                        <Button 
                            size="sm" 
                            color="#626F47" 
                            variant="ghost"
                            _hover={{ color: "#FFCF50" }}
                        >
                            1
                        </Button>
                        <Input
                            value="1" //Static value
                            size="sm"
                            width="44px"
                            color="#638813"
                            textAlign="center"
                            
                            mx={1}
                            readOnly 
                        />
                        <Button 
                            size="sm" 
                            color="#638813"
                            
                            _hover={{ color: "#FFCF50" }}
                        >
                            5 {/* Example total pages */}
                        </Button>
                        <IconButton
                            icon={<ChevronRightIcon />}
                            aria-label="Next page"
                            color="#638813"
                            size="sm"
                            bg="red"
                            _hover={{color: "#FFCF50"}}
                            isDisabled={false} 
                        />
                        </Flex>
                </div>
            </div>


        </div>
    </div>
  );





};

export default MergeTableView;