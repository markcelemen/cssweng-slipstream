
import { Box, Table, Thead, Tbody, Tr, Th, Td, IconButton } from "@chakra-ui/react";
import { AddIcon, EditIcon } from "@chakra-ui/icons";

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
		remark: "cool guy",
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
		remark: "cool guy",
	},
	{
		name: "juanita dela czutia",
		id: "121111111",
		position: "teacher",
		totalSalary: "20,000",
		basicSalary: "20,000",
		department: "teaching",
		coordinator: "guy",
		term: "4",
		remark: "cool guy",
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
		remark: "cool guy",
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
                {["Name",
				  "Employee ID",
				  "Position",
				  "Total Salary",
				  "Basic Salary",
				  "Department",
				  "Coordinator",
				  "Term",
				  "Remarks",
				  ""
				  ].map((header, i) => (
                  <Th
                    key={i}
                    style={{ border: "none",
							 padding: "4px",
							 borderBottom: "1px solid black"
					}}
					textAlign="center"
                  >
                    {header}
                  </Th>
                ))}
              </Tr>
            </Thead>
			<Tbody bg="#FEFAE0">
            {employeeData.map((emp, index) => (
              <Tr key={index} bg="rgba(255, 255, 255, 0.25)">
                <Td textAlign="center">{emp.name}</Td>
                <Td textAlign="center">{emp.id}</Td>
                <Td textAlign="center">{emp.position}</Td>
                <Td textAlign="center">{emp.totalSalary}</Td>
                <Td textAlign="center">{emp.basicSalary}</Td>
                <Td textAlign="center">{emp.department}</Td>
                <Td textAlign="center">{emp.coordinator}</Td>
                <Td textAlign="center">{emp.term}</Td>
                <Td textAlign="center">{emp.remark}</Td>
                <Td textAlign="center">
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
						>
						HISTORY
						{ /* HISTORY PLUS HISTORY SYMBOL */ }
						</Th>
					</Tr>
				</Thead>
				<Tbody bg="#FBFCE5">
					<Tr>
						<Td> user name - Mm/Dd/yyYY </Td>
					</Tr><Tr>
						<Td> user name - Mm/Dd/yyYY </Td>
					</Tr><Tr>
						<Td> user name - Mm/Dd/yyYY </Td>
					</Tr>
				</Tbody>
			</Table>
		</Box>
	  </Box>
    </Box>
  );
}

export default EmployeeHistory;