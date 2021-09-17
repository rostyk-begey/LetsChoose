import { Page, Subheader } from '@lets-choose/client/components';
import {
  useGameChoose,
  useGameState,
  useWarnIfUnsavedChanges,
} from '@lets-choose/client/hooks';
import { ROUTES, sleep } from '@lets-choose/client/utils';
import { GetPairResponse } from '@lets-choose/common/dto';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';
import { NextRouter, useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';

import { GameCard } from './GameCard';

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

export const GamePage: React.FC = () => {
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
          await (router as NextRouter).push(
            `${ROUTES.CONTESTS.INDEX}/${game.contestId}`,
          );
        }

        setGame(game);
        setAnimations(inAnimations);
        setIsLoading(false);
      }
    } catch (e: any) {
      // TODO: ts any
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
    } catch (e: any) {
      // TODO: ts any
      enqueueSnackbar(e.message);
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
              key={item.id}
              className={classNames(animations[i], classes.item)}
            >
              <GameCard
                item={item}
                onClick={!isChooseLoading ? onChoose(i, item.id) : undefined}
              />
            </div>
          ))}
      </div>
    </Page>
  );
};
