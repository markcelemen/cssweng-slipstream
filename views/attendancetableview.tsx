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

type Log = {
  id: number;
  date: string;
  time: string;
  employeeID: number;
  lastName: string;
  firstName: string;
  middleName: string;
  position: string;
  contactNo: string;
  email: string;
};

const ROWS_PER_PAGE = 20;

const AttendanceTableView = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; row: number } | null>(null);
  const outerWrapperRef = useRef<HTMLDivElement>(null);

  //Modal
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newLog, setNewLog] = useState<Log>({
    id: 0,
    date: "",
    time: "",
    employeeID: 0,
    lastName: "",
    firstName: "",
    middleName: "",
    position: "",
    contactNo: "",
    email: "",
  });

  //Selection and pagination logic
  const {
    selectedRows,
    setSelectedRows,
    setSelectRangeInputs,
    selectRangeInputs,
    currentPageClamped,
    totalPages,
    startIdx,
    pageData: pageLogs,
    handleRangeChange,
    handleRowClick,
    handleGoToPage,
    shiftAnchorRef,
    tableBoxRef, 
    inputBoxRef, 
  } = useTableSelectionPagination<Log>(logs, ROWS_PER_PAGE);

  // Pagination input
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

  //Sample Data
  useEffect(() => {
    const mockLogs: Log[] = Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      date: `2023-05-${String(Math.floor(i / 10) + 1).padStart(2, '0')}`,
      time: `${8 + Math.floor(i % 10)}:${String((i * 7) % 60).padStart(2, '0')}`,
      employeeID: 1000 + i,
      lastName: `Last${i}`,
      firstName: `First${i}`,
      middleName: `Middle${i}`,
      position: ['Manager', 'Supervisor', 'Staff'][i % 3],
      contactNo: `09${Math.floor(100000000 + Math.random() * 900000000)}`,
      email: `user${i}@company.com`,
    }));
    setLogs(mockLogs);
  }, []);

  const handleAddLog = () => {
    alert(`Adding new log:\n${JSON.stringify(newLog, null, 2)}`);
    const updatedLogs = [...logs, {
      ...newLog,
      id: logs.length + 1
    }];
    setLogs(updatedLogs);
    setNewLog({
      id: 0,
      date: "",
      time: "",
      employeeID: 0,
      lastName: "",
      firstName: "",
      middleName: "",
      position: "",
      contactNo: "",
      email: "",
    });
    onClose();
  };

  const handleUpdateLog = () => {
    const selectedLogs = selectedRows.map(idx => logs[idx]);
    alert(`Updating logs:\n${JSON.stringify(selectedLogs, null, 2)}\nWith new values:\n${JSON.stringify(newLog, null, 2)}`);
    const updatedLogs = logs.map(log => 
      selectedRows.includes(logs.indexOf(log)) ? { ...log, ...newLog } : log
    );
    setLogs(updatedLogs);
    setSelectedRows([]);
    onClose();
    setIsEditing(false);
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
            Add Log
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
              max={logs.length}
              disabled={logs.length === 0}
            />{" "}
            to{" "}
            <Input
              size="xs"
              width="50px"
              value={selectRangeInputs[1]}
              onChange={e => handleRangeChange(1, e.target.value)}
              type="number"
              min={1}
              max={logs.length}
              disabled={logs.length === 0}
            />
            {" "}of {logs.length}
          </Box>
        </Flex>
        <Box 
          ref={tableBoxRef}
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
                  "Date",
                  "Time",
                  "Employee ID",
                  "Last Name",
                  "First Name",
                  "Middle Name",
                  "Position",
                  "Contact No.",
                  "Email",
                ].map((header, idx) => (
                  <Th key={idx} textAlign="center" verticalAlign="middle" p={2}>
                    {header}
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {pageLogs.map((log, localIdx) => {
                const globalIdx = startIdx + localIdx;
                const isSelected = selectedRows.includes(globalIdx);
                return (
                  <Tr
                    key={globalIdx}
                    bg={isSelected ? "rgba(255, 213, 102, 0.97)" : globalIdx % 2 ? "rgba(230, 226, 177, 0.93)" : "rgba(251, 252, 229, 0.93)"}
                    style={{
                      cursor: "pointer",
                      fontWeight: isSelected ? "bold" : "normal",
                      userSelect: "none",
                    }}
                    onClick={(e) => handleRowClick(localIdx, e)}
                    onContextMenu={(e) => handleContextMenu(localIdx, e)}
                  >
                    <Td textAlign="center">{globalIdx + 1}</Td>
                    <Td textAlign="center">{log.date}</Td>
                    <Td textAlign="center">{log.time}</Td>
                    <Td textAlign="center">{log.employeeID}</Td>
                    <Td textAlign="center">{log.lastName}</Td>
                    <Td textAlign="center">{log.firstName}</Td>
                    <Td textAlign="center">{log.middleName}</Td>
                    <Td textAlign="center">{log.position}</Td>
                    <Td textAlign="center">{log.contactNo}</Td>
                    <Td textAlign="center">{log.email}</Td>
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
              <Button 
                size="sm" 
                w="100%" 
                mb={1} 
                onClick={() => {
                  setIsEditing(true);
                  setNewLog({
                    id: 0,
                    date: "",
                    time: "",
                    employeeID: 0,
                    lastName: "",
                    firstName: "",
                    middleName: "",
                    position: "",
                    contactNo: "",
                    email: "",
                  });
                  onOpen();
                  setContextMenu(null);
                }}
              >
                Edit Selected ({selectedRows.length})
              </Button>
              <Button
                size="sm"
                colorScheme="red"
                w="100%"
                onClick={() => {
                  const selectedLogs = selectedRows.map(idx => logs[idx]);
                  alert(`Deleting logs:\n${JSON.stringify(selectedLogs, null, 2)}`);
                  const remainingLogs = logs.filter((_, idx) => !selectedRows.includes(idx));
                  setLogs(remainingLogs);
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
      
      {/* Add/Edit Modal */}
      <Modal isOpen={isOpen} onClose={() => {
        setIsEditing(false);
        onClose();
      }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEditing ? "Edit Log" : "Add Log"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {Object.entries(newLog).map(([field, value]) => (
              <Box key={field} mb={2}>
                <Input
                  size="sm"
                  placeholder={field}
                  value={value}
                  onChange={(e) =>
                    setNewLog((log) => ({
                      ...log,
                      [field]: ["id", "employeeID"].includes(field)
                        ? Number(e.target.value)
                        : e.target.value,
                    }))
                  }
                  type={["id", "employeeID"].includes(field) ? "number" : "text"}
                />
              </Box>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={isEditing ? handleUpdateLog : handleAddLog}>
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

export default AttendanceTableView;