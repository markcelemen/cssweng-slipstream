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
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { AddIcon, EditIcon, ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import React, { useRef, useState, useEffect } from "react";

// Employee type
type Employee = {
  lastName: string;
  firstName: string;
  middleName: string;
  department: string;
  coordinator: string;
  position: string;
  totalSalary: number;
  basicSalary: number;
  contactNumber: string;
  employeeId: string;
  email: string;
};

const initialEmployees: Employee[] = [
  //Add employee objects here
];

// Returns [min, max] if array is continuous, else null
function getContinuousRange(selected: number[]): [number, number] | null {
  if (selected.length === 0) return null;
  const sorted = [...selected].sort((a, b) => a - b);
  for (let i = 1; i < sorted.length; ++i) {
    if (sorted[i] !== sorted[i - 1] + 1) return null;
  }
  return [sorted[0], sorted[sorted.length - 1]];
}

const ROWS_PER_PAGE = 20;

const EmployeeTable = () => {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [selectedRows, setSelectedRows] = useState<number[]>([]); // GLOBAL indices!
  const [selectRangeInputs, setSelectRangeInputs] = useState<[string, string]>(["", ""]);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; row: number } | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);

  const inputActiveRef = useRef(false);
  const inputBoxRef = useRef<HTMLDivElement>(null);
  const tableBoxRef = useRef<HTMLDivElement>(null);
  const shiftAnchorRef = useRef<number | null>(null);
  const outerWrapperRef = useRef<HTMLDivElement>(null); // NEW

  // Modal
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newEmployee, setNewEmployee] = useState<Employee>({
    lastName: "",
    firstName: "",
    middleName: "",
    department: "",
    coordinator: "",
    position: "",
    totalSalary: 0,
    basicSalary: 0,
    contactNumber: "",
    employeeId: "",
    email: "",
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(employees.length / ROWS_PER_PAGE));
  const currentPageClamped = Math.min(Math.max(1, currentPage), totalPages);
  const startIdx = (currentPageClamped - 1) * ROWS_PER_PAGE;
  const endIdx = Math.min(startIdx + ROWS_PER_PAGE, employees.length);
  const pageEmployees = employees.slice(startIdx, endIdx);

  // Range selection from input
  const handleRangeChange = (which: 0 | 1, value: string) => {
    inputActiveRef.current = true;
    const strVal = value.replace(/[^0-9]/g, "");
    const newInputs: [string, string] = [...selectRangeInputs] as [string, string];
    newInputs[which] = strVal;
    setSelectRangeInputs(newInputs);

    if (employees.length === 0) {
      setSelectedRows([]);
      return;
    }

    // Both blank: clear selection
    if (newInputs[0] === "" && newInputs[1] === "") {
      setSelectedRows([]);
      return;
    }
    // Only from (x) present, to (y) blank: select from x to end
    if (newInputs[0] !== "" && newInputs[1] === "") {
      const start = Math.max(1, Math.min(Number(newInputs[0]), employees.length)) - 1;
      if (start < 0 || start >= employees.length) {
        setSelectedRows([]);
        return;
      }
      const end = employees.length - 1;
      const range = Array.from({ length: end - start + 1 }, (_, i) => start + i);
      setSelectedRows(range);
      setCurrentPage(Math.floor(start / ROWS_PER_PAGE) + 1);
      return;
    }
    // Only to (y) present, from (x) blank: select from 0 to y
    if (newInputs[1] !== "" && newInputs[0] === "") {
      const end = Math.max(1, Math.min(Number(newInputs[1]), employees.length)) - 1;
      if (end < 0 || end >= employees.length) {
        setSelectedRows([]);
        return;
      }
      const range = Array.from({ length: end + 1 }, (_, i) => i);
      setSelectedRows(range);
      setCurrentPage(Math.floor(end / ROWS_PER_PAGE) + 1);
      return;
    }
    // Both filled: select between them
    if (newInputs[0] !== "" && newInputs[1] !== "") {
      const start = Math.max(1, Math.min(Number(newInputs[0]), employees.length)) - 1;
      const end = Math.max(1, Math.min(Number(newInputs[1]), employees.length)) - 1;
      if (start < 0 || end < 0 || start >= employees.length || end >= employees.length) {
        setSelectedRows([]);
        return;
      }
      const [min, max] = [start, end].sort((a, b) => a - b);
      const range = Array.from({ length: max - min + 1 }, (_, i) => min + i);
      setSelectedRows(range);
      setCurrentPage(Math.floor(min / ROWS_PER_PAGE) + 1);
      return;
    }
    setSelectedRows([]);
  };

  // Sync select inputs with selectedRows (if continuous)
  useEffect(() => {
    if (inputActiveRef.current) {
      inputActiveRef.current = false;
      return;
    }
    const cont = getContinuousRange(selectedRows);
    if (!cont) {
      setSelectRangeInputs(["", ""]);
    } else {
      setSelectRangeInputs([(cont[0] + 1).toString(), (cont[1] + 1).toString()]);
    }
  }, [selectedRows]);

  // Row click selection logic (shift/ctrl/mouse) with Excel-style anchor, **using global index**
  const handleRowClick = (localIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const globalIdx = startIdx + localIndex;
    // Shift-click for range selection
    if (e.shiftKey && shiftAnchorRef.current !== null) {
      const [start, end] = [shiftAnchorRef.current, globalIdx].sort((a, b) => a - b);
      const range = Array.from({ length: end - start + 1 }, (_, i) => start + i);
      setSelectedRows(range);
      return;
    }
    // Ctrl/cmd click to toggle
    if (e.ctrlKey || e.metaKey) {
      setSelectedRows((rows) =>
        rows.includes(globalIdx) ? rows.filter((i) => i !== globalIdx) : [...rows, globalIdx]
      );
      shiftAnchorRef.current = globalIdx;
      return;
    }
    setSelectedRows([globalIdx]);
    shiftAnchorRef.current = globalIdx;
  };

  // Context menu for edit/delete
  const handleContextMenu = (localIndex: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const globalIdx = startIdx + localIndex;
    if (!selectedRows.includes(globalIdx)) {
      setSelectedRows([globalIdx]);
      shiftAnchorRef.current = globalIdx;
    }
    setContextMenu({ x: e.clientX, y: e.clientY, row: globalIdx });
  };

  // Add employee handler
  const handleAddEmployee = () => {
    const newList = [...employees, newEmployee];
    setEmployees(newList);
    setNewEmployee({
      lastName: "",
      firstName: "",
      middleName: "",
      department: "",
      coordinator: "",
      position: "",
      totalSalary: 0,
      basicSalary: 0,
      contactNumber: "",
      employeeId: "",
      email: "",
    });
    setSelectedRows([]);
    setSelectRangeInputs(["", ""]);
    shiftAnchorRef.current = null;

    // Go to page where the new employee appears
    const newPage = Math.ceil(newList.length / ROWS_PER_PAGE);
    setCurrentPage(newPage);
    onClose();
  };

  // Deselect context menu and rows when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
        // If click is outside our whole wrapper, clear
        if (contextMenu) {
        // Get the context menu DOM node
        const menu = document.getElementById("custom-context-menu");
        // If click is outside the menu, close context menu
        if (menu && !menu.contains(e.target as Node)) {
          setContextMenu(null);
        }
      }
    };
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [contextMenu]);

  // Pagination Handlers
  const handleGoToPage = (n: number) => {
    setCurrentPage(Math.max(1, Math.min(n, totalPages)));
  };

  // Handle manual page input (editable current page)
  const [pageInput, setPageInput] = useState(currentPageClamped.toString());
  useEffect(() => {
    setPageInput(currentPageClamped.toString());
  }, [currentPageClamped]);

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInput(e.target.value.replace(/[^0-9]/g, ""));
  };
  const handlePageInputBlur = () => {
    const n = Number(pageInput);
    if (!isNaN(n) && n >= 1 && n <= totalPages) {
      setCurrentPage(n);
    } else {
      setPageInput(currentPageClamped.toString());
    }
  };
  const handlePageInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handlePageInputBlur();
  };

  // --- RENDER ---
  return (
    
    <Box minH="90vh" display="flex" flexDirection="column" justifyContent="space-between" ref={outerWrapperRef}>
      <Box className="employee-table-container">
        <Flex align="center" gap="2" mb={2}>
          <Button
            leftIcon={<AddIcon boxSize={4} />}
            size="sm"
            bg="#FEFAD6"
            color="#626F47"
            fontWeight="bold"
            fontSize="md"
            borderRadius="xl"
            boxShadow="0px 8px 24px 0px #00000030"
            _hover={{
              bg: "#E6E2B1",
              color: "#626F47",
              boxShadow: "0px 12px 32px 0px #00000026"
            }}
            px={6}
            py={3}
            onClick={onOpen}
          >
            Add Employee
          </Button>
          <Box ref={inputBoxRef} display="inline-block"  className="select-rows-label">
            Select rows:{" "}
            <Input
              size="xs"
              width="50px"
              value={selectRangeInputs[0]}
              onChange={e => handleRangeChange(0, e.target.value)}
              type="number"
              min={1}
              max={employees.length}
              disabled={employees.length === 0}
            />{" "}
            to{" "}
            <Input
              size="xs"
              width="50px"
              value={selectRangeInputs[1]}
              onChange={e => handleRangeChange(1, e.target.value)}
              type="number"
              min={1}
              max={employees.length}
              disabled={employees.length === 0}
            />
            {" "}of {employees.length}
          </Box>
        </Flex>
        <Box  ref={tableBoxRef}
              display="flex"
              justifyContent="center"
              mx="auto"
              position="relative"
               overflowX="auto"
        >
          <Table variant="unstyled" size="sm"   className="employee-table-container">
            <Thead bg="#A4B465" position="sticky" top={0} zIndex={1} h="50px">
              <Tr>
                {[
                  "#",
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
                  <>
                    Email
                    <Button
                      ml={3}
                      px={2}
                      py={0}
                      h="21px"
                      minW="unset"
                      bg="#FFD566"
                      color="#626F47"
                      fontWeight="semibold"
                      borderRadius="5px"
                      fontSize="sm"
                      boxShadow="sm"
                      lineHeight="1"
                      transition="background 0.4s"
                      _hover={{
                        bg: "#e6be46",
                        color: "#4b5831"
                      }}
                      onClick={() => alert("Payslips sent to email!")}
                    >
                      Send Payslips to Email
                    </Button>
                  </>
                ].map((header, idx) => (
                  <Th key={idx} textAlign="center" verticalAlign="middle" p={2}>
                    {header}
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {pageEmployees.map((emp, localIdx) => {
                const globalIdx = startIdx + localIdx;
                const isSelected = selectedRows.includes(globalIdx);
                return (
                  <Tr
                    key={globalIdx}
                    bg={isSelected ? "#FFD566" : globalIdx % 2 ? "#E6E2B1" : "#FBFCE5"}
                    style={{
                      cursor: "pointer",
                      fontWeight: isSelected ? "bold" : "normal",
                      userSelect: "none",
                    }}
                    onClick={(e) => handleRowClick(localIdx, e)}
                    onContextMenu={(e) => handleContextMenu(localIdx, e)}
                  >
                    <Td textAlign="center">{globalIdx + 1}</Td>
                    <Td textAlign="center">{emp.lastName}</Td>
                    <Td textAlign="center">{emp.firstName}</Td>
                    <Td textAlign="center">{emp.middleName}</Td>
                    <Td textAlign="center">{emp.department}</Td>
                    <Td textAlign="center">{emp.coordinator}</Td>
                    <Td textAlign="center">{emp.position}</Td>
                    <Td textAlign="center">{emp.totalSalary}</Td>
                    <Td textAlign="center">{emp.basicSalary}</Td>
                    <Td textAlign="center">{emp.contactNumber}</Td>
                    <Td textAlign="center">{emp.employeeId}</Td>
                    <Td>
                      <Flex justify="space-between" align="center">
                        {emp.email}
                        <IconButton
                          icon={<EditIcon />}
                          aria-label="Edit"
                          variant="ghost"
                          color="#626F47"
                          height="12px"
                          width="12px"
                          size="xs"
                          _hover={{ bg: "#626F47", color: "#FEFAE0" }}
                          p="0px 10px 0px 10px"
                          onClick={() => alert("Edit selected!")}
                        />
                      </Flex>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
          {/* Custom context menu */}
          {contextMenu && (
            <Box
              id="custom-context-menu"
              position="fixed"
              top={contextMenu.y}
              left={contextMenu.x}
              zIndex={9999}
              bg="#FFD566"
              borderRadius="md"
              boxShadow="md"
              p={2}
              minW="140px"
            >
              <Button size="sm" w="100%" mb={1} onClick={() => alert("Edit selected!")}>
                Edit Selected ({selectedRows.length})
              </Button>
              <Button
                size="sm"
                colorScheme="red"
                w="100%"
                onClick={() => {
                  setEmployees(employees.filter((_, idx) => !selectedRows.includes(idx)));
                  setSelectedRows([]);
                  setSelectRangeInputs(["", ""]);
                  shiftAnchorRef.current = null;
                  setContextMenu(null);
                }}
              >
                Delete Selected ({selectedRows.length})
              </Button>
            </Box>
          )}
        </Box>
      </Box>
      {/* Pagination Controls (now INSIDE the outerWrapperRef, so it doesn't trigger click-away) */}
      <Flex
        position="fixed"
        left="50%"
        bottom="16px"
        transform="translateX(-50%)"
        align="center"
        justify="center"
        gap={2}
        zIndex={10}
        bg="#FAF6C7"
        p={2}
        borderRadius="md"
        boxShadow="0px 4px 20px 0px #00000012" // Softer shadow for visibility
        ref={null} // <--- not needed, as it's inside outerWrapperRef
      >
        <IconButton
          icon={<ChevronLeftIcon />}
          aria-label="Prev"
          size="sm"
          color="6C7851"
          bg="#F5F1C2"
          isDisabled={currentPageClamped === 1}
          onClick={() => handleGoToPage(currentPageClamped - 1)}
        />
        <Button size="sm" color="#626F47" variant="ghost" onClick={() => handleGoToPage(1)}>
          1
        </Button>
        <Input
          value={pageInput}
          onChange={handlePageInputChange}
          onBlur={handlePageInputBlur}
          onKeyDown={handlePageInputKeyDown}
          size="sm"
          width="44px"
          color="#626F47"
          textAlign="center"
          bg="#FAF6C7"
          mx={1}
        />
        <Button size="sm" variant="ghost" color="#626F47" onClick={() => handleGoToPage(totalPages)}>
          {totalPages}
        </Button>
        <IconButton
          icon={<ChevronRightIcon />}
          aria-label="Next"
          color="6C7851"
          size="sm"
          bg="#F5F1C2"
          isDisabled={currentPageClamped === totalPages}
          onClick={() => handleGoToPage(currentPageClamped + 1)}
        />
      </Flex>
      {/* Add Employee Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Employee</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {Object.entries(newEmployee).map(([field, value]) => (
              <Box key={field} mb={2}>
                <Input
                  size="sm"
                  placeholder={field}
                  value={value}
                  onChange={(e) =>
                    setNewEmployee((emp) => ({
                      ...emp,
                      [field]: e.target.value,
                    }))
                  }
                  type={["totalSalary", "basicSalary"].includes(field) ? "number" : "text"}
                />
              </Box>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleAddEmployee}>
              Add
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default EmployeeTable;
