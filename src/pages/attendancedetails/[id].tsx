import { useRouter } from 'next/router';
import AttendanceDetailsView from '../../../views/attendancedetailsview';

const AttendanceDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;

  if (typeof id !== 'string') return null;

  return <AttendanceDetailsView id={id} />;
};

export default AttendanceDetailsPage;
