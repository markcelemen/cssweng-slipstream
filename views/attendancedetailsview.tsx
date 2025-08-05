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
  type AttendanceEntry = { date: string; inTime: string; outTime: string; note: string };
  const [attendanceData, setAttendanceData] = useState<AttendanceEntry[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth()); // 0-indexed
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [isPtoModalOpen, setIsPtoModalOpen] = useState(false);
  const [ptoTargetDate, setPtoTargetDate] = useState<string>("");
  const [ptoData, setPtoData] = useState<{ date: string; credited: number }[]>([]);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportStartDate, setExportStartDate] = useState("");
  const [exportEndDate, setExportEndDate] = useState("");


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
    const now = new Date();
    const start = new Date(now);
    const end = new Date(now);

    start.setMonth(start.getMonth() - 1, start.getDate() - 15);
    end.setMonth(end.getMonth() + 1, end.getDate() + 15);

  const grouped = new Map<string, { inTime?: string; outTime?: string; notes?: string[] }>();

  logs.forEach((entry: any) => {
    const dt = new Date(entry.datetime);
    const type = (entry.type || "").toLowerCase().trim();

    const monthMatches = dt.getMonth() === selectedMonth;
    const yearMatches = dt.getFullYear() === selectedYear;
    if (!monthMatches || !yearMatches) return;

    const dateKey = dt.toLocaleDateString("en-PH", {
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

    if (!grouped.has(dateKey)) grouped.set(dateKey, { notes: [] });
      const record = grouped.get(dateKey)!;
      if (entry.note) {
        record.notes = [...(record.notes || []), entry.note];
    }

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

  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const completeMonthData: AttendanceEntry[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(selectedYear, selectedMonth, day);
    const formattedDate = date.toLocaleDateString("en-PH", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Manila",
    });

    const record = grouped.get(formattedDate);
    const hasFullPTO = ptoData.some((pto) => pto.date === formattedDate && pto.credited === 1);

    completeMonthData.push({
      date: formattedDate,
      inTime: hasFullPTO ? "PTO" : record?.inTime || "-",
      outTime: hasFullPTO ? "PTO" : record?.outTime || "-",
      note: record?.notes?.join(" | ") || "-"
    });
  }

  setAttendanceData(completeMonthData);
    })
    .catch((err) => {
      console.error("Failed to fetch attendance for employee:", err);
    });
}, [id, selectedMonth, selectedYear, ptoData]);

useEffect(() => {
  if (!id) return;

  fetch(`/api/ptoentries/${id}`)
    .then((res) => res.json())
    .then((entries: { date: string; credit: number }[]) => {
      const filtered = entries
        .map((entry: { date: string; credit: number }) => {
          const dt = new Date(entry.date);
          if (dt.getMonth() !== selectedMonth || dt.getFullYear() !== selectedYear) return null;

          const formattedDate = dt.toLocaleDateString("en-PH", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
            timeZone: "Asia/Manila",
          });

          return {
            date: formattedDate,
            credited: entry.credit,
          };
        })
        .filter((entry): entry is { date: string; credited: number } => entry !== null);

      setPtoData(filtered);
    })
    .catch((err) => {
      console.error("Failed to fetch PTO data:", err);
    });
}, [id, selectedMonth, selectedYear]);

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
            <Box flex="5" display="flex">
              <Box flex="2" px="2">Date</Box>
              <Box flex="1" px="2">In Time</Box>
              <Box flex="1" px="2">Out Time</Box>
              <Box flex="1" px="2">Notes</Box>
            </Box>
            <Box flex="3" display="flex" borderLeft="2px solid #4A6100">
                <Box flex="2" px="2">PTO Date</Box>
                <Box flex="1" px="2">Credited</Box>
            </Box>
            </HStack>

            <HStack spacing="4" px="4" py="2">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              >
                {Array.from({ length: 12 }).map((_, i) => (
                  <option key={i} value={i}>
                    {new Date(0, i).toLocaleString("default", { month: "long" })}
                  </option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              >
                {Array.from({ length: 10 }).map((_, i) => {
                  const year = new Date().getFullYear() - 5 + i;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </HStack>


            {/* Scrollable Panels */}
            <Flex flex="1" maxH="540px" overflow="hidden">
            {/* Left scrollable section */}
            <Box flex="5" overflowY="auto">
                {attendanceData.map((record, index) => {
                  const isWeekend = ["Saturday", "Sunday"].some(day => record.date.startsWith(day));
                  const bgColor = isWeekend ? "#EEEEEE" : index % 2 === 0 ? "#FFFCD9" : "#FAF6C7";
                  const textColor = isWeekend ? "#000000" : "inherit";

                  return (
                    <HStack
                      key={index}
                      px="4"
                      py="2"
                      bg={bgColor}
                      borderBottom="1px solid #E0E0B0"
                      fontSize="sm"
                      spacing="0"
                      onContextMenu={(e) => {
                        e.preventDefault();
                        setPtoContextMenu(null);
                        setContextMenu({ x: e.clientX, y: e.clientY, date: record.date });
                      }}
                      _hover={{ bg: isWeekend ? "#D4D4D4" : "#FFD566", cursor: "pointer" }}
                    >
                      <Box flex="2" px="2">{record.date}</Box>
                      <Box flex="1" px="2">{record.inTime}</Box>
                      <Box flex="1" px="2">{record.outTime}</Box>
                      <Box flex="1" px="2">{record.note}</Box>
                    </HStack>
                  );
                })}
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
                <Button
                  bg="#4A6100"
                  color="#FFCF50"
                  _hover={{ bg: "#3A4E00" }}
                  onClick={() => setIsExportModalOpen(true)}
                >
                  Export as CSV
                </Button>
                <Text color="#638813" fontWeight="semibold">
                PTO’s Remaining:
                </Text>
                <Text fontWeight="bold" color="#4A6100">
                  {employee?.numberOfPTOs ?? 0}
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
                  setPtoTargetDate(contextMenu.date);
                  setIsPtoModalOpen(true);
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
                onClick={async () => {
                  const res = await fetch("/api/ptoentries/delete", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      employeeID: Number(id),
                      date: new Date(ptoContextMenu.date),
                    }),
                  });

                  if (res.ok) {
                    const result = await res.json();

                    // Remove from local PTO panel
                    setPtoData((prev) => prev.filter(p => p.date !== ptoContextMenu.date));

                    // Restore PTO in frontend state
                    setEmployee((prev) =>
                      prev ? { ...prev, numberOfPTOs: (prev.numberOfPTOs ?? 0) + result.credit } : prev
                    );

                    toast({
                      title: "PTO Removed",
                      description: `Credit restored: ${result.credit}`,
                      status: "info",
                      duration: 2000,
                      isClosable: true,
                    });
                  } else {
                    toast({
                      title: "Failed",
                      description: "Could not remove PTO.",
                      status: "error",
                      duration: 2000,
                      isClosable: true,
                    });
                  }

                  setPtoContextMenu(null);
                }}
              >
                Remove PTO on this date
              </Button>
            </VStack>
          </Box>
        )}
        {isPtoModalOpen && (
          <Box
            position="fixed"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            zIndex={9999}
            bg="#FFFCD9"
            border="2px solid #A4B465"
            borderRadius="md"
            p={6}
            boxShadow="lg"
          >
            <VStack spacing={4}>
              <Text fontWeight="bold" color="#4A6100">
                Add PTO on {ptoTargetDate}
              </Text>
              <HStack spacing={4}>
                {[0.5, 1].map((value) => (
                  <Button
                    key={value}
                    bg="#4A6100"
                    color="#FFCF50"
                    _hover={{ bg: "#3A4E00" }}
                    onClick={async () => {
                    const creditAmount = value;

                    // Prevent if not enough PTOs
                    if ((employee?.numberOfPTOs ?? 0) < creditAmount) {
                      toast({
                        title: "Insufficient PTO",
                        description: `You only have ${employee?.numberOfPTOs ?? 0} PTOs remaining.`,
                        status: "error",
                        duration: 2500,
                        isClosable: true,
                      });
                      return;
                    }

                    const res = await fetch("/api/ptoentries/add", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        employeeID: Number(id),
                        date: new Date(ptoTargetDate),
                        credit: creditAmount,
                      }),
                    });

                    if (res.ok) {
                      const newPto = { date: ptoTargetDate, credited: creditAmount };
                      setPtoData((prev) => [...prev, newPto]);

                      // Decrease PTO count in frontend
                      setEmployee((prev) =>
                        prev ? { ...prev, numberOfPTOs: (prev.numberOfPTOs ?? 0) - creditAmount } : prev
                      );

                      toast({
                        title: "PTO Added",
                        description: `${creditAmount} credited on ${ptoTargetDate}`,
                        status: "success",
                        duration: 2000,
                        isClosable: true,
                      });
                    } else {
                      toast({
                        title: "Failed",
                        description: "Could not add PTO.",
                        status: "error",
                        duration: 2000,
                        isClosable: true,
                      });
                    }

                    setIsPtoModalOpen(false);
                  }}
                  >
                    +{value}
                  </Button>
                ))}
              </HStack>
              <Button
                variant="outline"
                color="#4A6100"
                border="1px solid #4A6100"
                _hover={{ bg: "#F6F4CF" }}
                onClick={() => setIsPtoModalOpen(false)}
              >
                Cancel
              </Button>
            </VStack>
          </Box>
        )}
        {isExportModalOpen && (
        <Box
          position="fixed"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          zIndex={9999}
          bg="#FFFCD9"
          border="2px solid #A4B465"
          borderRadius="md"
          p={6}
          boxShadow="lg"
        >
          <VStack spacing={4}>
            <Text fontWeight="bold" color="#4A6100">Select Date Range to Export</Text>
            <Input
              type="date"
              value={exportStartDate}
              onChange={(e) => setExportStartDate(e.target.value)}
              bg="#FFFCD9"
              border="1px solid #A4B465"
            />
            <Input
              type="date"
              value={exportEndDate}
              onChange={(e) => setExportEndDate(e.target.value)}
              bg="#FFFCD9"
              border="1px solid #A4B465"
            />
            <HStack>
              <Button
                colorScheme="green"
                onClick={() => {
                  if (!exportStartDate || !exportEndDate) return toast({
                    title: "Missing dates",
                    description: "Please select both start and end dates.",
                    status: "warning",
                    duration: 2000,
                    isClosable: true
                  });

                  const start = new Date(exportStartDate);
                  const end = new Date(exportEndDate);

                  const dateList: string[] = [];
                  const loopDate = new Date(start);
                  while (loopDate <= end) {
                    const formatted = loopDate.toLocaleDateString("en-PH", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      timeZone: "Asia/Manila"
                    });
                    dateList.push(formatted);
                    loopDate.setDate(loopDate.getDate() + 1);
                  }

                  const csvRows = [
                    ["Date", "In Time", "Out Time", "PTO Date", "Credited"],
                    ...dateList.map(date => {
                      const att = attendanceData.find(a => a.date === date);
                      const fullPto = ptoData.find(p => p.date === date && p.credited === 1); // For PTO override
                      const anyPto = ptoData.find(p => p.date === date); // For PTO Date / Credited columns
                      return [
                        date,
                        fullPto ? "PTO" : att?.inTime ?? "-",
                        fullPto ? "PTO" : att?.outTime ?? "-",
                        anyPto?.date ?? "",
                        anyPto?.credited?.toString() ?? ""
                      ];
                    })
                  ];

                  const csvContent = csvRows.map(row =>
                    row.map(cell => `"${cell}"`).join(",")
                  ).join("\n");

                  const blob = new Blob([csvContent], { type: "text/csv" });
                  const url = URL.createObjectURL(blob);

                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `Attendance_${employee?.firstName}_${employee?.lastName}.csv`;
                  a.click();
                  URL.revokeObjectURL(url);
                  setIsExportModalOpen(false);
                }}
              >
                Export
              </Button>
              <Button
                variant="outline"
                color="#4A6100"
                border="1px solid #4A6100"
                _hover={{ bg: "#F6F4CF" }}
                onClick={() => setIsExportModalOpen(false)}
              >
                Cancel
              </Button>
            </HStack>
          </VStack>
        </Box>
      )}
      </Flex>
    </Box>
  );
};

export default AttendanceDetailsView;