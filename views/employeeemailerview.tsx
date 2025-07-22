import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  VStack,
  HStack,
  Divider,
} from "@chakra-ui/react";
import { FaSave, FaPaperPlane } from "react-icons/fa";

const EmployeeEmailer = () => {
type PDFFile = {
  url: string;
  name: string;
  assignedTo?: string;
};
const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([]);
const [currentIndex, setCurrentIndex] = useState<number>(0);
const fileInputRef = React.useRef<HTMLInputElement | null>(null);

type Employee = {
  employeeID: string;
  firstName: string;
  lastName: string;
  email: string;
};

const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
const [employeeMap, setEmployeeMap] = useState<Map<string, Employee>>(new Map());
const [matchedEmployees, setMatchedEmployees] = useState<EmployeeWithPDFs[]>([]);

type EmployeeWithPDFs = Employee & {
  pdfs: PDFFile[];
};

useEffect(() => {
  const fetchEmployees = async () => {
    const response = await fetch("/api/employees");
    const data = await response.json();

    console.log("DEBUG fetch result:", data);
    const employees: Employee[] = Array.isArray(data) ? data : data.data || [];
    setAllEmployees(employees);

    const map = new Map<string, Employee>();
    employees.forEach(emp => {
      const key = `${emp.lastName}-${emp.firstName}`;
      map.set(key, emp);
    });
    setEmployeeMap(map);
    console.log("Employee map keys:", Array.from(map.keys()));
  };

  fetchEmployees();
}, []);

const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const files = event.target.files;
  if (!files || files.length === 0) return;

  if (!Array.isArray(allEmployees)) {
    console.error("allEmployees is not ready:", allEmployees);
    return;
  }

  const newPDFs: PDFFile[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.type !== "application/pdf") continue;

    const url = URL.createObjectURL(file);
    const name = file.name;

    const match = name.match(/^([^-]+)-([^-]+)-/);
    if (!match) continue;

    const [_, lastName, firstName] = match;
    const key = `${lastName}-${firstName}`;

    newPDFs.push({ url, name, assignedTo: key });
  }

  const updatedEmployees: EmployeeWithPDFs[] = [];

  newPDFs.forEach((pdf) => {
  console.log("Trying to match PDF:", pdf.name, "as", pdf.assignedTo);
  const emp = employeeMap.get(pdf.assignedTo ?? "");
  if (emp) {
    const existing = updatedEmployees.find((e) => e.employeeID === emp.employeeID
);
    if (existing) {
      existing.pdfs.push(pdf);
    } else {
      updatedEmployees.push({ ...emp, pdfs: [pdf] });
    }
  }
});

  setMatchedEmployees((prev) => {
    const updated = [...prev];
    updatedEmployees.forEach((newEmp) => {
      const existing = updated.find((e) => e.employeeID === newEmp.employeeID);
      if (existing) {
        existing.pdfs.push(...newEmp.pdfs);
      } else {
        updated.push(newEmp);
      }
    });
    return updated;
  });

  setPdfFiles((prev) => [...prev, ...newPDFs]);
  setCurrentIndex(0);
};

const blobToBase64 = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

const handleEmailAll = async () => {
  for (const emp of matchedEmployees) {
    const attachments = await Promise.all(
      emp.pdfs.map(async (pdf) => {
        const blob = await fetch(pdf.url).then((res) => res.blob());
        const content = await blobToBase64(blob);
        return {
          filename: pdf.name,
          content,
          encoding: 'base64',
        };
      })
    );

    const res = await fetch('/api/email/send-brevo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: emp.email,
        subject: 'Your Payslips',
        text: 'Attached are your payslip(s).',
        attachments,
      }),
    });

    if (!res.ok) {
      console.error(`Failed to send to ${emp.email}`);
    }
  }

  alert('All emails sent!');
};

const handleEmailCurrent = async () => {
  const currentPDF = pdfFiles[currentIndex];
  if (!currentPDF) return;

  const emp = employeeMap.get(currentPDF.assignedTo ?? "");
  if (!emp) {
    alert("No matching employee found for this PDF.");
    return;
  }

  const blob = await fetch(currentPDF.url).then((res) => res.blob());
  const content = await blobToBase64(blob);

  const res = await fetch('/api/email/send-brevo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: emp.email,
      subject: 'Your Payslip',
      text: 'Attached is your payslip.',
      attachments: [
        {
          filename: currentPDF.name,
          content,
          encoding: 'base64',
        },
      ],
    }),
  });

  if (res.ok) {
    alert(`Email sent to ${emp.firstName} ${emp.lastName} at ${emp.email}`);
  } else {
    console.error(`Failed to send to ${emp.email}`);
    alert("Failed to send the email.");
  }
};


  return (
    <Flex p="6" gap="6" w="100%" h="full" align="flex-start">
      {/* Left: Employee List Box */}
      <Box
        flex="1"
        bg="#FFFCD9"
        borderRadius="md"
        p="5"
        boxShadow="md"
        border="1px solid #FFFCD9"
        minW="300px"
      >
        <Text fontWeight="bold" fontSize="lg" color="#48630E">
          BLOOMINGFIELDS ACADEMY FOUNDATION INC.
        </Text>
        <Text fontWeight="bold" fontSize="md" color="#638813" mt="1">
          Soli Deo Gloria
        </Text>
        <Text fontWeight="bold" fontSize="md" color="#3A3C34">
          Buensuceso, Arayat, Pampanga
        </Text>

        <Divider my="4" />

        {/* Entire employee section wrapped in a box */}
        <Box
          bg="#FFFFF5"
          border="1px solid #CCC"
          borderRadius="md"
          p="4"
          h="calc(100% - 150px)"
          display="flex"
          flexDirection="column"
        >
          <Text fontWeight="bold" fontSize="md" color="#48630E" mb="3">
            Selected Employee
          </Text>

          <Box maxH="45vh" overflowY="auto">
            <VStack align="start" spacing="3">
              {matchedEmployees.map((emp) => (
                <Box
                  key={emp.employeeID}
                  border="1px solid #CCC"
                  p="2"
                  w="100%"
                  borderRadius="md"
                  bg="#F9F9F9"
                >
                  <Text fontSize="sm">
                    <Box as="span" color="#48630E" fontWeight="bold">
                      Employee Name:
                    </Box>{" "}
                    <Box as="span" color="#000000">
                      {emp.lastName}, {emp.firstName}
                    </Box>
                  </Text>

                  <Text fontSize="sm">
                    <Box as="span" color="#48630E" fontWeight="bold">
                      ID:
                    </Box>{" "}
                    <Box as="span" color="#000000">
                      {emp.employeeID}
                    </Box>
                  </Text>

                  <Text fontSize="sm">
                    <Box as="span" color="#48630E" fontWeight="bold">
                      Email:
                    </Box>{" "}
                    <Box as="span" color="#000000">
                      {emp.email}
                    </Box>
                  </Text>

                  <Text fontSize="sm" mt="2">
                    <Box as="span" color="#48630E" fontWeight="bold">
                      PDF(s) to be sent:
                    </Box>
                  </Text>

                  {emp.pdfs.map((pdf, i) => (
                    <Text key={i} fontSize="sm" ml="4">
                      [{pdf.name}]
                    </Text>
                  ))}
                </Box>
              ))}
            </VStack>
          </Box>
        </Box>
      </Box>

      {/* Right: PDF View Box */}
      <Box
        flex="3"
        bg="#FFFCD9"
        borderRadius="md"
        p="5"
        boxShadow="md"
        minW="500px"
      >
      <Flex justify="space-between" align="center" mb="3">
        <Box>
          <Text fontWeight="extrabold" fontSize="lg" color="#48630E">
            PDF View
          </Text>
          {pdfFiles.length > 0 && (
            <Text fontWeight="bold" fontSize="sm" color="#48630E">
              Currently viewing: {pdfFiles[currentIndex]?.name}
            </Text>
          )}
        </Box>

        <Flex gap={3}>
          <Button
            size="sm"
            bg="#EEE9AA"
            color="#48630E"
            fontWeight="bold"
            _hover={{ bg: "#626F47", color: "#FEFAE0" }}
            onClick={() => fileInputRef.current?.click()}
          >
            Import PDF
          </Button>
          <input
            type="file"
            accept="application/pdf"
            multiple
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <Button
            size="sm"
            leftIcon={<FaPaperPlane />}
            bg="#EEE9AA"
            color="#48630E"
            fontWeight="bold"
            onClick={handleEmailCurrent}
            _hover={{ bg: "#626F47", color: "#FEFAE0" }}
          >
            Email Current PDF
          </Button>
          <Button
            size="sm"
            bg="#EEE9AA"
            color="#48630E"
            fontWeight="bold"
            onClick={handleEmailAll}
            _hover={{ bg: "#626F47", color: "#FEFAE0" }}
          >
            Email All PDFs
          </Button>
        </Flex>
      </Flex>

        {/* PDF Placeholder */}
        <Box
          border="1px solid #AAA"
          borderRadius="md"
          bg="white"
          h="70vh"
          w="100%"
          overflow="hidden"
        >
          {pdfFiles.length > 0 ? (
            <embed src={pdfFiles[currentIndex]?.url} width="100%" height="100%" type="application/pdf" />
          ) : (
            <Flex h="100%" align="center" justify="center" color="gray.400">
              <Text fontSize="sm">[ PDF Preview Area ]</Text>
            </Flex>
          )}
        </Box>
        {pdfFiles.length > 1 && (
        <Flex justify="center" align="center" mt="3" gap="2">
          <Button
            size="xs"
            onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
            isDisabled={currentIndex === 0}
          >
            &lt;
          </Button>

          <Text fontSize="sm">PDF:</Text>
          <input
            type="number"
            value={currentIndex + 1}
            min={1}
            max={pdfFiles.length}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (!isNaN(value) && value >= 1 && value <= pdfFiles.length) {
                setCurrentIndex(value - 1);
              }
            }}
            style={{
              width: "50px",
              padding: "4px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              textAlign: "center",
            }}
          />
          <Text fontSize="sm">of {pdfFiles.length}</Text>

          <Button
            size="xs"
            onClick={() =>
              setCurrentIndex((prev) => Math.min(prev + 1, pdfFiles.length - 1))
            }
            isDisabled={currentIndex === pdfFiles.length - 1}
          >
            &gt;
          </Button>
        </Flex>
      )}
      </Box>
    </Flex>
  );
};

export default EmployeeEmailer;
