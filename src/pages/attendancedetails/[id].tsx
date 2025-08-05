import { useRouter } from 'next/router';
import AttendanceDetailsView from '../../../views/attendancedetailsview';
import { requireAuth } from "@/utils/authGuard";

const AttendanceDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;

  if (typeof id !== 'string') return null;

  return <AttendanceDetailsView id={id} />;
};

export const getServerSideProps = requireAuth(async () => {
  return { props: {} };
});


export default AttendanceDetailsPage;
