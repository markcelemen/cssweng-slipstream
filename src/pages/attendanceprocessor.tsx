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
import { GLogEntry, parseCSV } from "../utils/attendance/biometrics";

export default function CsvViewer (){
    const [data, setData] = useState<GlogEntry[]>([]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file){
        parseCSV(file, setData);
    }
      e.target.value = ""; // Reset file input
    };


    return (
      <Box>
        <input type="file" accept=".csv" onChange={handleFileUpload} />

        {data.length > 0 && (
          <Table mt={4} size="sm" variant="striped">
            <Thead>
              <Tr>
                <Th fontSize="9px" textAlign="center">ID</Th>
                <Th fontSize="9px" textAlign="center">Position</Th>
                <Th fontSize="9px" textAlign="center">Name</Th>
                <Th fontSize="9px" textAlign="center">Username</Th>
                <Th fontSize="9px" textAlign="center">Date</Th>
                {/* <Th fontSize="9px" textAlign="center">Time</Th> */}
                <Th fontSize="9px" textAlign="center">Late</Th>
                <Th fontSize="9px" textAlign="center">Late Deduct</Th>
                <Th fontSize="9px" textAlign="center">Irregular</Th>
                <Th fontSize="9px" textAlign="center">Undertime</Th>
                <Th fontSize="9px" textAlign="center">Undertime Deduct</Th>
                <Th fontSize="9px" textAlign="center">Excused</Th>
                <Th fontSize="9px" textAlign="center">Note</Th>
              </Tr>
            </Thead>
            <Tbody bg="#FEFAE0">
              {data.map((entry, index) => (
                <Tr key={index}>
                  <Td fontSize="10px" textAlign="center">{entry.id}</Td>
                  <Td fontSize="10px" textAlign="center">{entry.position}</Td>
                  <Td fontSize="10px" textAlign="center">{entry.name}</Td>
                  <Td fontSize="10px" textAlign="center">{entry.username}</Td>
                  <Td fontSize="10px" textAlign="center">
                      {entry.date instanceof Date && !isNaN(entry.date.getTime())
                      ? entry.date.toLocaleString() : "Invalid Date"}</Td>
                  {/* <Td fontSize="10px" textAlign="center">{entry.time}</Td> */}
                  <Td fontSize="10px" textAlign="center">{entry.late}</Td>
                  <Td fontSize="10px" textAlign="center">{entry.lateDeduct}</Td>
                  <Td fontSize="10px" textAlign="center">{entry.irregular}</Td>
                  <Td fontSize="10px" textAlign="center">{entry.undertime}</Td>
                  <Td fontSize="10px" textAlign="center">{entry.undertimeDeduct}</Td>
                  <Td fontSize="10px" textAlign="center">{entry.excused}</Td>
                  <Td fontSize="10px" textAlign="center">{entry.note}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>
    );
}


