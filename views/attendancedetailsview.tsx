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
import router from 'next/router';

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


const AttendanceDetailsView: React.FC<{ id: string }> = ({ id }) => {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [originalEmployee, setOriginalEmployee] = useState<Employee | null>(null);
  const hasChanges = useMemo(() => {
    return JSON.stringify(employee) !== JSON.stringify(originalEmployee);
  }, [employee, originalEmployee]);
  const toast = useToast();
  const [prevID, setPrevID] = useState<number | null>(null);
  const [nextID, setNextID] = useState<number | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; date: string } | null>(null);
  const [ptoContextMenu, setPtoContextMenu] = useState<{ x: number; y: number; date: string } | null>(null);
  const [attendanceData, setAttendanceData] = useState<{ date: string; inTime: string; outTime: string }[]>([]);


    const ptoData = [
    { date: "Wednesday, 16 April 2025", credited: 0.5 },
    { date: "Friday, 18 April 2025", credited: 0.5 },
    { date: "Tuesday, 22 April 2025", credited: 1.0 },
    { date: "Thursday, 24 April 2025", credited: 0.25 },
    { date: "Friday, 25 April 2025", credited: 1.0 },
    { date: "Friday, 25 April 2025", credited: 1.0 },
    { date: "Friday, 25 April 2025", credited: 1.0 },
    { date: "Friday, 25 April 2025", credited: 1.0 },
    { date: "Friday, 25 April 2025", credited: 1.0 },
    { date: "Friday, 25 April 2025", credited: 1.0 },
    ];


  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const menu1 = document.getElementById("attendance-context-menu");
      const menu2 = document.getElementById("pto-context-menu");

      const clickedInsideMenu1 = menu1 && menu1.contains(e.target as Node);
      const clickedInsideMenu2 = menu2 && menu2.contains(e.target as Node);

      // Only close menus if it's a left-click and click was outside both menus
      if (e.button === 0 && !clickedInsideMenu1 && !clickedInsideMenu2) {
        setContextMenu(null);
        setPtoContextMenu(null);
      }
    };

    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [contextMenu, ptoContextMenu]);

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

  fetch(`/api/attendance/employee/${id}`)
    .then((res) => res.json())
    .then((logs) => {

      const grouped = new Map<string, { inTime?: string; outTime?: string }>();

      logs.forEach((entry: any) => {
        const dt = new Date(entry.datetime);
        const type = (entry.type || "").toLowerCase().trim();
        const dateStr = dt.toLocaleDateString("en-PH", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
          timeZone: "Asia/Manila",
        });

        const timeStr = dt.toLocaleTimeString("en-PH", {
          hour: "numeric",
          minute: "2-digit",
          timeZone: "Asia/Manila",
        });
        
        if (!grouped.has(dateStr)) grouped.set(dateStr, {});
        const record = grouped.get(dateStr)!;
        if ((type === "check in" || type === "incomplete") && !record.inTime) {
          record.inTime = timeStr;
        }

        if (type === "check out") {
          record.outTime = timeStr;
        }

        if (type === "incomplete" && !record.outTime) {
          record.outTime = "Incomplete";
        }
      });

      const formatted = Array.from(grouped.entries()).map(([date, times]) => ({
        date,
        inTime: times.inTime || "-",
        outTime: times.outTime || "-",
      }));

      setAttendanceData(formatted);
    })
    .catch(err => {
      console.error("Failed to fetch attendance for employee:", err);
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
                  placeholder="Last Name"
                  value={employee?.lastName || ''}
                  onChange={(e) => setEmployee(emp => emp ? { ...emp, lastName: e.target.value } : emp)}
                  bg="#FFFCD9"
                  border="1px solid #A4B465"
                />
              <Input
                placeholder="First Name"
                value={employee?.firstName || ''}
                onChange={(e) => setEmployee(emp => emp ? { ...emp, firstName: e.target.value } : emp)}
                bg="#FFFCD9"
                border="1px solid #A4B465"
              />
            </HStack>
            <HStack>
              <Input
                placeholder="Middle Name"
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
                placeholder="MM/DD/YYYY"
                bg="#FFFCD9"
                border="1px solid #A4B465"
                w="60%"
              />
            </HStack>
            <HStack>
              <Text minW="120px" fontWeight="semibold" color="#638813">Email</Text>
              <Input
                placeholder="sample@gmail.com"
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
                placeholder="Phone Number"
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
              placeholder="Sample Remarks..."
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
                bg="#4A6100"
                color="#FFCF50"
                _hover={{ bg: '#3A4E00', cursor: 'pointer' }}
                onClick={() => {
                    if (id) {
                    router.push(`/employeeprofile/${id}`);
                    }
                }}
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
                bg="#FFFCD9"
                color="#4A6100"
                borderTop="1px solid black"
                borderLeft="1px solid black"
                borderRight="1px solid black"
                borderBottom="1px solid black"
                borderTopRightRadius="md"
                >
                Attendance Details
            </Box>
          </HStack>

          {/* Table Header */}
            <HStack
            w="100%"
            px="4"
            py="2"
            spacing="0"
            borderBottom="1px solid #000000"
            bg="#FFFCD9"
            fontWeight="bold"
            color="#4A6100"
            align="start"
            >
            <Box flex="4" display="flex">
                <Box flex="2" px="2">Date</Box>
                <Box flex="1" px="2">In Time</Box>
                <Box flex="1" px="2">Out Time</Box>
            </Box>
            <Box flex="3" display="flex" borderLeft="2px solid #4A6100">
                <Box flex="2" px="2">PTO Date</Box>
                <Box flex="1" px="2">Credited</Box>
            </Box>
            </HStack>

            {/* Scrollable Panels */}
            <Flex flex="1" maxH="540px" overflow="hidden">
            {/* Left scrollable section */}
            <Box flex="4" overflowY="auto">
                {attendanceData.map((record, index) => (
                  <HStack
                    key={index}
                    px="4"
                    py="2"
                    bg={index % 2 === 0 ? "#FFFCD9" : "#FAF6C7"}
                    borderBottom="1px solid #E0E0B0"
                    fontSize="sm"
                    spacing="0"
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setPtoContextMenu(null);
                      setContextMenu({ x: e.clientX, y: e.clientY, date: record.date });
                    }}
                    _hover={{ bg: "#FFD566", cursor: "pointer" }}
                  >
                    <Box flex="2" px="2">{record.date}</Box>
                    <Box flex="1" px="2">{record.inTime}</Box>
                    <Box flex="1" px="2">{record.outTime}</Box>
                  </HStack>
                ))}
            </Box>

            {/* Right scrollable section */}
            <Box flex="3" overflowY="auto" borderLeft="2px solid #4A6100">
                {ptoData.map((pto, index) => (
                  <HStack
                    key={index}
                    px="4"
                    py="2"
                    bg={index % 2 === 0 ? "#FFFCD9" : "#FAF6C7"}
                    borderBottom="1px solid #E0E0B0"
                    fontSize="sm"
                    spacing="0"
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setContextMenu(null);
                      setPtoContextMenu({ x: e.clientX, y: e.clientY, date: pto.date });
                    }}
                    _hover={{ bg: "#FFD566", cursor: "pointer" }}
                  >
                    <Box flex="2" px="2">{pto.date}</Box>
                    <Box flex="1" px="2">{pto.credited}</Box>
                  </HStack>
                ))}
            </Box>
            </Flex>

            {/* Footer */}
            <HStack
                mt="auto"
                px="6"
                py="4"
                justify="space-between"
                align="center"
                bg="#FFFCD9"
                borderTop="1px solid #A4B465"
                >

            <HStack spacing="6">
                <Text color="#638813" fontWeight="semibold">
                Total Deductions
                </Text>
                <Text fontWeight="semibold">0.00 PHP</Text>
                <Text color="#638813" fontWeight="semibold">
                PTO’s Remaining:
                </Text>
                <Text fontWeight="bold" color="#4A6100">
                5
                </Text>
            </HStack>

            <HStack spacing="4">
                <Button
                bg="#4A6100"
                color="white"
                _hover={{ bg: "#3A4E00" }}
                >
                Save
                </Button>
                <Button
                bg="white"
                color="#4A6100"
                border="1px solid #4A6100"
                _hover={{ bg: "#F6F4CF" }}
                >
                Cancel
                </Button>
            </HStack>
            </HStack>

        </Box>
        {contextMenu && (
          <Box
            id="attendance-context-menu"
            position="fixed"
            top={contextMenu.y}
            left={contextMenu.x}
            zIndex={9999}
            bg="#FFD566"
            borderRadius="md"
            boxShadow="md"
            p={2}
            minW="180px"
          >
            <VStack spacing={2}>
              <Button
                size="sm"
                w="100%"
                onClick={() => {
                  alert(`Add PTO on ${contextMenu.date}`);
                  setContextMenu(null);
                }}
              >
                Add PTO on this date
              </Button>
            </VStack>
          </Box>
        )}
        {ptoContextMenu && (
          <Box
            id="pto-context-menu"
            position="fixed"
            top={ptoContextMenu.y}
            left={ptoContextMenu.x}
            zIndex={9999}
            bg="#FFD566"
            borderRadius="md"
            boxShadow="md"
            p={2}
            minW="180px"
          >
            <VStack spacing={2}>
              <Button
                size="sm"
                w="100%"
                colorScheme="red"
                onClick={() => {
                  alert(`Remove PTO on ${ptoContextMenu.date}`);
                  setPtoContextMenu(null);
                }}
              >
                Remove PTO on this date
              </Button>
            </VStack>
          </Box>
        )}
      </Flex>
    </Box>
  );
};

export default AttendanceDetailsView;