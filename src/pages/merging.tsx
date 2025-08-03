import MergeTableView from "../../views/mergetableview";
import { Box } from "@chakra-ui/react";
import { requireAuth } from "@/utils/authGuard";

const MergingPage = () => {
  return (
    <Box display="flex" minH="100vh" maxH="100vh">
      <MergeTableView />
    </Box>
  );
};

export const getServerSideProps = requireAuth(async () => {
  return { props: {} };
});

export default MergingPage;