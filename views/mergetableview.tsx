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
import e from "express";


const MergeTableView = () => {
    const [mergedEntries, setMergedEntries] = useState<AttendanceEntry[]>([]);
    const [unmatchedGlog, setUnmatchedGlog] = useState<AttendanceEntry[]>([]);
    const [unmatchedGdoc, setUnmatchedGdoc] = useState<AttendanceEntry[]>([]);
    const [resetKey, setResetKey] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 20;

    const existingData = mergedEntries;

    const totalPages = Math.ceil(mergedEntries.length / rowsPerPage);
    const paginatedEntries = mergedEntries.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const handleCancel = () => {
        setMergedEntries([]);
        setUnmatchedGlog([]);
        setUnmatchedGdoc([]);
        setCurrentPage(1);
        setResetKey(prev => prev + 1);
    }

    const handleMerge = async () => {
        if (mergedEntries.length === 0) {
            alert("No entries to merge.");
            return;
        }
        try {
            const response = await fetch("/api/attendance/uploadMerged", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(mergedEntries),
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
        expectedColumns, 
        existingData, 
        onParsed,
        resetKey }: { 
            label: string; 
            expectedColumns: string; 
            existingData: AttendanceEntry[]; 
            onParsed: (merged: AttendanceEntry[]) => void 
            resetKey: number;
        }) => {
        const [fileName, setFileName] = useState<string | null>(null);
        const fileInputRef = useRef<HTMLInputElement>(null);
        const infoBoxRef = useRef<HTMLDivElement>(null);
        const [isDragging, setIsDragging] = useState(false);
        const [startX, setStartX] = useState(0);
        const [scrollLeft, setScrollLeft] = useState(0);

        useEffect(() => {
            setFileName(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }, [resetKey]);
    
        const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if(file) {
                setFileName(file.name);
                parseCSV(file, existingData, (merged) => {
                    setMergedEntries(merged); 
                    const { glogMismatches, gdocMismatches } = detectDBMismatches(merged);
                    setUnmatchedGdoc(gdocMismatches);
                    setUnmatchedGlog(glogMismatches);
                });
            }
        };

        const handleRemoveFile = () => {
            setFileName(null);
            if (fileInputRef.current) {
            fileInputRef.current.value = '';
            }
        };

        //manual scroll handlers
        const startDrag = (e: React.MouseEvent) => {
            if (!infoBoxRef.current) return;
            setIsDragging(true);
            setStartX(e.pageX - infoBoxRef.current.offsetLeft);
            setScrollLeft(infoBoxRef.current.scrollLeft);
        };

        const duringDrag = (e: React.MouseEvent) => {
            if (!isDragging || !infoBoxRef.current) return;
            e.preventDefault();
            const x = e.pageX - infoBoxRef.current.offsetLeft;
            const walk = (x - startX) * 2; // Scroll multiplier
            infoBoxRef.current.scrollLeft = scrollLeft - walk;
        };

        const endDrag = () => {
            setIsDragging(false);
        };

        return (
            <div className="FileUploadContainer">
                <div className="FileUploadRow">

                    
                    <div className="FileUploadBoxes">
                        <span className="FileUploadLabel">
                        {label}
                        </span>

                        <div 

                            className={`FileInfoBox ${isDragging ? 'grabbing' : ''}`}
                            ref={infoBoxRef}
                            onMouseDown={startDrag}
                            onMouseMove={duringDrag}
                            onMouseUp={endDrag}
                            onMouseLeave={endDrag}
                        
                        >
                            {fileName ? fileName : `Expected: ${expectedColumns}`}
                        </div>
                        <label className="FileUploadButton">
                            {fileName ? (
                            <div className="RemoveFile" onClick={handleRemoveFile}>✕</div>
                            ) : (
                            <div className="RemoveFile">Choose File</div>
                            )}
                            <input 
                            ref={fileInputRef}
                            type="file" 
                            accept=".csv,.xlsx" 
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                            />
                        </label>
                       
                    </div>
                </div>
            </div>
        );
    };
    const expectedPayslipColumns = {
        id: "ID",
        name: "Name",
        position: "Position",
        monthlyTotalPay: "Monthly Total Pay",
        basicPay: "Basic Pay",
        halfBasicPay: "1/2 Basic Pay",
        withholdingTax: "Withholding Tax",
        sssLoan: "SSS Loan",
        calamityLoan: "Calamity Loan",
        cashAdvance: "Cash Advance",
        otherRecurring: "Other Recurring",
        otherDeduct: "Other Deduct",
        absenceUndertime: "Absence / Undertime",
        sss: "SSS",
        pagibig: "Pag-IBIG",
        philHealth: "PhilHealth",
        totalContributions: "Total Contributions",
        totalDeductions: "Total Deductions",
        halfCola: "1/2 COLA",
        otherAddition: "Other Addition",
        totalIncome: "Total Income",
        netTotal: "Net Total",
        incomeForPayslip: "Income for Payslip",
        netForPayslip: "Net for Payslip",
        remarks: "Remarks",
        bpi: "BPI",
        email: "Email",
        leavesAccrued: "Leaves Accrued",
        leavesUsed: "Leaves Used",
        leavesRemaining: "Leaves Remaining"
    };
    
    const PayslipUploadButton = ({
        label,
        expectedColumns,
        }: {
        label: string;
        expectedColumns: typeof expectedPayslipColumns;
        }) => {
        const [fileName, setFileName] = useState<string | null>(null);
        const fileInputRef = useRef<HTMLInputElement>(null);
        const infoBoxRef = useRef<HTMLDivElement>(null);
        const [isDragging, setIsDragging] = useState(false);
        const [startX, setStartX] = useState(0);
        const [scrollLeft, setScrollLeft] = useState(0);
        const [selectedFile, setSelectedFile] = useState<File | null>(null);
        const { isOpen, onOpen, onClose } = useDisclosure();

        const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
                if (file) {
                    setSelectedFile(file);
                    setFileName(file.name);
                    onOpen();
                }
        };

        const confirmUpload = async () => {
            if (!selectedFile) return;

            try {
                uploadPayslips(await parsePayslipCSV(selectedFile));

                console.log("Payslip uploaded successfully.");
            } catch (err) {
                console.error("Upload failed", err);
            }

            setSelectedFile(null);
            setFileName(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
            onClose();
        };

        function transformPayslipRows(rows: any[]): any[] {
            return rows.map(row => {
                const [last, firstAndMiddle] = row["Name"].split(",").map(s => s.trim());
                const [firstName, middleInitial = ""] = firstAndMiddle.split(" ");
                const middleName = middleInitial.replace(".", "");

                return {
                employeeID: Number(row["ID"]),
                lastName: last,
                firstName: firstName,
                middleName: middleName || "",

                department: "", // placeholder
                coordinator: "", // placeholder
                position: row["Position"],
                contactInfo: row["BPI"] || "",
                email: row["Email"] || "",

                totalSalary: Number(row["Monthly Total Pay"]),
                basicSalary: Number(row["Basic Pay"]),
                };
            });
        }

        async function uploadPayslips(rows: any[]) {
            const transformed = transformPayslipRows(rows);

            const res = await fetch("/api/payslip/upload", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(transformed),
            });

            const data = await res.json();
            return data;
        }

        const handleRemoveFile = () => {
            setFileName(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
        };

        // Manual scroll handlers
        const startDrag = (e: React.MouseEvent) => {
            if (!infoBoxRef.current) return;
            setIsDragging(true);
            setStartX(e.pageX - infoBoxRef.current.offsetLeft);
            setScrollLeft(infoBoxRef.current.scrollLeft);
        };

        const duringDrag = (e: React.MouseEvent) => {
            if (!isDragging || !infoBoxRef.current) return;
            e.preventDefault();
            const x = e.pageX - infoBoxRef.current.offsetLeft;
            const walk = (x - startX) * 2;
            infoBoxRef.current.scrollLeft = scrollLeft - walk;
        };

        const endDrag = () => {
            setIsDragging(false);
        };

        return (
            <>
                <div className="FileUploadContainer">
                    <div className="FileUploadRow">
                        <div className="FileUploadBoxes">
                            <span className="FileUploadLabel">{label}</span>

                            <div
                                className={`FileInfoBox ${isDragging ? "grabbing" : ""}`}
                                ref={infoBoxRef}
                                onMouseDown={startDrag}
                                onMouseMove={duringDrag}
                                onMouseUp={endDrag}
                                onMouseLeave={endDrag}
                            >
                                {fileName ? fileName : `Expected: ${expectedColumns}`}
                            </div>

                            <label className="FileUploadButton">
                                {fileName ? (
                                    <div className="RemoveFile" onClick={handleRemoveFile}>✕</div>
                                ) : (
                                    <div className="RemoveFile">Choose File</div>
                                )}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".csv,.xlsx"
                                    onChange={handleFileChange}
                                    style={{ display: "none" }}
                                />
                            </label>
                        </div>
                    </div>
                </div>
                <Modal isOpen={isOpen} onClose={onClose} isCentered>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Confirm Payslip Upload</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            Are you sure you want to upload <strong>{fileName}</strong> as the payslip file?
                        </ModalBody>
                        <ModalFooter>
                            <Button onClick={onClose} mr={3}>Cancel</Button>
                            <Button colorScheme="green" onClick={confirmUpload}>Upload</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </>
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
                    label="Glog csv" 
                    expectedColumns="No, Mchn, EnNo, Name, Mode, IOMd, DateTime" 
                    existingData={mergedEntries}
                    onParsed={setMergedEntries}
                    resetKey={resetKey}
                />
            </div>

            <div className="GdocWrapper">
                <FileUploadButton 
                    label="Gdoc csv" 
                    expectedColumns="Timestamp, Name of Employee, Action, Note" 
                    existingData={mergedEntries}
                    onParsed={setMergedEntries}
                    resetKey={resetKey}
                />
            </div>

            <div className="PayslipWrapper">
                <PayslipUploadButton 
                    label="Payslip csv" 
                    expectedColumns={expectedPayslipColumns}
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
                        <span>{unmatchedGlog.length === 0 ? "✓" : "⚠️"}</span>{" "}
                        {unmatchedGlog.length === 0
                            ? "All GLog entries matched."
                            : `${unmatchedGlog.length} unmatched entries from GLog`}
                    </div>
                    <div>
                        {unmatchedGdoc.length === 0 ? "✓" : "⚠️"}{" "}
                        {unmatchedGdoc.length === 0
                            ? "All GDoc entries matched."
                            : `${unmatchedGdoc.length} unmatched entries from GDoc`}
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
                    {mergedEntries.length > 0 && (
                        <Box
                            display="flex"
                            justifyContent="center"
                            mx="auto"
                            mt={6}
                            overflowX="auto"
                            overflowY="auto"
                            maxHeight="100%"
                            border="1px solid #ccc"
                            borderRadius="md"
                            bg="#FBFCE5"
                            className="FilePreviewWrapper"
                        >
                            <Table variant="unstyled" size="sm" className="employee-table-bordered">
                            <Thead bg="#A4B465" position="sticky" top={0} zIndex={1} h="50px">
                                <Tr>
                                {[
                                    "#",
                                    "Date",
                                    "Time",
                                    "Employee ID",
                                    "Last Name",
                                    "First Name",
                                    "Middle Name",
                                    "Position",
                                    "Contact No.",
                                    "Email",
                                ].map((header, idx) => (
                                    <Th key={idx} textAlign="center" p={2}>
                                    {header}
                                    </Th>
                                ))}
                                </Tr>
                            </Thead>
                            <Tbody>
                                {paginatedEntries.map((entry, idx) => {
                                const globalIndex = (currentPage - 1) * rowsPerPage + idx;
                                return (
                                    <Tr
                                        key={globalIndex }
                                        bg={
                                            globalIndex % 2 === 0
                                        ? "rgba(251, 252, 229, 0.93)"
                                        : "rgba(230, 226, 177, 0.93)"
                                    }
                                    style={{ userSelect: "none" }}
                                >
                                    <Td textAlign="center">{globalIndex + 1}</Td>
                                    <Td textAlign="center">{entry.datetime instanceof Date ? entry.datetime.toLocaleString() : entry.datetime}</Td>
                                    <Td textAlign="center">{entry.datetime instanceof Date ? entry.datetime.toLocaleString() : entry.datetime}</Td>
                                    <Td textAlign="center">{entry.employeeID}</Td>
                                    <Td textAlign="center">{entry.employeeName}</Td>
                                    <Td textAlign="center">{entry.employeeName}</Td>
                                    <Td textAlign="center">{entry.employeeName}</Td>
                                    <Td textAlign="center">insert position</Td>
                                    <Td textAlign="center">insert contact</Td>
                                    <Td textAlign="center">insert email</Td>
                                </Tr>
                                );
                            })}
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