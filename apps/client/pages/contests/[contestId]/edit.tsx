import { ContestApi } from '@lets-choose/client/api';
import { ContestPageProps, EditContestPage } from '@lets-choose/client/pages';
import { GetServerSideProps } from 'next';

const contestApi = new ContestApi();

export default EditContestPage;

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
