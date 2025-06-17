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
import { AddIcon, EditIcon } from "@chakra-ui/icons";

/* SAMPLE EMPLOYEE DATA */
const employeeData = [
  {
    name: "Juanito Dela Cruz",
    id: "121111111",
    position: "teacher",
    totalSalary: "20,000",
    basicSalary: "20,000",
    department: "teaching",
    coordinator: "guy",
    term: "7",
    email: "ada",
  },
  {
    name: "john mark padilla",
    id: "121111111",
    position: "teacher",
    totalSalary: "20,000",
    basicSalary: "20,000",
    department: "teaching",
    coordinator: "guy",
    term: "7",
    email: "cool ada",
  },
  {
    name: "juanita dela czuTIA",
    id: "121111111",
    position: "teacher",
    totalSalary: "20,000",
    basicSalary: "20,000",
    department: "teaching",
    coordinator: "guy",
    term: "7",
    email: "ad guy",
  },
  {
    name: "Jon Jones Joestar",
    id: "121111111",
    position: "teacher",
    totalSalary: "20,000",
    basicSalary: "20,000",
    department: "teaching",
    coordinator: "guy",
    term: "7",
    email: "coadaol guy",
  },
];

const EmployeeTable = () => {
  return (
    <Box
      bg="#FAF6C7"
      minHeight="100vh"
      p={6}
      position="relative"
      fontFamily="'Inter', sans-serif"
      backgroundImage="url('/rainbow.png')"
      backgroundRepeat="no-repeat"
      backgroundSize="cover"
      backgroundPosition="center"
    >
      <Box
        bg="#FAF6C7"
        border="1px solid #000000"
        borderRadius="md"
        zIndex={1}
        position="relative"
        maxHeight="600px"
        overflowY="auto"
      >
        <Table variant="simple" minWidth="1000px">
          <Thead bg="#A4B15C">
            <Tr>
              {[
                "Name",
                "Employee ID",
                "Position",
                "Total Salary",
                "Basic Salary",
                "Department",
                "Coordinator",
                "Term",
                "Email",
                "",
              ].map((header, idx) => (
                <Th key={idx} color="#2E3D10">
                  {header}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {employeeData.map((emp, index) => (
              <Tr key={index} bg="rgba(255, 255, 255, 0.25)">
                <Td>{emp.name}</Td>
                <Td>{emp.id}</Td>
                <Td>{emp.position}</Td>
                <Td>{emp.totalSalary}</Td>
                <Td>{emp.basicSalary}</Td>
                <Td>{emp.department}</Td>
                <Td>{emp.coordinator}</Td>
                <Td>{emp.term}</Td>
                <Td>{emp.email}</Td>
                <Td>
                  <IconButton
                    icon={<EditIcon />}
                    aria-label="Edit"
                    variant="ghost"
                    border="2px solid #626F47"
                    bg="#FEFAE0"
                    color="#626F47"
                    height="50px"
                    width="50px"
                    fontWeight="bold"
                    _hover={{ bg: "#626F47", color: "#FEFAE0" }}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <Flex
        justify="space-between"
        align="center"
        mt={6}
        flexWrap="wrap"
        gap={2}
        zIndex={1}
        position="relative"
      >
        <Flex gap={3} flexWrap="wrap">
          {["Profile", "Earnings", "Deductions", "Payslips"].map((label) => (
            <Button
              key={label}
              bg="#FEFAE0"
              color="#626F47"
              border="2px solid #626F47"
              height="50px"
              width="120px"
              fontWeight="bold"
              _hover={{ bg: "#626F47", color: "#FEFAE0" }}
            >
              {label}
            </Button>
          ))}
        </Flex>

        <Flex align="center" gap={4}>
          <Button
            variant="ghost"
            border="2px solid #626F47"
            bg="#FEFAE0"
            color="#626F47"
            height="50px"
            width="160px"
            fontWeight="bold"
            _hover={{ bg: "#626F47", color: "#FEFAE0" }}
          >
            View Edit History
          </Button>

          <IconButton
            icon={<AddIcon />}
            aria-label="Add"
            bg="#F6C62E"
            border="2px solid #626F47"
            _hover={{ bg: "#E0B722" }}
            borderRadius="full"
            height="50px"
            width="50px"
          />
        </Flex>
      </Flex>
    </Box>
  );
};

export default EmployeeTable;
