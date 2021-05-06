import { GetServerSideProps } from 'next';

import UsersApi from '../../api/usersApi';
import { UserPageProps } from '../../components/views/UserPage';
import ROUTES from '../../utils/routes';

export { default } from '../../components/views/UserPage';

const usersApi = new UsersApi({
  baseURL: `http://localhost:5000${ROUTES.API.INDEX}`,
});

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const getServerSideProps: GetServerSideProps<
  UserPageProps,
  { username: string }
> = async ({ params: { username } = {} }) => {
  try {
    const { data: user } = await usersApi.find(username as string);
    return {
      props: { initialUserData: { data: user } },
    };
  } catch (e) {
    return {
      notFound: true,
    };
  }
};
