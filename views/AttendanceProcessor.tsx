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
import Papa from "papaparse";


interface GlogEntry {
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

const CsvViewer: React.FC = () => {
  const [data, setData] = useState<GlogEntry[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
      header: false, // read all as raw
      skipEmptyLines: true,
      complete: (results) => {
        const raw = results.data as string[][];
        const rows = raw.slice(1).map((row) => {
          const entry: Partial<GlogEntry> = {};
          headers.forEach((key, i) => {
            if (key === "date"){
              // Convert date string to Date object
              const dateStr = row[i] + " " + row[i + 1]; // Combine date and time
              const parsed = dateStr ? new Date(dateStr) : null;
              entry[key as keyof GlogEntry] = parsed as any;
            }
            else {
                (entry as any)[key] = row[i] ?? "";
            }
          });
          return entry as GlogEntry;
        });

        setData(rows);
      },
    });
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
};

export default CsvViewer;
