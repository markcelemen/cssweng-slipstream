import {
  Box,
  Button,
  Flex,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { parseCSV } from "../utils/attendance/processAttendance";
import { AttendanceEntry } from "../utils/attendance/attendanceTypes";

export default function CsvViewer (){
    const [entries, setEntries] = useState<AttendanceEntry[]>([]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file){
        parseCSV(file, entries, setEntries);
    }
      e.target.value = ""; // Reset file input
    };


    return (
      <Box>
        <input type="file" accept=".csv" onChange={handleFileUpload} />

        {entries.length > 0 && (
          <Table mt={4} size="sm" variant="striped">
            <Thead>
              <Tr>
                <Th fontSize="9px" textAlign="center">DATE</Th>
                <Th fontSize="9px" textAlign="center">EMPLOYEE ID</Th>
                <Th fontSize="9px" textAlign="center">EMPLOYEE NAME</Th>
                <Th fontSize="9px" textAlign="center">TIME</Th>
                <Th fontSize="9px" textAlign="center">LATE DEDUCTION</Th>
                <Th fontSize="9px" textAlign="center">EARLY DEDUCTION</Th>
                <Th fontSize="9px" textAlign="center">REMARKS</Th>
              </Tr>
            </Thead>
            <Tbody bg="#FEFAE0">
              {entries.map((entry, index) => (
                <Tr key={index}>
                  <Td fontSize="10px" textAlign="center">
                      {entry.datetime instanceof Date
                      ? entry.datetime.toLocaleDateString() : "Invalid Date"}</Td>
                  <Td fontSize="10px" textAlign="center">{entry.employeeID}</Td>
                  <Td fontSize="10px" textAlign="center">{entry.employeeName}</Td>
                  <Td fontSize="10px" textAlign="center">
                      {entry.datetime instanceof Date
                      ? entry.datetime.toLocaleTimeString() : "Invalid Time"}</Td>
                  <Td fontSize="10px" textAlign="center">{entry.lateDeduct}</Td>
                  <Td fontSize="10px" textAlign="center">{entry.earlyDeduct}</Td>
                  <Td fontSize="10px" textAlign="center">{entry.remarks}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>
    );
}


