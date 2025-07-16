// pages/employeeemailerpage.tsx
import { Box } from "@chakra-ui/react";
import EmployeeEmailer from "../../views/employeeemailerview";
import { requireAuth } from "@/utils/authGuard";

const EmployeeEmailerPage = () => {
  return (
    <Box
      display="flex"
      minH="100vh"
      maxH="100vh"
      // TODO: Insert rainbow background here with desired opacity
      // Example: bgGradient="linear(to-r, red.200, orange.200, yellow.200, green.200, blue.200, purple.200)"
      // Use bg="whiteAlpha.x" or overlay if white blocks show up
    >
      <EmployeeEmailer />
    </Box>
  );
};

export const getServerSideProps = requireAuth(async () => {
  return { props: {} };
});

export default EmployeeEmailerPage;
