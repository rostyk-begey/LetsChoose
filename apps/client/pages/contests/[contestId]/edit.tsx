import { ContestApi } from '@lets-choose/client/api';
import { GetServerSideProps } from 'next';
import { ContestPageProps, EditContestPage } from '@lets-choose/client/pages';

const contestApi = new ContestApi();

export default EditContestPage;

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
