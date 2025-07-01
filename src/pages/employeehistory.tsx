import EmployeeHistory from "../../views/employeehistoryview";
import EmployeeTable from "../../views/employeetableview";
import HistoryTab from "../../views/employeehistoryview";
import { Box } from "@chakra-ui/react/box";

const EmployeeHistoryPage = () => {
  return (
    <Box display="flex" minH="100vh" maxH="100vh"> {/* insert rainbow bg and edit the opacity. bg color is white and appears on some cases. */ }
      <EmployeeTable/>
      <HistoryTab />
    </Box>
  );
};

export default EmployeeHistoryPage;