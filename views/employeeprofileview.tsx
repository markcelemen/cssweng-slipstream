import React, { useMemo } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Text,
  Textarea,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

interface Employee {
  employeeID: number;
  lastName: string;
  firstName: string;
  middleName: string;
  department: string;
  coordinator: string;
  position: string;
  contactInfo: string;
  email: string;
  totalSalary: number;
  basicSalary: number;
  birthdate?: string;
  numberOfPTOs?: number;
  remarks?: string;
}


const EmployeeProfileView: React.FC<{ id: string }> = ({ id }) => {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [originalEmployee, setOriginalEmployee] = useState<Employee | null>(null);
  const hasChanges = useMemo(() => {
    return JSON.stringify(employee) !== JSON.stringify(originalEmployee);
  }, [employee, originalEmployee]);
  const toast = useToast();
  const [prevID, setPrevID] = useState<number | null>(null);
  const [nextID, setNextID] = useState<number | null>(null);

  

  useEffect(() => {
  fetch(`/api/employees/${id}`)
    .then((res) => res.json())
    .then((data) => {
      setEmployee(data);
      setOriginalEmployee(data);
    });

  fetch('/api/employees/ids')
    .then((res) => res.json())
    .then((ids: number[]) => {
      const currentID = Number(id);
      const sorted = ids.sort((a, b) => a - b);

      const prev = sorted.filter(eid => eid < currentID).pop() || null;
      const next = sorted.find(eid => eid > currentID) || null;

      setPrevID(prev);
      setNextID(next);
    });
}, [id]);



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
            Employee Name <b style={{ float: 'right' }}>{id}</b>
          </Text>

          <VStack align="stretch" spacing="3">
            <HStack>
              <Input
                  value={employee?.lastName || ''}
                  onChange={(e) => setEmployee(emp => emp ? { ...emp, lastName: e.target.value } : emp)}
                  bg="#FFFCD9"
                  border="1px solid #A4B465"
                />
              <Input
                value={employee?.firstName || ''}
                onChange={(e) => setEmployee(emp => emp ? { ...emp, firstName: e.target.value } : emp)}
                bg="#FFFCD9"
                border="1px solid #A4B465"
              />
            </HStack>
            <HStack>
              <Input
                value={employee?.middleName || ''}
                onChange={(e) => setEmployee(emp => emp ? { ...emp, middleName: e.target.value } : emp)}
                bg="#FFFCD9"
                w="70%"
                border="1px solid #A4B465"
              />
              <Text fontSize="sm" color="gray.600" w="30%">
                (optional)
              </Text>
            </HStack>

            <HStack>
              <Text minW="120px" fontWeight="semibold" color="#638813">Date of Birth</Text>
              <Input
                value={employee?.birthdate || ''}
                onChange={(e) => setEmployee(emp => emp ? { ...emp, birthdate: e.target.value } : emp)}
                placeholder="MM/DD/YY"
                bg="#FFFCD9"
                border="1px solid #A4B465"
                w="60%"
              />
            </HStack>
            <HStack>
              <Text minW="120px" fontWeight="semibold" color="#638813">Email</Text>
              <Input
                value={employee?.email || ''}
                onChange={(e) => setEmployee(emp => emp ? { ...emp, email: e.target.value } : emp)}
                bg="#FFFCD9"
                border="1px solid #A4B465"
                w="60%"
              />
            </HStack>
            <HStack>
              <Text minW="120px" fontWeight="semibold" color="#638813">Phone Number</Text>
              <Input
                value={employee?.contactInfo || ''}
                onChange={(e) => setEmployee(emp => emp ? { ...emp, contactInfo: e.target.value } : emp)}
                bg="#FFFCD9"
                border="1px solid #A4B465"
                w="60%"
              />
            </HStack>
          </VStack>

          <Box mt="4">
            <Text color="#638813" fontWeight="bold" mb="1">
              Remarks:
            </Text>
            <Textarea
              value={employee?.remarks || ''}
              onChange={(e) =>
                setEmployee(emp => emp ? { ...emp, remarks: e.target.value } : emp)
              }
              bg="#FFFCD9"
              border="1px solid #A4B465"
              h="230px"
            />
          </Box>

          <HStack mt="6" justify="space-between" w="100%">
            <Button
              size="sm"
              bg="#4A6100"
              color="#FFCF50"
              _hover={{ bg: '#3A4E00' }}
              onClick={() => window.location.href = `/employeeprofile/${prevID}`}
              visibility={prevID ? 'visible' : 'hidden'}
            >
              Prev Employee
            </Button>

            <Button
              size="sm"
              bg="#4A6100"
              color="#FFCF50"
              _hover={{ bg: '#3A4E00' }}
              onClick={() => window.location.href = `/employeeprofile/${nextID}`}
              visibility={nextID ? 'visible' : 'hidden'}
            >
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
            {hasChanges && (
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
            )}

            <VStack align="stretch" spacing="4" mt="8">
              <HStack>
                <Text minW="150px" fontWeight="semibold" color="#638813">
                  Basic Salary
                </Text>
                <Input
                  value={employee?.basicSalary || ''}
                  onChange={(e) => setEmployee(emp => emp ? { ...emp, basicSalary: Number(e.target.value) } : emp)}
                  bg="#FFFCD9"
                  border="1px solid #A4B465"
                  w="30%"
                />
              </HStack>
              <HStack>
                <Text minW="150px" fontWeight="semibold" color="#638813">
                  Total Salary
                </Text>
                <Input
                  value={employee?.totalSalary || ''}
                  onChange={(e) => setEmployee(emp => emp ? { ...emp, totalSalary: Number(e.target.value) } : emp)}
                  bg="#FFFCD9"
                  border="1px solid #A4B465"
                  w="30%"
                />
              </HStack>
              <HStack>
                <Text minW="150px" fontWeight="semibold" color="#638813">
                  Department
                </Text>
                <Input
                  value={employee?.department || ''}
                  onChange={(e) => setEmployee(emp => emp ? { ...emp, department: e.target.value } : emp)}
                  bg="#FFFCD9"
                  border="1px solid #A4B465"
                  w="30%"
                />
              </HStack>
              <HStack>
                <Text minW="150px" fontWeight="semibold" color="#638813">
                  Number of PTO’s
                </Text>
                <Input
                  value={employee?.numberOfPTOs ?? 0}
                  onChange={(e) =>
                    setEmployee(emp => emp ? { ...emp, numberOfPTOs: Number(e.target.value) } : emp)
                  }
                  bg="#FFFCD9"
                  border="1px solid #A4B465"
                  w="30%"
                />
              </HStack>
            </VStack>

            <HStack justify="flex-end" mt="auto">
              <Button
                bg="#4A6100"
                color="white"
                _hover={{ bg: '#3A4E00' }}
                onClick={() => {
                  if (!employee) return;
                  
                  fetch('/api/employees/update', {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      employeeIDs: [employee.employeeID],
                      updates: employee,
                    }),
                  })
                    .then(res => res.json())
                    .then(data => {
                      if (data.success) {
                        toast({
                        title: 'Saved!',
                        description: 'Employee profile updated successfully.',
                        status: 'success',
                        duration: 3000,
                        isClosable: true,
                        position: 'top',
                      });
                      setOriginalEmployee({ ...employee });
                      } else {
                        toast({
                        title: 'Error!',
                        description: 'Employee profile has not been updated successfully.',
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                        position: 'top',
                      });
                      }
                    })
                    .catch(err => {
                      console.error('Network error:', err);
                    });
                }}
              >
                Save
              </Button>
              <Button
                bg="white"
                color="#4A6100"
                border="1px solid #4A6100"
                _hover={{ bg: '#F6F4CF' }}
                onClick={() => {
                  if (originalEmployee) {
                    setEmployee({ ...originalEmployee });
                    toast({
                        title: 'Cancelled changes',
                        description: 'Employee fields has been reset.',
                        status: 'success',
                        duration: 3000,
                        isClosable: true,
                        position: 'top',
                      });
                  }
                }}
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
