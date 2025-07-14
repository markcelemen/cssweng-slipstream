import React, { useState } from "react";
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
  const [emailAll, setEmailAll] = useState("No");

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
              {[...Array(10)].map((_, i) => (
                <Box
                  key={i}
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
                      [Employee Name]
                    </Box>
                  </Text>
                  <Text fontSize="sm">
                    <Box as="span" color="#48630E" fontWeight="bold">
                      ID:
                    </Box>{" "}
                    <Box as="span" color="#000000">
                      [ID]
                    </Box>
                  </Text>
                </Box>
              ))}
            </VStack>
          </Box>
        </Box>
          <Flex justify="flex-end" mt="2">
            <Button
              size="md"
              bg="#EEE9AA"
              color="#626F47"
              fontSize="xs"
              fontWeight="bold"
              height="50px"
              width="100px"
              _hover={{ bg: "#626F47", color: "#FEFAE0" }}
            >
              + Add Employee
            </Button>
          </Flex>
      </Box>

      {/* Right: Payslip View Box */}
      <Box
        flex="3"
        bg="#FFFCD9"
        borderRadius="md"
        p="5"
        boxShadow="md"
        minW="500px"
      >
        <Text fontWeight="bold" mb="3" color="#48630E">
          Payslip View
        </Text>

        {/* Action Buttons */}
        <Flex justifyContent="flex-end" alignItems="center" mb="4" gap={3}>
          <Button size="sm" 
            leftIcon={<FaSave />} 
            bg="#EEE9AA"
            color="#48630E"
            fontWeight="bold"
            _hover={{ bg: "#626F47", color: "#FEFAE0" }}
            >
            Save Payslip
          </Button>
          <Button
            size="sm"
            leftIcon={<FaPaperPlane />}
            bg="#EEE9AA"
            color="#48630E"
            fontWeight="bold"
            _hover={{ bg: "#626F47", color: "#FEFAE0" }}
          >
            Send
          </Button>
          <Button
            size="sm"
            bg="#EEE9AA"
            color="#48630E"
            fontWeight="bold"
            _hover={{ bg: "#626F47", color: "#FEFAE0" }}
          >
            Email All
          </Button>
        </Flex>

        {/* PDF Placeholder */}
        <Box
          border="1px solid #AAA"
          borderRadius="md"
          bg="white"
          h="70vh"
          w="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          color="gray.400"
        >
          <Text fontSize="sm">[ PDF Preview Area ]</Text>
        </Box>
      </Box>
    </Flex>
  );
};

export default EmployeeEmailer;
