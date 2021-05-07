import React, { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { GetPairResponse } from '@lets-choose/common';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import { useRouter } from 'next/router';
import classNames from 'classnames';

import Page from '../../common/Page';
import Subheader from '../../common/Subheader';
import { useGameChoose, useGameState } from '../../../hooks/api/game';
import { useWarnIfUnsavedChanges } from '../../../hooks/warnIfUnsavedChanges';
import { sleep } from '../../../utils/functions';
import ROUTES from '../../../utils/routes';

import GameCard from './GameCard';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flex: 1,
    padding: theme.spacing(3),
  },
  content: {
    margin: 'auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gridGap: theme.spacing(3),
    maxWidth: 1500,
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr',
      maxWidth: 550,
    },
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subheader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: theme.palette.text.primary,
  },
}));

const getAnimationClassNames = ({
  direction = 'In',
}: {
  direction?: 'In' | 'Out';
} = {}) => [
  `animate__animated animate__bounce${direction}Left`,
  `animate__animated animate__bounce${direction}Right`,
];
const winnerAnimation = 'animate__animated animate__faster animate__flash';

const GamePage: React.FC = () => {
  const classes = useStyles();
  const { query: { gameId = '' } = {}, ...router } = useRouter() || {};
  const inAnimations = getAnimationClassNames();
  const { mutateAsync: choose } = useGameChoose(gameId as string);
  const { mutateAsync: getGameState } = useGameState(gameId as string);
  const [animations, setAnimations] = useState<string[]>(inAnimations);
  const [game, setGame] = useState<GetPairResponse>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isChooseLoading, setIsChooseLoading] = useState<boolean>(false);
  const { pair, round = 0, totalRounds, pairNumber, pairsInRound } = game || {};
  const { enqueueSnackbar } = useSnackbar();

  const fetchGameState = async (initial?: boolean) => {
    try {
      if (gameId) {
        setIsLoading(true);
        const { data: game } = (await getGameState()) || {};

        if (game?.finished && !initial) {
          await router.push(`${ROUTES.CONTESTS.INDEX}/${game.contestId}`);
        }

        setGame(game);
        setAnimations(inAnimations);
        setIsLoading(false);
      }
    } catch (e) {
      enqueueSnackbar(e.response.data.message, { variant: 'error' });
    }
  };

  const onChoose = (idx: number, winnerId: string) => async () => {
    try {
      setIsChooseLoading(true);
      setAnimations(Array.from({ length: 2, [idx]: winnerAnimation }));
      await choose(winnerId);
      await sleep(700);
      setAnimations(getAnimationClassNames({ direction: 'Out' }));
      await sleep(700);
      await fetchGameState();
      setIsChooseLoading(false);
    } catch ({ message }) {
      enqueueSnackbar(message);
    }
  };

  useEffect(() => {
    fetchGameState(true);
  }, []);

  useWarnIfUnsavedChanges(!isLoading && !!game && !game.finished);

  if (!isLoading && !!game && game.finished) {
    return (
      <Page className={classes.root}>
        <Typography variant="h1" className={classes.content}>
          Game not found...
        </Typography>
      </Page>
    );
  }

  return (
    <Page
      className={classes.root}
      subHeader={
        !isLoading ? (
          <Subheader className={classes.subheader}>
            <Typography variant="h5" className={classes.title}>
              {round + 1 === totalRounds
                ? 'Final round'
                : `Round ${round + 1} | (${pairNumber} / ${pairsInRound})`}
            </Typography>
          </Subheader>
        ) : undefined
      }
    >
      <div className={classes.content}>
        {!isLoading &&
          pair?.map((item, i) => (
            <div
              key={item._id}
              className={classNames(animations[i], classes.item)}
            >
              <GameCard
                item={item}
                onClick={!isChooseLoading ? onChoose(i, item._id) : undefined}
              />
            </div>
          ))}
      </div>
    </Page>
  );
};

export default GamePage;
