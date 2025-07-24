import AttendanceTableView from "../../views/attendancetableview";
import { Box } from "@chakra-ui/react";
import { requireAuth } from "@/utils/authGuard";

const AttendanceLogPage = () => {
  return (
    <Box display="flex" minH="100vh" maxH="100vh">
      <AttendanceTableView />
    </Box>
  );
};

export const getServerSideProps = requireAuth(async () => {
  return { props: {} };
});

export default AttendanceLogPage;