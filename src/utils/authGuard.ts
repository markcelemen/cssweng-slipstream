import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import * as cookie from 'cookie';

export function requireAuth<T>(getProps: (ctx: GetServerSidePropsContext) => Promise<GetServerSidePropsResult<T>>) {
  return async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<T>> => {
    const cookies = cookie.parse(context.req.headers.cookie || '');
    const token = cookies.auth;

    if (token !== 'admin-session-token') {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }

    return await getProps(context);
  };
}
