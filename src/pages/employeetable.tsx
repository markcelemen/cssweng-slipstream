import EmployeeTable from "../../views/employeetableview";
import HistoryTab from "../../views/employeehistoryview";
import { Box } from "@chakra-ui/react/box";


const EmployeePage = () => {
  return (
    <Box display="flex" minH="100vh" maxH="100vh">
      <EmployeeTable />
    </Box>
  );
};

export default EmployeePage;
