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
import { AddIcon, ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import React, { useRef, useState, useEffect } from "react";
import { 
  useTableSelectionPagination, 
  useTablePaginationInput 
} from "../src/utils/attendance/tableSelectionPagination";

type Employee = {
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
};

const ROWS_PER_PAGE = 20;

const EmployeeTable = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; row: number } | null>(null);
  const outerWrapperRef = useRef<HTMLDivElement>(null);

  // Modal
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newEmployee, setNewEmployee] = useState<Employee>({
    employeeID: 80000000,
    lastName: "",
    firstName: "",
    middleName: "",
    department: "",
    coordinator: "",
    position: "",
    contactInfo: "",
    email: "",
    totalSalary: 0,
    basicSalary: 0,
  });

  // Selection and pagination logic
  const {
    selectedRows,
    setSelectedRows,
    setSelectRangeInputs,
    selectRangeInputs,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    currentPage,
    currentPageClamped,
    totalPages,
    startIdx,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    endIdx,
    pageData: pageEmployees,
    handleRangeChange,
    handleRowClick,
    handleGoToPage,
    shiftAnchorRef,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    inputActiveRef, 
    tableBoxRef, 
    inputBoxRef, 
  } = useTableSelectionPagination<Employee>(employees, ROWS_PER_PAGE);

  //pagination input
  const {
    pageInput,
    handlePageInputChange,
    handlePageInputBlur,
    handlePageInputKeyDown,
  } = useTablePaginationInput(currentPageClamped, totalPages, handleGoToPage);


  const handleContextMenu = (localIndex: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const globalIdx = startIdx + localIndex;
    if (!selectedRows.includes(globalIdx)) {
      setSelectedRows([globalIdx]);
    }
    setContextMenu({ x: e.clientX, y: e.clientY, row: globalIdx });
  };


  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch('/api/employees');
        const json = await res.json();
        if (json.success) {
          setEmployees(json.data);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchEmployees();
    const interval = setInterval(fetchEmployees, 5000);
    return () => clearInterval(interval);
  }, []);

 
  const handleAddEmployee = async () => {
    const duplicate = employees.find(emp => emp.employeeID === newEmployee.employeeID);
    if (duplicate) {
      alert("An employee with this ID already exists.");
      return;
    }

    try {
      const response = await fetch("/api/employees/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEmployee),
      });

      if (!response.ok) throw new Error("Failed to add employee");

      const updatedList = [...employees, newEmployee];
      setEmployees(updatedList);
      setNewEmployee({
        employeeID: 80000000,
        lastName: "",
        firstName: "",
        middleName: "",
        department: "",
        coordinator: "",
        position: "",
        contactInfo: "",
        email: "",
        totalSalary: 0,
        basicSalary: 0,
      });
      setSelectedRows([]);
      onClose();
    } catch (error) {
      console.error("Error adding employee:", error);
      alert("Failed to add employee. Please try again.");
    }
  };

  
  const handleUpdateEmployee = async () => {
    const employeeIDsToUpdate = selectedRows
      .map((idx) => employees[idx]?.employeeID)
      .filter((id): id is number => id !== undefined);

    const updates: Partial<Employee> = {};
    Object.entries(newEmployee).forEach(([key, value]) => {
      if (key === "employeeID") return;
      if (value !== "" && value !== 0) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
        updates[key as keyof Employee] = value;
      }
    });

    try {
      const res = await fetch("/api/employees/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeIDs: employeeIDsToUpdate, updates }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      const updated = employees.map((emp) =>
        employeeIDsToUpdate.includes(emp.employeeID)
          ? { ...emp, ...updates }
          : emp
      );
      setEmployees(updated);
      setSelectedRows([]);
      onClose();
      setIsEditing(false);
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update selected employees.");
    }
  };

  //DESELECT CONTEXT MENU WHEN CLICKING OUTSIDE MENU
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (contextMenu) {
        const menu = document.getElementById("custom-context-menu");
        if (menu && !menu.contains(e.target as Node)) {
          setContextMenu(null);
        }
      }
    };
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [contextMenu]);

  


//RENDER ==========================================================================================================
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
        <Box ref={inputBoxRef} display="inline-block" className="select-rows-label">
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
      <Box ref={tableBoxRef}
            display="flex"
            justifyContent="center"
            mx="auto"
            position="relative"
            overflowX="auto"
      >
        <Table variant="unstyled" size="sm" className="employee-table-bordered">
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
                  <Td textAlign="center">{emp.coordinator}</Td>
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
                coordinator: "",
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
    {/* Pagination Controls */}
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
      boxShadow="0px 4px 20px 0px #00000012"
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
    {/*Add Employee Modal*/}
    <Modal isOpen={isOpen} onClose={() => {
      setIsEditing(false);
      onClose();
    }}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{isEditing ? "Edit Employee" : "Add Employee"} </ModalHeader>
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
          ))}
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

export default EmployeeTable