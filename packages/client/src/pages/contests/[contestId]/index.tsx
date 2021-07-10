import { GetServerSideProps } from 'next';
import ContestApi from '../../../api/contest.api';
import { ContestPageProps } from '../../../components/views/ContestPage/ContestPage';

const contestApi = new ContestApi();

export { default } from '../../../components/views/ContestPage';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const getServerSideProps: GetServerSideProps<
  ContestPageProps,
  { contestId: string }
> = async ({ params: { contestId } = {} }) => {
  try {
    const { data: contest } = await contestApi.find(contestId as string);
    return {
      props: { initialContest: contest },
    };
  } catch (e) {
    return {
      notFound: true,
    };
  }
};
