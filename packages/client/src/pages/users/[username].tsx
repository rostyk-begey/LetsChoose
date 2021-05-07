import { GetServerSideProps } from 'next';

import UsersApi from '../../api/usersApi';
import { UserPageProps } from '../../components/views/UserPage';

const usersApi = new UsersApi();

export { default } from '../../components/views/UserPage';

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
