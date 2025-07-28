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
import { useToast } from "@chakra-ui/react";

// Employee type
type Employee = {
  employeeID: number;
  lastName: string;
  firstName: string;
  middleName: string;
  department: string;
  coordinator: boolean;
  position: string;
  contactInfo: string;
  email: string;
  totalSalary: number;
  basicSalary: number;
};

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
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]); // GLOBAL indices!
  const [selectRangeInputs, setSelectRangeInputs] = useState<[string, string]>(["", ""]);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; row: number } | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const inputActiveRef = useRef(false);
  const inputBoxRef = useRef<HTMLDivElement>(null);
  const tableBoxRef = useRef<HTMLDivElement>(null);
  const shiftAnchorRef = useRef<number | null>(null);
  const outerWrapperRef = useRef<HTMLDivElement>(null); // NEW
  const toast = useToast();

  // Modal
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newEmployee, setNewEmployee] = useState<Employee>({
    employeeID: 80000000,
    lastName: "",
    firstName: "",
    middleName: "",
    department: "",
    coordinator: false,
    position: "",
    contactInfo: "",
    email: "",
    totalSalary: 0,
    basicSalary: 0,
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

  // Used to fetch employee data from the database
  useEffect(() => {
  const fetchEmployees = async () => {
    try {
      const res = await fetch('/api/employees');
      const json = await res.json();
      if (json.success) {
        setEmployees(json.data);
      } else {
        console.error("Error fetching employees:", json.message);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  fetchEmployees(); // fetch once when component mounts

  const interval = setInterval(fetchEmployees, 5000); // refresh every 5s
  return () => clearInterval(interval); // cleanup
}, []);


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
  const handleAddEmployee = async () => {
    
    const requiredFields: { key: keyof Employee; label: string }[] = [
      { key: "firstName", label: "First Name" },
      { key: "lastName", label: "Last Name" },
      { key: "department", label: "Department" },
      { key: "position", label: "Position" },
      { key: "contactInfo", label: "Contact Number" },
      { key: "email", label: "Email" },
    ];

    for (const field of requiredFields) {
      const value = newEmployee[field.key];
      if (typeof value === "string" && value.trim() === "") {
        toast({
          title: "Missing Required Field",
          description: `${field.label} is required.`,
          status: "error",
          duration: 4000,
          isClosable: true,
        });
        return;
      }
    }
    
    if (!/^\d+$/.test(newEmployee.contactInfo)) {
      toast({
        title: "Invalid Contact Number",
        description: "Contact number must contain only digits.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmployee.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    if (newEmployee.totalSalary < 0 || newEmployee.basicSalary < 0) {
      toast({
        title: "Negative Salary",
        description: "Total or Basic salary cannot be negative.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    if (newEmployee.employeeID <= 0) {
      toast({
        title: "Invalid Employee ID",
        description: "Employee ID must be a positive number.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    if (employees.some((e) => e.employeeID === newEmployee.employeeID)) {
      toast({
        title: "Duplicate Employee ID",
        description: "An employee with this ID already exists.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await fetch("/api/employees/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEmployee),
      });

      if (!response.ok) throw new Error("Failed to add employee");

      // Optionally update UI after successful insert
      const updatedList = [...employees, newEmployee];
      setEmployees(updatedList);
      setNewEmployee({
        employeeID: 80000000,
        lastName: "",
        firstName: "",
        middleName: "",
        department: "",
        coordinator: false,
        position: "",
        contactInfo: "",
        email: "",
        totalSalary: 0,
        basicSalary: 0,
      });
      setSelectedRows([]);
      setSelectRangeInputs(["", ""]);
      shiftAnchorRef.current = null;

      // Move to last page
      const newPage = Math.ceil(updatedList.length / ROWS_PER_PAGE);
      setCurrentPage(newPage);
      onClose();
    } catch (error) {
      console.error("Error adding employee:", error);
      alert("Failed to add employee. Please try again.");
    }
  };

  //Update employee handler
  const handleUpdateEmployee = async () => {
    const employeeIDsToUpdate = selectedRows
      .map((idx) => employees[idx]?.employeeID)
      .filter((id): id is number => id !== undefined);

  const updates: Partial<Employee> = {};

  Object.entries(newEmployee).forEach(([key, value]) => {
    if (key === "employeeID") return;
    if (
      typeof value === "boolean" ||
      (typeof value === "number" && value !== 0) ||
      (typeof value === "string" && (key === "middleName" || value.trim() !== ""))
      ) {
      // @ts-ignore
      updates[key] = value;
    }
  });

  if (Object.keys(updates).length === 0) {
    alert("No fields changed.");
    return;
  }


    try {
      const res = await fetch("/api/employees/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ employeeIDs: employeeIDsToUpdate, updates }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      // Refresh local state (you could fetch from DB instead)
      const updated = employees.map((emp) =>
        employeeIDsToUpdate.includes(emp.employeeID)
          ? { ...emp, ...updates }
          : emp
      );
      setEmployees(updated);
      setSelectedRows([]);
      setSelectRangeInputs(["", ""]);
      shiftAnchorRef.current = null;
      onClose();
      setIsEditing(false);
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update selected employees.");
    }
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
    
    <Box minH="100vh" width="100vw" display="flex" flexDirection="column" justifyContent="space-between" ref={outerWrapperRef}>
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
            boxShadow="2px 2px 2px 0px #00000030"
            _hover={{
              bg: "#E6E2B1",
              color: "#626F47",
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
          <Table variant="unstyled" size="sm"   className="employee-table-bordered">
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
                    bg={isSelected ? "rgba(255, 213, 102, 0.97)" : globalIdx % 2 ? "rgba(230, 226, 177, 0.93)" :"rgba(251, 252, 229, 0.93)"}
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
                    <Td textAlign="center">{emp.coordinator === true ? "Yes" : "No"}</Td>
                    <Td textAlign="center">{emp.position}</Td>
                    <Td textAlign="center">{emp.totalSalary}</Td>
                    <Td textAlign="center">{emp.basicSalary}</Td>
                    <Td textAlign="center">{emp.contactInfo}</Td>
                    <Td textAlign="center">{emp.employeeID}</Td>
                    <Td>
                      <Flex justify="space-between" align="center">
                        {emp.email}
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
              <Button size="sm" w="100%" mb={1} onClick={() => {
                setIsEditing(true);
                setNewEmployee({
                  employeeID: 0,
                  lastName: "",
                  firstName: "",
                  middleName: "",
                  department: "",
                  coordinator: false,
                  position: "",
                  contactInfo: "",
                  email: "",
                  totalSalary: 0,
                  basicSalary: 0,
                });
                onOpen();
                setContextMenu(null);
              }}>
                Edit Selected ({selectedRows.length})
              </Button>
              <Button
                size="sm"
                colorScheme="red"
                w="100%"
                onClick={async () => {
                    const employeeIDsToDelete = selectedRows.map(idx => {
                    const emp = employees[idx];
                    return emp?.employeeID;
                  }).filter((id): id is number => id !== undefined);
                  try {
                    const res = await fetch('/api/employees/delete', {
                      method: 'DELETE',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ employeeIDs: employeeIDsToDelete }),
                    });

                    const data = await res.json();
                    if (!data.success) {
                      throw new Error(data.message);
                    }

                    // Remove deleted employees from UI
                    const remaining = employees.filter(emp => !employeeIDsToDelete.includes(emp.employeeID));
                    setEmployees(remaining);
                    setSelectedRows([]);
                    setSelectRangeInputs(["", ""]);
                    shiftAnchorRef.current = null;
                    setContextMenu(null);
                  } catch (err) {
                    console.error("Error deleting employees:", err);
                    alert("Failed to delete selected employees.");
                  }
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
      <Modal isOpen={isOpen} onClose={() => {
        setIsEditing(false);
        onClose();
      }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Employee</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* Render all fields except coordinator */}
            {Object.entries(newEmployee).map(([field, value]) =>
              field === "coordinator" ? null : (
                <Box key={field} mb={2}>
                  <Input
                    size="sm"
                    placeholder={field}
                    value={typeof value === "boolean" ? String(value) : value}
                    onChange={(e) =>
                      setNewEmployee((emp) => ({
                        ...emp,
                        [field]: ["employeeID", "totalSalary", "basicSalary"].includes(field)
                          ? Number(e.target.value)
                          : e.target.value,
                      }))
                    }
                    type={
                      ["employeeID", "totalSalary", "basicSalary"].includes(field)
                        ? "number"
                        : "text"
                    }
                  />
                </Box>
              )
            )}

            <Box mb={2}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input
                  type="checkbox"
                  checked={!!newEmployee.coordinator}
                  onChange={(e) =>
                    setNewEmployee((emp) => ({
                      ...emp,
                      coordinator: e.target.checked,
                    }))
                  }
                />
                Coordinator
              </label>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={isEditing ? handleUpdateEmployee : handleAddEmployee}>
              {isEditing ? "Update" : "Add"}
            </Button>
            <Button onClick={() => {
              setIsEditing(false);
              onClose();
            }}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default EmployeeTable;
