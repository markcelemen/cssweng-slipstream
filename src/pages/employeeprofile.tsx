import { Box } from "@chakra-ui/react";
import EmployeeProfileView from "../../views/employeeprofileview";

const EmployeeProfilePage = () => {
  return (
    <Box display="flex" minH="100vh" maxH="100vh">
      <EmployeeProfileView />
    </Box>
  );
};

export default EmployeeProfilePage;
