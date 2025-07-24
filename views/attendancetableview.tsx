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
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import React, { useRef, useState, useEffect } from "react";
import { 
  useTableSelectionPagination, 
  useTablePaginationInput 
} from "../src/utils/attendance/tableSelectionPagination";

//LOG OBJECT(row)
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
  const outerWrapperRef = useRef<HTMLDivElement>(null);

  //SAMPLE DATA
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

 
  const {
    selectedRows,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setSelectedRows,
    selectRangeInputs,
    currentPageClamped,
    totalPages,
    startIdx,
    pageData: pageLogs,
    handleRangeChange,
    handleRowClick,
    handleGoToPage,
    tableBoxRef, 
    inputBoxRef, 
  } = useTableSelectionPagination<Log>(logs, ROWS_PER_PAGE);

  //pagination input
  const {
    pageInput,
    handlePageInputChange,
    handlePageInputBlur,
    handlePageInputKeyDown,
  } = useTablePaginationInput(currentPageClamped, totalPages, handleGoToPage);


  //RENDER///RENDER REDNERDERREND
  return (
    <Box minH="100vh" width="100vw" display="flex" flexDirection="column" justifyContent="space-between" ref={outerWrapperRef}>
      <Box className="employee-table-container">
        <Flex align="center" gap="2" mb={2}>
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
    </Box>
  );
};

export default AttendanceTableView;