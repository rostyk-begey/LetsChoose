import { UsersApi } from '@lets-choose/client/api';
import { GetServerSideProps } from 'next';

import { UserPage, UserPageProps } from '@lets-choose/client/pages';

const usersApi = new UsersApi();

export default UserPage;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const getServerSideProps: GetServerSideProps<
  UserPageProps,
  { username: string }
> = async ({ params: { username } = {} }) => {
  try {
    const { data: user } = await usersApi.find(username as string);
    return {
      props: { initialUser: user },
    };
  } catch (e) {
    return {
      notFound: true,
    };
  }
};