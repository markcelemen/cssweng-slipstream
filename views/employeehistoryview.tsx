
import { Box, Button, Table, Thead, Tbody, Tr, Th, Td, IconButton } from "@chakra-ui/react";
import { EditIcon, RepeatClockIcon } from "@chakra-ui/icons";

const EmployeeHistoryTab = () => {
  return (
    <Box minW="10vw"
         maxW="20vw"
         display="flex" 
         flexDirection="column"
		     minH="100vh"
         bg="#A4B465"
         border="1px solid black"
         overflow="auto"
         ml="2">
		  <Table variant="unstyled" size="sm">
				<Thead bg="#626F47" position="sticky" top={0} zIndex={1}>
					<Tr>
						<Th style={{
							  padding: "4px",
							  borderBottom: "1px solid black",
						    }}
						    color="white"
						    textAlign="center"
						    fontSize="10px"
						    >
						  HISTORY
						  <IconButton icon={<RepeatClockIcon />}
                          color="#FFC837"
                          variant="ghost"
                          h="12px"
                          w="12px"
                          size="sm"
                          _hover={{ bg: "#8B6A16", color: "#FFD566", height: "12px", width: "12px" }}
                          position="absolute"
                          top="6.5px"
                          aria-label="Revert History"
                          />
                {/* Idk what hover color should look like */ }
						</Th>
					</Tr>
				</Thead>
				  <Tbody bg="#FBFCE5">
					<Tr>
						<Td p="2px 10px 2px 10px"
						    fontSize="11px"
						    textAlign="center"
						    _hover={{bg: "#DBFB95"}}
						    cursor="pointer"
                > 
              user name - Mm/Dd/yyYY 00:00:00
            </Td>
					</Tr><Tr>
						<Td p="2px 10px 2px 10px"
						    fontSize="11px"
						    textAlign="center"
						    _hover={{bg: "#DBFB95"}}
						    cursor="pointer"
                > 
              user name - Mm/Dd/yyYY 00:00:00
            </Td>
					</Tr><Tr>
						<Td p="2px 10px 2px 10px"
						    fontSize="11px"
						    textAlign="center"
						    _hover={{bg: "#DBFB95"}}
						    cursor="pointer"
                > 
              user name - Mm/Dd/yyYY 00:00:00
            </Td>
					</Tr><Tr>
						<Td p="2px 10px 2px 10px"
						    fontSize="11px"
						    textAlign="center"
						    _hover={{bg: "#DBFB95"}}
						    cursor="pointer"
                > 
              user name - Mm/Dd/yyYY 00:00:00
            </Td>
					</Tr><Tr>
						<Td p="2px 10px 2px 10px"
						    fontSize="11px"
						    textAlign="center"
						    _hover={{bg: "#DBFB95"}}
						    cursor="pointer"
                > 
              user name - Mm/Dd/yyYY 00:00:00
            </Td>
					</Tr><Tr>
						<Td p="2px 10px 2px 10px"
						    fontSize="11px"
						    textAlign="center"
						    _hover={{bg: "#DBFB95"}}
						    cursor="pointer"
                > 
              user name - Mm/Dd/yyYY 00:00:00
            </Td>
					</Tr><Tr>
						<Td p="2px 10px 2px 10px"
						    fontSize="11px"
						    textAlign="center"
						    _hover={{bg: "#DBFB95"}}
						    cursor="pointer"
                > 
              user name - Mm/Dd/yyYY 00:00:00
            </Td>
					</Tr><Tr>
						<Td p="2px 10px 2px 10px"
						    fontSize="11px"
						    textAlign="center"
						    _hover={{bg: "#DBFB95"}}
						    cursor="pointer"
                > 
              user name - Mm/Dd/yyYY 00:00:00
            </Td>
					</Tr><Tr>
						<Td p="2px 10px 2px 10px"
						    fontSize="11px"
						    textAlign="center"
						    _hover={{bg: "#DBFB95"}}
						    cursor="pointer"
                > 
              user name - Mm/Dd/yyYY 00:00:00
            </Td>
					</Tr><Tr>
						<Td p="2px 10px 2px 10px"
						    fontSize="11px"
						    textAlign="center"
						    _hover={{bg: "#DBFB95"}}
						    cursor="pointer"
                > 
              user name - Mm/Dd/yyYY 00:00:00
            </Td>
					</Tr><Tr>
						<Td p="2px 10px 2px 10px"
						    fontSize="11px"
						    textAlign="center"
						    _hover={{bg: "#DBFB95"}}
						    cursor="pointer"
                > 
              user name - Mm/Dd/yyYY 00:00:00
            </Td>
					</Tr><Tr>
						<Td p="2px 10px 2px 10px"
						    fontSize="11px"
						    textAlign="center"
						    _hover={{bg: "#DBFB95"}}
						    cursor="pointer"
                > 
              user name - Mm/Dd/yyYY 00:00:00
            </Td>
					</Tr><Tr>
						<Td p="2px 10px 2px 10px"
						    fontSize="11px"
						    textAlign="center"
						    _hover={{bg: "#DBFB95"}}
						    cursor="pointer"
                > 
              user name - Mm/Dd/yyYY 00:00:00
            </Td>
					</Tr><Tr>
						<Td p="2px 10px 2px 10px"
						    fontSize="11px"
						    textAlign="center"
						    _hover={{bg: "#DBFB95"}}
						    cursor="pointer"
                > 
              user name - Mm/Dd/yyYY 00:00:00
            </Td>
					</Tr><Tr>
						<Td p="2px 10px 2px 10px"
						    fontSize="11px"
						    textAlign="center"
						    _hover={{bg: "#DBFB95"}}
						    cursor="pointer"
                > 
              user name - Mm/Dd/yyYY 00:00:00
            </Td>
					</Tr><Tr>
						<Td p="2px 10px 2px 10px"
						    fontSize="11px"
						    textAlign="center"
						    _hover={{bg: "#DBFB95"}}
						    cursor="pointer"
                > 
              user name - Mm/Dd/yyYY 00:00:00
            </Td>
					</Tr><Tr>
						<Td p="2px 10px 2px 10px"
						    fontSize="11px"
						    textAlign="center"
						    _hover={{bg: "#DBFB95"}}
						    cursor="pointer"
                > 
              user name - Mm/Dd/yyYY 00:00:00
            </Td>
					</Tr><Tr>
						<Td p="2px 10px 2px 10px"
						    fontSize="11px"
						    textAlign="center"
						    _hover={{bg: "#DBFB95"}}
						    cursor="pointer"
                > 
              user name - Mm/Dd/yyYY 00:00:00
            </Td>
					</Tr><Tr>
						<Td p="2px 10px 2px 10px"
						    fontSize="11px"
						    textAlign="center"
						    _hover={{bg: "#DBFB95"}}
						    cursor="pointer"
                > 
              user name - Mm/Dd/yyYY 00:00:00
            </Td>
					</Tr><Tr>
						<Td p="2px 10px 2px 10px"
						    fontSize="11px"
						    textAlign="center"
						    _hover={{bg: "#DBFB95"}}
						    cursor="pointer"
                > 
              user name - Mm/Dd/yyYY 00:00:00
            </Td>
					</Tr><Tr>
						<Td p="2px 10px 2px 10px"
						    fontSize="11px"
						    textAlign="center"
						    _hover={{bg: "#DBFB95"}}
						    cursor="pointer"
                > 
              user name - Mm/Dd/yyYY 00:00:00
            </Td>
					</Tr><Tr>
						<Td p="2px 10px 2px 10px"
						    fontSize="11px"
						    textAlign="center"
						    _hover={{bg: "#DBFB95"}}
						    cursor="pointer"
                > 
              user name - Mm/Dd/yyYY 00:00:00
            </Td>
					</Tr><Tr>
						<Td p="2px 10px 2px 10px"
						    fontSize="11px"
						    textAlign="center"
						    _hover={{bg: "#DBFB95"}}
						    cursor="pointer"
                > 
              user name - Mm/Dd/yyYY 00:00:00
            </Td>
					</Tr><Tr>
						<Td p="2px 10px 2px 10px"
						    fontSize="11px"
						    textAlign="center"
						    _hover={{bg: "#DBFB95"}}
						    cursor="pointer"
                > 
              user name - Mm/Dd/yyYY 00:00:00
            </Td>
					</Tr><Tr>
						<Td p="2px 10px 2px 10px"
						    fontSize="11px"
						    textAlign="center"
						    _hover={{bg: "#DBFB95"}}
						    cursor="pointer"
                > 
              user name - Mm/Dd/yyYY 00:00:00
            </Td>
					</Tr><Tr>
						<Td p="2px 10px 2px 10px"
						    fontSize="11px"
						    textAlign="center"
						    _hover={{bg: "#DBFB95"}}
						    cursor="pointer"
                > 
              user name - Mm/Dd/yyYY 00:00:00
            </Td>
					</Tr><Tr>
						<Td p="2px 10px 2px 10px"
						    fontSize="11px"
						    textAlign="center"
						    _hover={{bg: "#DBFB95"}}
						    cursor="pointer"
                > 
              user name - Mm/Dd/yyYY 00:00:00
            </Td>
					</Tr><Tr>
						<Td p="2px 10px 2px 10px"
						    fontSize="11px"
						    textAlign="center"
						    _hover={{bg: "#DBFB95"}}
						    cursor="pointer"
                > 
              user name - Mm/Dd/yyYY 00:00:00
            </Td>
					</Tr><Tr>
						<Td p="2px 10px 2px 10px"
						    fontSize="11px"
						    textAlign="center"
						    _hover={{bg: "#DBFB95"}}
						    cursor="pointer"
                > 
              user name - Mm/Dd/yyYY 00:00:00
            </Td>
					</Tr><Tr>
						<Td p="2px 10px 2px 10px"
						    fontSize="11px"
						    textAlign="center"
						    _hover={{bg: "#DBFB95"}}
						    cursor="pointer"
                > 
              user name - Mm/Dd/yyYY 00:00:00
            </Td>
					</Tr>
				</Tbody>
			</Table>
		</Box>
  );
}

export default EmployeeHistoryTab;

{/*
  
  box display="flex"
    box flex=1
      box position="absolute"
      box position="absolute"
    
    box
      box display="flex" space-between
        box 
        box
      box shadow outline
        table?
        table?
    
  
  
  */}