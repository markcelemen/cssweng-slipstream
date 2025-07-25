import { useRouter } from 'next/router';
import EmployeeProfileView from '../../../views/employeeprofileview';

const EmployeeProfilePage = () => {
  const router = useRouter();
  const { id } = router.query;

  if (typeof id !== 'string') return null;

  return <EmployeeProfileView id={id} />;
};

export default EmployeeProfilePage;
