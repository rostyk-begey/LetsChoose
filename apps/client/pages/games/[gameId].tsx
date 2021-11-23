import { GameApi } from '@lets-choose/client/api';
import { GamePageProps } from '@lets-choose/client/pages';
import { GetServerSideProps } from 'next';

export { GamePage as default } from '@lets-choose/client/pages';

const gameApi = new GameApi();

export const getServerSideProps: GetServerSideProps<
  GamePageProps,
  { gameId: string }
> = async ({ params: { gameId } = {} }) => {
  try {
    const { data: game } = await gameApi.find(gameId);
    return {
      props: { initialGame: game },
    };
  } catch (e) {
    return {
      notFound: true,
    };
  }
};
