import React, { useEffect, useState } from 'react';
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
  },
  content: {
    margin: 'auto',
    display: 'flex',
    justifyContent: 'space-between',
    flex: 1,
  },
  item: {
    flex: `1 1 calc(50% - ${theme.spacing(4)})`,
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

const inAnimations = [
  'animate__animated animate__bounceInLeft',
  'animate__animated animate__bounceInRight',
];
const outAnimations = [
  'animate__animated animate__bounceOutLeft',
  'animate__animated animate__bounceOutRight',
];
const winnerAnimation = 'animate__animated animate__faster animate__flash';

const GamePage: React.FC = () => {
  const classes = useStyles();
  const {
    query: { gameId },
    ...router
  } = useRouter();
  const { mutateAsync: choose } = useGameChoose(gameId as string);
  const { mutateAsync: getGameState } = useGameState(gameId as string);
  const [animations, setAnimations] = useState<string[]>(inAnimations);
  const [game, setGame] = useState<GetPairResponse>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isChooseLoading, setIsChooseLoading] = useState<boolean>(false);
  const { pair, round = 0, totalRounds, pairNumber, pairsInRound } = game || {};

  const fetchGameState = async (initial?: boolean) => {
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
  };

  const onChoose = (idx: number, winnerId: string) => async () => {
    try {
      setIsChooseLoading(true);
      setAnimations(Array.from({ length: 2, [idx]: winnerAnimation }));
      await choose(winnerId);
      await sleep(700);
      setAnimations(outAnimations);
      await sleep(700);
      await fetchGameState();
      setIsChooseLoading(false);
    } catch (e) {
      console.log(e);
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
