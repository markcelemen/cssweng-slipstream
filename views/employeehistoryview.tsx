
import { Box, Button, Table, Thead, Tbody, Tr, Th, Td, IconButton } from "@chakra-ui/react";
import { EditIcon, RepeatClockIcon } from "@chakra-ui/icons";

const EmployeeHistoryTab = () => {
  return (
    <Box overflow="auto"
         sx={{ "&::-webkit-scrollbar": { width: "8px", height: "8px" },
               "&::-webkit-scrollbar-thumb": { backgroundColor: "#48630E",
                                               borderRadius: "8px",
                                               border: "0px solid black"
                                             },
               "&::-webkit-scrollbar-track": { background: "transparent" },
            }}
          pr="4px"
          pb="4px">
    <Box minW="10vw"
         maxW="20vw"
         display="flex" 
         flexDirection="column"
		     minH="99vh"
         bg="#A4B465"
         border="1px solid black"
         ml="2"
         >
          { /* 100vh enables the scrollbar for some reason, so 99 it is */ }
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