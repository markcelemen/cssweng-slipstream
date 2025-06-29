
import { Box, Table, Thead, Tbody, Tr, Th, Td, IconButton } from "@chakra-ui/react";
import { AddIcon, EditIcon } from "@chakra-ui/icons";

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
];

	
	


const EmployeeHistory = () => {
  return (
    <Box display="flex" minH="100vh">
	{/* Left panel */}
		{ /* 	EXPERIMENT WITH WIDTH AND MIN WIDTH */ }
      <Box flex="1" minW="80vw" maxW="90vw" overflow="auto" borderRight="1px solid black">
        <Box minH="100vh" pr="2"> { /* check where the bg is supposed to go */ }
          <Table
            variant="unstyled"
            size="sm"
            style={{ border: "1px solid black", borderCollapse: "collapse" }}
			
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
				  "Email",
				  "Placeholder"
				  ].map((header, i) => (
                  <Th
                    key={i}
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
                <Td textAlign="center" fontSize="10px" p="0px 10px 0px 10px">{emp.email}</Td>
                <Td textAlign="center">
                  <IconButton
                    icon={<EditIcon />}
                    aria-label="Edit"
                    variant="ghost"
                    bg="#FEFAE0"
                    color="#626F47"
                    height="15px"
                    width="15px"
                    _hover={{ bg: "#626F47", color: "#FEFAE0", height: "15px", width: "15px" }}
					p="0px 10px 0px 10px"
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
          </Table>
        </Box>
      </Box>
	  
	  
	  
	{/* Right Panel */}
      <Box
		minW="10vw"
        maxW="20vw"
        display={{ base: "none", md: "flex" }} 
        flexDirection="column"
		 minH="100vh" bg="#A4B465"
      >
		<Box>
			<Table variant="unstyled" size="sm" border="1px solid black">
				<Thead bg="#626F47" position="sticky" top={0} zIndex={1}>
					<Tr>
						<Th
						  style={{
							padding: "4px",
							borderBottom: "1px solid black",
						  }}
						  color="white"
						  textAlign="center"
						  fontSize="10px"
						>
						HISTORY
						{ /* HISTORY PLUS HISTORY SYMBOL */ }
						</Th>
					</Tr>
				</Thead>
				<Tbody bg="#FBFCE5">
					<Tr>
						<Td
						p="2px 10px 2px 10px"
						fontSize="11px"
						textAlign="center"
						_hover={{bg: "#DBFB95"}}
						cursor="pointer"> user name - Mm/Dd/yyYY 00:00:00</Td>
					</Tr><Tr>
						<Td
						p="2px 10px 2px 10px"
						fontSize="11px"
						textAlign="center"
						_hover={{bg: "#DBFB95"}}
						cursor="pointer"> user name - Mm/Dd/yyYY 00:00:00</Td>
					</Tr><Tr>
						<Td
						p="2px 10px 2px 10px"
						fontSize="11px"
						textAlign="center"
						_hover={{bg: "#DBFB95"}}
						cursor="pointer"> user name - Mm/Dd/yyYY 00:00:00</Td>
					</Tr><Tr>
						<Td
						p="2px 10px 2px 10px"
						fontSize="11px"
						textAlign="center"
						_hover={{bg: "#DBFB95"}}
						cursor="pointer"> user name - Mm/Dd/yyYY 00:00:00</Td>
					</Tr><Tr>
						<Td
						p="2px 10px 2px 10px"
						fontSize="11px"
						textAlign="center"
						_hover={{bg: "#DBFB95"}}
						cursor="pointer"> user name - Mm/Dd/yyYY 00:00:00</Td>
					</Tr>
				</Tbody>
			</Table>
		</Box>
	  </Box>
    </Box>
  );
}

export default EmployeeHistory;