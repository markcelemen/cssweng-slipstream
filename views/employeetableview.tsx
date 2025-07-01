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
    lastName: "Dela Cruz",
    firstName: "John",
    middleName: "Jacob",
    department: "Human Resources",
    coordinator: "Cloud Strife",
    position: "Manager",
    totalSalary: 30000,
    basicSalary: 25000,
    contactNumber: "09291834893",
    employeeId: "890093814",
    email: "karlkiegokarlkiego@gmail.com"
  },
  {
    lastName: "Delanye",
    firstName: "West",
    middleName: "Kardashian",
    department: "Maintenance",
    coordinator: "Joe Pesci",
    position: "Janitor",
    totalSalary: 15000,
    basicSalary: 10000,
    contactNumber: "09159612345",
    employeeId: "82341568",
    email: "john_rovere_iralil@dlsu.edu.ph"
  },
  {
    lastName: "Englishera",
    firstName: "Elany",
    middleName: "Eros",
    department: "Teaching",
    coordinator: "Keyshia Cole",
    position: "Teacher",
    totalSalary: 20000,
    basicSalary: 18000,
    contactNumber: "09415962345",
    employeeId: "82341568",
    email: "ireallylovemydog@gmail.com"
  },
  {
    lastName: "Eash",
    firstName: "Maya",
    middleName: "Ash",
    department: "Teaching",
    coordinator: "Keyshia Cole",
    position: "Teacher",
    totalSalary: 21000,
    basicSalary: 18000,
    contactNumber: "09191622346",
    employeeId: "82341568",
    email: "IhaveHemorrhoids@gmail.com"
  },
  {
    lastName: "Franco",
    firstName: "Philip",
    middleName: "De",
    department: "Human Resources",
    coordinator: "Cloud Strife",
    position: "Recruiter",
    totalSalary: 25000,
    basicSalary: 20000,
    contactNumber: "09191622346",
    employeeId: "82341568",
    email: "catsaresupercute@gmail.com"
  },
  {
    lastName: "Dela Cruz",
    firstName: "John",
    middleName: "Jacob",
    department: "Human Resources",
    coordinator: "Cloud Strife",
    position: "Manager",
    totalSalary: 30000,
    basicSalary: 25000,
    contactNumber: "09291834893",
    employeeId: "890093814",
    email: "karlkiegokarlkiego@gmail.com"
  },
  {
    lastName: "Delanye",
    firstName: "West",
    middleName: "Kardashian",
    department: "Maintenance",
    coordinator: "Joe Pesci",
    position: "Janitor",
    totalSalary: 15000,
    basicSalary: 10000,
    contactNumber: "09159612345",
    employeeId: "82341568",
    email: "john_rovere_iralil@dlsu.edu.ph"
  },
  {
    lastName: "Englishera",
    firstName: "Elany",
    middleName: "Eros",
    department: "Teaching",
    coordinator: "Keyshia Cole",
    position: "Teacher",
    totalSalary: 20000,
    basicSalary: 18000,
    contactNumber: "09415962345",
    employeeId: "82341568",
    email: "ireallylovemydog@gmail.com"
  },
  {
    lastName: "Eash",
    firstName: "Maya",
    middleName: "Ash",
    department: "Teaching",
    coordinator: "Keyshia Cole",
    position: "Teacher",
    totalSalary: 21000,
    basicSalary: 18000,
    contactNumber: "09191622346",
    employeeId: "82341568",
    email: "IhaveHemorrhoids@gmail.com"
  },
  {
    lastName: "Franco",
    firstName: "Philip",
    middleName: "De",
    department: "Human Resources",
    coordinator: "Cloud Strife",
    position: "Recruiter",
    totalSalary: 25000,
    basicSalary: 20000,
    contactNumber: "09191622346",
    employeeId: "82341568",
    email: "catsaresupercute@gmail.com"
  },
  {
    lastName: "Dela Cruz",
    firstName: "John",
    middleName: "Jacob",
    department: "Human Resources",
    coordinator: "Cloud Strife",
    position: "Manager",
    totalSalary: 30000,
    basicSalary: 25000,
    contactNumber: "09291834893",
    employeeId: "890093814",
    email: "karlkiegokarlkiego@gmail.com"
  },
  {
    lastName: "Delanye",
    firstName: "West",
    middleName: "Kardashian",
    department: "Maintenance",
    coordinator: "Joe Pesci",
    position: "Janitor",
    totalSalary: 15000,
    basicSalary: 10000,
    contactNumber: "09159612345",
    employeeId: "82341568",
    email: "john_rovere_iralil@dlsu.edu.ph"
  },
  {
    lastName: "Englishera",
    firstName: "Elany",
    middleName: "Eros",
    department: "Teaching",
    coordinator: "Keyshia Cole",
    position: "Teacher",
    totalSalary: 20000,
    basicSalary: 18000,
    contactNumber: "09415962345",
    employeeId: "82341568",
    email: "ireallylovemydog@gmail.com"
  },
  {
    lastName: "Eash",
    firstName: "Maya",
    middleName: "Ash",
    department: "Teaching",
    coordinator: "Keyshia Cole",
    position: "Teacher",
    totalSalary: 21000,
    basicSalary: 18000,
    contactNumber: "09191622346",
    employeeId: "82341568",
    email: "IhaveHemorrhoids@gmail.com"
  },
  {
    lastName: "Franco",
    firstName: "Philip",
    middleName: "De",
    department: "Human Resources",
    coordinator: "Cloud Strife",
    position: "Recruiter",
    totalSalary: 25000,
    basicSalary: 20000,
    contactNumber: "09191622346",
    employeeId: "82341568",
    email: "catsaresupercute@gmail.com"
  },
  {
    lastName: "Dela Cruz",
    firstName: "John",
    middleName: "Jacob",
    department: "Human Resources",
    coordinator: "Cloud Strife",
    position: "Manager",
    totalSalary: 30000,
    basicSalary: 25000,
    contactNumber: "09291834893",
    employeeId: "890093814",
    email: "karlkiegokarlkiego@gmail.com"
  },
  {
    lastName: "Delanye",
    firstName: "West",
    middleName: "Kardashian",
    department: "Maintenance",
    coordinator: "Joe Pesci",
    position: "Janitor",
    totalSalary: 15000,
    basicSalary: 10000,
    contactNumber: "09159612345",
    employeeId: "82341568",
    email: "john_rovere_iralil@dlsu.edu.ph"
  },
  {
    lastName: "Englishera",
    firstName: "Elany",
    middleName: "Eros",
    department: "Teaching",
    coordinator: "Keyshia Cole",
    position: "Teacher",
    totalSalary: 20000,
    basicSalary: 18000,
    contactNumber: "09415962345",
    employeeId: "82341568",
    email: "ireallylovemydog@gmail.com"
  },
  {
    lastName: "Eash",
    firstName: "Maya",
    middleName: "Ash",
    department: "Teaching",
    coordinator: "Keyshia Cole",
    position: "Teacher",
    totalSalary: 21000,
    basicSalary: 18000,
    contactNumber: "09191622346",
    employeeId: "82341568",
    email: "IhaveHemorrhoids@gmail.com"
  },
  {
    lastName: "Franco",
    firstName: "Philip",
    middleName: "De",
    department: "Human Resources",
    coordinator: "Cloud Strife",
    position: "Recruiter",
    totalSalary: 25000,
    basicSalary: 20000,
    contactNumber: "09191622346",
    employeeId: "82341568",
    email: "catsaresupercute@gmail.com"
  },{
    lastName: "Dela Cruz",
    firstName: "John",
    middleName: "Jacob",
    department: "Human Resources",
    coordinator: "Cloud Strife",
    position: "Manager",
    totalSalary: 30000,
    basicSalary: 25000,
    contactNumber: "09291834893",
    employeeId: "890093814",
    email: "karlkiegokarlkiego@gmail.com"
  },
  {
    lastName: "Delanye",
    firstName: "West",
    middleName: "Kardashian",
    department: "Maintenance",
    coordinator: "Joe Pesci",
    position: "Janitor",
    totalSalary: 15000,
    basicSalary: 10000,
    contactNumber: "09159612345",
    employeeId: "82341568",
    email: "john_rovere_iralil@dlsu.edu.ph"
  },
  {
    lastName: "Englishera",
    firstName: "Elany",
    middleName: "Eros",
    department: "Teaching",
    coordinator: "Keyshia Cole",
    position: "Teacher",
    totalSalary: 20000,
    basicSalary: 18000,
    contactNumber: "09415962345",
    employeeId: "82341568",
    email: "ireallylovemydog@gmail.com"
  },
  {
    lastName: "Eash",
    firstName: "Maya",
    middleName: "Ash",
    department: "Teaching",
    coordinator: "Keyshia Cole",
    position: "Teacher",
    totalSalary: 21000,
    basicSalary: 18000,
    contactNumber: "09191622346",
    employeeId: "82341568",
    email: "IhaveHemorrhoids@gmail.com"
  },
  {
    lastName: "Franco",
    firstName: "Philip",
    middleName: "De",
    department: "Human Resources",
    coordinator: "Cloud Strife",
    position: "Recruiter",
    totalSalary: 25000,
    basicSalary: 20000,
    contactNumber: "09191622346",
    employeeId: "82341568",
    email: "catsaresupercute@gmail.com"
  },{
    lastName: "Dela Cruz",
    firstName: "John",
    middleName: "Jacob",
    department: "Human Resources",
    coordinator: "Cloud Strife",
    position: "Manager",
    totalSalary: 30000,
    basicSalary: 25000,
    contactNumber: "09291834893",
    employeeId: "890093814",
    email: "karlkiegokarlkiego@gmail.com"
  },
  {
    lastName: "Delanye",
    firstName: "West",
    middleName: "Kardashian",
    department: "Maintenance",
    coordinator: "Joe Pesci",
    position: "Janitor",
    totalSalary: 15000,
    basicSalary: 10000,
    contactNumber: "09159612345",
    employeeId: "82341568",
    email: "john_rovere_iralil@dlsu.edu.ph"
  },
  {
    lastName: "Englishera",
    firstName: "Elany",
    middleName: "Eros",
    department: "Teaching",
    coordinator: "Keyshia Cole",
    position: "Teacher",
    totalSalary: 20000,
    basicSalary: 18000,
    contactNumber: "09415962345",
    employeeId: "82341568",
    email: "ireallylovemydog@gmail.com"
  },
  {
    lastName: "Eash",
    firstName: "Maya",
    middleName: "Ash",
    department: "Teaching",
    coordinator: "Keyshia Cole",
    position: "Teacher",
    totalSalary: 21000,
    basicSalary: 18000,
    contactNumber: "09191622346",
    employeeId: "82341568",
    email: "IhaveHemorrhoids@gmail.com"
  },
  {
    lastName: "Franco",
    firstName: "Philip",
    middleName: "De",
    department: "Human Resources",
    coordinator: "Cloud Strife",
    position: "Recruiter",
    totalSalary: 25000,
    basicSalary: 20000,
    contactNumber: "09191622346",
    employeeId: "82341568",
    email: "catsaresupercute@gmail.com"
  },{
    lastName: "Dela Cruz",
    firstName: "John",
    middleName: "Jacob",
    department: "Human Resources",
    coordinator: "Cloud Strife",
    position: "Manager",
    totalSalary: 30000,
    basicSalary: 25000,
    contactNumber: "09291834893",
    employeeId: "890093814",
    email: "karlkiegokarlkiego@gmail.com"
  },
  {
    lastName: "Delanye",
    firstName: "West",
    middleName: "Kardashian",
    department: "Maintenance",
    coordinator: "Joe Pesci",
    position: "Janitor",
    totalSalary: 15000,
    basicSalary: 10000,
    contactNumber: "09159612345",
    employeeId: "82341568",
    email: "john_rovere_iralil@dlsu.edu.ph"
  },
  {
    lastName: "Englishera",
    firstName: "Elany",
    middleName: "Eros",
    department: "Teaching",
    coordinator: "Keyshia Cole",
    position: "Teacher",
    totalSalary: 20000,
    basicSalary: 18000,
    contactNumber: "09415962345",
    employeeId: "82341568",
    email: "ireallylovemydog@gmail.com"
  },
  {
    lastName: "Eash",
    firstName: "Maya",
    middleName: "Ash",
    department: "Teaching",
    coordinator: "Keyshia Cole",
    position: "Teacher",
    totalSalary: 21000,
    basicSalary: 18000,
    contactNumber: "09191622346",
    employeeId: "82341568",
    email: "IhaveHemorrhoids@gmail.com"
  },
  {
    lastName: "Franco",
    firstName: "Philip",
    middleName: "De",
    department: "Human Resources",
    coordinator: "Cloud Strife",
    position: "Recruiter",
    totalSalary: 25000,
    basicSalary: 20000,
    contactNumber: "09191622346",
    employeeId: "82341568",
    email: "catsaresupercute@gmail.com"
  },{
    lastName: "Dela Cruz",
    firstName: "John",
    middleName: "Jacob",
    department: "Human Resources",
    coordinator: "Cloud Strife",
    position: "Manager",
    totalSalary: 30000,
    basicSalary: 25000,
    contactNumber: "09291834893",
    employeeId: "890093814",
    email: "karlkiegokarlkiego@gmail.com"
  },
  {
    lastName: "Delanye",
    firstName: "West",
    middleName: "Kardashian",
    department: "Maintenance",
    coordinator: "Joe Pesci",
    position: "Janitor",
    totalSalary: 15000,
    basicSalary: 10000,
    contactNumber: "09159612345",
    employeeId: "82341568",
    email: "john_rovere_iralil@dlsu.edu.ph"
  },
  {
    lastName: "Englishera",
    firstName: "Elany",
    middleName: "Eros",
    department: "Teaching",
    coordinator: "Keyshia Cole",
    position: "Teacher",
    totalSalary: 20000,
    basicSalary: 18000,
    contactNumber: "09415962345",
    employeeId: "82341568",
    email: "ireallylovemydog@gmail.com"
  },
  {
    lastName: "Eash",
    firstName: "Maya",
    middleName: "Ash",
    department: "Teaching",
    coordinator: "Keyshia Cole",
    position: "Teacher",
    totalSalary: 21000,
    basicSalary: 18000,
    contactNumber: "09191622346",
    employeeId: "82341568",
    email: "IhaveHemorrhoids@gmail.com"
  },
  {
    lastName: "Franco",
    firstName: "Philip",
    middleName: "De",
    department: "Human Resources",
    coordinator: "Cloud Strife",
    position: "Recruiter",
    totalSalary: 25000,
    basicSalary: 20000,
    contactNumber: "09191622346",
    employeeId: "82341568",
    email: "catsaresupercute@gmail.com"
  },
];

const EmployeeTableV1 = () => {
  return (
    {/*<Box
      minHeight="100vh"
      p={6}
      position="relative"
      fontFamily="'Inter', sans-serif"
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
    </Box>*/}
    
      
    
  );
};

const EmployeeTable = () => {
  return (
    <Box flex="1"
         minW="80vw"
         maxW="100vw"
         overflow={"auto"}
         >
      <Box minH="100vh" > { /* was experimenting for scroll, now i dont want to remove this wrapper*/ }
        <Table variant="unstyled"
               size="sm"
               style={{ border: "1px solid black", borderCollapse: "collapse" }}
               sx={{ "tbody tr:nth-of-type(odd)": { background: "#E6E2B1", },
                     "tbody tr:nth-of-type(even)": { background: "#FBFCE5", }, }}
                     >
          <Thead bg="#A4B465" position="sticky" top={0} zIndex={1}>
            <Tr>
              {["",
                "Last Name",
                "First Name",
                "Middle Name",
                "Department",
                "Coordinator",
                "Position",
                "Total Salary",
                "Basic Salary",
                "Contact Number",
                "Employee ID",
              ].map((header, i) => (
                <Th key={i}
                    style={{ border: "none",
                    padding: "4px",
                    borderBottom: "1px solid black"
                    }}
                    textAlign="center"
                    fontSize="9px"
                    >
                      {header}
                </Th>
              ))}
              <Th style={{ border: "none", padding: "4px", borderBottom: "1px solid black" }}
                  textAlign="center"
                  fontSize="9px"
                  >
                <Box style={{display: "flex", justifyContent: "space-around"}}>
                  Email
                  <Button bg="#FFCF50"
                          color="#626F47"
                          borderRadius="5px"
                          fontSize="9px"
                          h="15px"
                          p="7px"
                          _hover={{ bg: "#8B6A16", color: "#FFD566"}}
                          >
                    {/* Idk what hover color should look like */ }
                    Send Payslips to Email
                  </Button>
                </Box>
              </Th>
            </Tr>
          </Thead>
          <Tbody bg="#FEFAE0">
            {employeeData.map((emp, index) => (
              <Tr key={index} bg="rgba(255, 255, 255, 0.25)">
                <Td textAlign="center" fontSize="10px" p="0px 10px 0px 10px">{index + 1}</Td>
                  <Td textAlign="center" fontSize="10px" p="0px 10px 0px 10px">{emp.lastName}</Td>
                  <Td textAlign="center" fontSize="10px" p="0px 10px 0px 10px">{emp.firstName}</Td>
                  <Td textAlign="center" fontSize="10px" p="0px 10px 0px 10px">{emp.middleName}</Td>
                  <Td textAlign="center" fontSize="10px" p="0px 10px 0px 10px">{emp.department}</Td>
                  <Td textAlign="center" fontSize="10px" p="0px 10px 0px 10px">{emp.coordinator}</Td>
                  <Td textAlign="center" fontSize="10px" p="0px 10px 0px 10px">{emp.position}</Td>
                  <Td textAlign="center" fontSize="10px" p="0px 10px 0px 10px">{emp.totalSalary}</Td>
                  <Td textAlign="center" fontSize="10px" p="0px 10px 0px 10px">{emp.basicSalary}</Td>
                  <Td textAlign="center" fontSize="10px" p="0px 10px 0px 10px">{emp.contactNumber}</Td>
                  <Td textAlign="center" fontSize="10px" p="0px 10px 0px 10px">{emp.employeeId}</Td>
                  <Td textAlign="center" fontSize="10px" p="0px 10px 0px 10px">
                  <Box style={{display: "flex", justifyContent: "space-between"}}>
                    {emp.email}
                    <IconButton icon={<EditIcon />}
                                aria-label="Edit"
                                variant="ghost"
                                color="#626F47"
                                height="12px"
                                width="12px"
                                size="xs"
                              _hover={{ bg: "#626F47", color: "#FEFAE0" }}
                                p="0px 10px 0px 10px"/>
                  </Box>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default EmployeeTable;
