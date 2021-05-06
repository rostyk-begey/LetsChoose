import { GetServerSideProps } from 'next';
import ContestApi from '../../../api/contest.api';
import { ContestPageProps } from '../../../components/views/ContestPage/ContestPage';
import ROUTES from '../../../utils/routes';

export { default } from '../../../components/views/ContestPage';

const contestApi = new ContestApi({
  baseURL: `http://localhost:5000${ROUTES.API.INDEX}`,
});

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const getServerSideProps: GetServerSideProps<
  ContestPageProps,
  { contestId: string }
> = async ({ params: { contestId } = {} }) => {
  try {
    const { data: contest } = await contestApi.find(contestId as string);
    return {
      props: { initialContestData: { data: contest } },
    };
  } catch (e) {
    return {
      notFound: true,
    };
  }
};
