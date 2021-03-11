import React, { useEffect, useState } from 'react';
import { GetPairResponse } from '@lets-choose/common';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { useRouter } from 'next/router';

import Page from '../../common/Page';
import Subheader from '../../common/Subheader';
import { useGameChoose, useGameState } from '../../../hooks/api/game';
import { useWarnIfUnsavedChanges } from '../../../hooks/warnIfUnsavedChanges';
import { sleep } from '../../../utils/functions';
import ROUTES from '../../../utils/routes';

import GameCard from './GameCard';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
  },
  content: {
    margin: 'auto',
  },
  subheader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
    setIsChooseLoading(true);
    setAnimations(Array.from({ length: 2, [idx]: winnerAnimation }));
    await choose(winnerId);
    await sleep(700);
    setAnimations(outAnimations);
    await sleep(700);
    await fetchGameState();
    setIsChooseLoading(false);
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
            <Typography variant="h5">
              {round + 1 === totalRounds
                ? 'Final round'
                : `Round ${round + 1} | (${pairNumber} / ${pairsInRound})`}
            </Typography>
          </Subheader>
        ) : undefined
      }
    >
      <Container className={classes.content}>
        <Grid container spacing={5} justify="center">
          {!isLoading &&
            pair?.map((item, i) => (
              <Grid key={item._id} item xs={6} className={animations[i]}>
                <GameCard
                  item={item}
                  onClick={!isChooseLoading ? onChoose(i, item._id) : undefined}
                />
              </Grid>
            ))}
        </Grid>
      </Container>
    </Page>
  );
};

export default GamePage;