import React from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Text,
  Textarea,
  VStack,
  HStack
} from '@chakra-ui/react';

const EmployeeProfileView = () => {
  return (
    <Box bg="FAF6C7" minH="100vh" w="100vw" p="6">
      <Flex gap="6" w="100%" align="flex-start">
        <Box
          bg="#FFFCD9"
          borderRadius="md"
          boxShadow="md"
          p="5"
          w="25%"
          minW="280px"
        >
          <Box
            textAlign="center"
            fontWeight="bold"
            fontSize="lg"
            bg="#4A6100"
            color="#FFCF50"
            py="2"
            borderRadius="md"
            mb="4"
          >
            Personal Information
          </Box>

          <Text color="#638813" fontWeight="bold" mb="2">
            Employee Name <b style={{ float: 'right' }}>ID Placeholder</b>
          </Text>

          <VStack align="stretch" spacing="3">
            <HStack>
              <Input placeholder="Last Name" bg="#FFFCD9" border="1px solid #A4B465" />
              <Input placeholder="First Name" bg="#FFFCD9" border="1px solid #A4B465" />
            </HStack>
            <HStack>
              <Input placeholder="Middle Name" bg="#FFFCD9" border="1px solid #A4B465" w="70%" />
              <Text fontSize="sm" color="gray.600" w="30%">
                (optional)
              </Text>
            </HStack>

            <HStack>
              <Text minW="120px" fontWeight="semibold" color="#638813">Date of Birth</Text>
              <Input placeholder="MM/DD/YY" bg="#FFFCD9" border="1px solid #A4B465" w="60%" />
            </HStack>
            <HStack>
              <Text minW="120px" fontWeight="semibold" color="#638813">Email</Text>
              <Input placeholder="supercoolemail@gmail.com" bg="#FFFCD9" border="1px solid #A4B465" w="60%" />
            </HStack>
            <HStack>
              <Text minW="120px" fontWeight="semibold" color="#638813">Phone Number</Text>
              <Input placeholder="09XXXXXXXXX" bg="#FFFCD9" border="1px solid #A4B465" w="60%" />
            </HStack>
          </VStack>

          <Box mt="4">
            <Text color="#638813" fontWeight="bold" mb="1">
              Remarks:
            </Text>
            <Textarea bg="#FFFCD9" border="1px solid #A4B465" h="230px" />
          </Box>

          <HStack mt="6" justify="space-between">
            <Button size="sm" bg="#4A6100" color="#FFCF50" _hover={{ bg: '#3A4E00' }}>
              Prev Employee
            </Button>
            <Button size="sm" bg="#4A6100" color="#FFCF50" _hover={{ bg: '#3A4E00' }}>
              Next Employee
            </Button>
          </HStack>
        </Box>

        <Box
          bg="#FFFCD9"
          borderRadius="md"
          boxShadow="md"
          w="100%"
          flex="1"
          minH="710px"
          display="flex"
          flexDirection="column"
        >

          <HStack spacing="0">
            <Box
              w="50%"
              py="3"
              textAlign="center"
              fontWeight="bold"
              fontSize="xl"
              bg="#FFFCD9"
              color="#4A6100"
              borderTop="1px solid black"
              borderLeft="1px solid black"
              borderRight="1px solid black"
              borderBottom="1px solid black"
              borderTopLeftRadius="md"
            >
              Employment Details
            </Box>
            <Box
              w="50%"
              py="3"
              textAlign="center"
              fontWeight="bold"
              fontSize="xl"
              bg="#4A6100"
              color="#FFCF50"
              _hover={{ bg: '#3A4E00', cursor: 'pointer' }}
              onClick={() => {}}
              borderTopRightRadius="md"
            >
              Attendance Details
            </Box>
          </HStack>

          <Box p="6" position="relative" flex="1" display="flex" flexDirection="column">
            <Text
              position="absolute"
              top="1.5rem"
              right="1.5rem"
              color="#7E8854"
              fontSize="md"
              fontWeight="semibold"
            >
              You have made changes to some fields
            </Text>

            <VStack align="stretch" spacing="4" mt="8">
              <HStack>
                <Text minW="150px" fontWeight="semibold" color="#638813">
                  Basic Salary
                </Text>
                <Input w="30%" placeholder="₱100,000,000" bg="white" />
              </HStack>
              <HStack>
                <Text minW="150px" fontWeight="semibold" color="#638813">
                  Total Salary
                </Text>
                <Input w="30%" placeholder="₱100,000,000" bg="white" />
              </HStack>
              <HStack>
                <Text minW="150px" fontWeight="semibold" color="#638813">
                  Department
                </Text>
                <Input w="30%" placeholder="Department" bg="white" />
              </HStack>
              <HStack>
                <Text minW="150px" fontWeight="semibold" color="#638813">
                  Number of PTO’s
                </Text>
                <Input w="30%" placeholder="Number (increments of .5)" bg="white" />
              </HStack>
            </VStack>

            <HStack justify="flex-end" mt="auto">
              <Button bg="#4A6100" color="white" _hover={{ bg: '#3A4E00' }}>
                Save
              </Button>
              <Button
                bg="white"
                color="#4A6100"
                border="1px solid #4A6100"
                _hover={{ bg: '#F6F4CF' }}
              >
                Cancel
              </Button>
            </HStack>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default EmployeeProfileView;
