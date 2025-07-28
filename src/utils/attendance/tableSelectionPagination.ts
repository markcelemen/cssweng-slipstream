import { useState, useRef, useEffect } from "react";

// Returns [min, max] if array is continuous, else null
export function getContinuousRange(selected: number[]): [number, number] | null {
  if (selected.length === 0) return null;
  const sorted = [...selected].sort((a, b) => a - b);
  for (let i = 1; i < sorted.length; ++i) {
    if (sorted[i] !== sorted[i - 1] + 1) return null;
  }
  return [sorted[0], sorted[sorted.length - 1]];
}

export const useTableSelectionPagination = <T,>(data: T[], rowsPerPage: number = 20) => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]); // GLOBAL indices!
  const [selectRangeInputs, setSelectRangeInputs] = useState<[string, string]>(["", ""]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const inputActiveRef = useRef(false);
  const shiftAnchorRef = useRef<number | null>(null);
  const tableBoxRef = useRef<HTMLDivElement>(null);
  const inputBoxRef = useRef<HTMLDivElement>(null);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(data.length / rowsPerPage));
  const currentPageClamped = Math.min(Math.max(1, currentPage), totalPages);
  const startIdx = (currentPageClamped - 1) * rowsPerPage;
  const endIdx = Math.min(startIdx + rowsPerPage, data.length);
  const pageData = data.slice(startIdx, endIdx);

  // Range selection from input
  const handleRangeChange = (which: 0 | 1, value: string) => {
    inputActiveRef.current = true;
    const strVal = value.replace(/[^0-9]/g, "");
    const newInputs: [string, string] = [...selectRangeInputs] as [string, string];
    newInputs[which] = strVal;
    setSelectRangeInputs(newInputs);

    if (data.length === 0) {
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
      const start = Math.max(1, Math.min(Number(newInputs[0]), data.length)) - 1;
      if (start < 0 || start >= data.length) {
        setSelectedRows([]);
        return;
      }
      const end = data.length - 1;
      const range = Array.from({ length: end - start + 1 }, (_, i) => start + i);
      setSelectedRows(range);
      setCurrentPage(Math.floor(start / rowsPerPage) + 1);
      return;
    }
    // Only to (y) present, from (x) blank: select from 0 to y
    if (newInputs[1] !== "" && newInputs[0] === "") {
      const end = Math.max(1, Math.min(Number(newInputs[1]), data.length)) - 1;
      if (end < 0 || end >= data.length) {
        setSelectedRows([]);
        return;
      }
      const range = Array.from({ length: end + 1 }, (_, i) => i);
      setSelectedRows(range);
      setCurrentPage(Math.floor(end / rowsPerPage) + 1);
      return;
    }
    // Both filled: select between them
    if (newInputs[0] !== "" && newInputs[1] !== "") {
      const start = Math.max(1, Math.min(Number(newInputs[0]), data.length)) - 1;
      const end = Math.max(1, Math.min(Number(newInputs[1]), data.length)) - 1;
      if (start < 0 || end < 0 || start >= data.length || end >= data.length) {
        setSelectedRows([]);
        return;
      }
      const [min, max] = [start, end].sort((a, b) => a - b);
      const range = Array.from({ length: max - min + 1 }, (_, i) => min + i);
      setSelectedRows(range);
      setCurrentPage(Math.floor(min / rowsPerPage) + 1);
      return;
    }
    setSelectedRows([]);
  };

  // Row click selection logic (shift/ctrl/mouse) with Excel-style anchor, using global index
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

  // Pagination Handlers
  const handleGoToPage = (n: number) => {
    setCurrentPage(Math.max(1, Math.min(n, totalPages)));
  };

  return {
    selectedRows,
    setSelectedRows,
    setSelectRangeInputs,
    selectRangeInputs,
    currentPage,
    currentPageClamped,
    totalPages,
    startIdx,
    endIdx,
    pageData,
    handleRangeChange,
    handleRowClick,
    handleGoToPage,
    shiftAnchorRef,
    inputActiveRef, 
    tableBoxRef, 
    inputBoxRef, 
  };
};

export const useTablePaginationInput = (currentPage: number, totalPages: number, handleGoToPage: (n: number) => void) => {
  const [pageInput, setPageInput] = useState(currentPage.toString());

  useEffect(() => {
    setPageInput(currentPage.toString());
  }, [currentPage]);

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInput(e.target.value.replace(/[^0-9]/g, ""));
  };

  const handlePageInputBlur = () => {
    const n = Number(pageInput);
    if (!isNaN(n) && n >= 1 && n <= totalPages) {
      handleGoToPage(n);
    } else {
      setPageInput(currentPage.toString());
    }
  };

  const handlePageInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handlePageInputBlur();
  };

  return {
    pageInput,
    handlePageInputChange,
    handlePageInputBlur,
    handlePageInputKeyDown,
  };
  
};
