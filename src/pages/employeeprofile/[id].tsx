import { useRouter } from 'next/router';
import EmployeeProfileView from '../../../views/employeeprofileview';
import { requireAuth } from "@/utils/authGuard";

const EmployeeProfilePage = () => {
  const router = useRouter();
  const { id } = router.query;

  if (typeof id !== 'string') return null;

  return <EmployeeProfileView id={id} />;
};

export const getServerSideProps = requireAuth(async () => {
  return { props: {} };
});

export default EmployeeProfilePage;
