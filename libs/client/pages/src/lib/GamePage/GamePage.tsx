import React, { useCallback, useState } from 'react';
import { Page, Subheader } from '@lets-choose/client/components';
import { styled } from '@mui/material/styles';
import {
  useGameChoose,
  useGameState,
  useWarnIfUnsavedChanges,
} from '@lets-choose/client/hooks';
import { ROUTES, sleep } from '@lets-choose/client/utils';
import { ContestItemDto, GameDto } from '@lets-choose/common/dto';
import Typography from '@mui/material/Typography';
import classNames from 'classnames';
import { NextRouter, useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

import { GameCard } from './GameCard';

const PREFIX = 'GamePage';

const classes = {
  content: `${PREFIX}-content`,
  item: `${PREFIX}-item`,
  subheader: `${PREFIX}-subheader`,
  title: `${PREFIX}-title`,
};

const StyledPage = styled(Page)(({ theme }) => ({
  display: 'flex',
  flex: 1,
  padding: theme.spacing(3),

  [`& .${classes.content}`]: {
    margin: 'auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gridGap: theme.spacing(3),
    maxWidth: 1500,
    width: '100%',
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: '1fr',
      maxWidth: 550,
    },
  },

  [`& .${classes.item}`]: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  [`& .${classes.subheader}`]: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  [`& .${classes.title}`]: {
    color: theme.palette.text.primary,
  },
}));

const delayTime = 400;

const getAnimationClassNames = ({
  direction = 'In',
}: {
  direction?: 'In' | 'Out';
} = {}) => [
  `animate__animated animate__bounce${direction}Left`,
  `animate__animated animate__bounce${direction}Right`,
];
const winnerAnimation = 'animate__animated animate__faster animate__flash';

export interface GamePageProps {
  initialGame: GameDto;
}

export const GamePage: React.FC<GamePageProps> = ({ initialGame }) => {
  const { id: gameId } = initialGame;
  const router = useRouter();
  const inAnimations = getAnimationClassNames();
  const { mutateAsync: choose } = useGameChoose(gameId);
  const { mutateAsync: getGameState } = useGameState(gameId);
  const [animations, setAnimations] = useState<string[]>(inAnimations);
  const [game, setGame] = useState<GameDto>(initialGame);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isChooseLoading, setIsChooseLoading] = useState<boolean>(false);
  const { pair, round = 0, totalRounds, pairNumber, pairsInRound } = game || {};
  const { enqueueSnackbar } = useSnackbar();

  const fetchGameState = useCallback(
    async (initial?: boolean) => {
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
        enqueueSnackbar(e.response.data.message, { variant: 'error' });
      }
    },
    [enqueueSnackbar, gameId, getGameState, inAnimations, router],
  );

  const onChoose = (idx: number, winnerId: string) => async () => {
    try {
      setIsChooseLoading(true);
      setAnimations(Array.from({ length: 2, [idx]: winnerAnimation }));
      await choose(winnerId);
      await sleep(delayTime);
      setAnimations(getAnimationClassNames({ direction: 'Out' }));
      await sleep(delayTime);
      await fetchGameState();
      setIsChooseLoading(false);
    } catch (e: any) {
      enqueueSnackbar(e.message);
    }
  };

  useWarnIfUnsavedChanges(!isLoading && !!game && !game.finished);

  if (!isLoading && !!game && game.finished) {
    return (
      <StyledPage>
        <Typography variant="h1" className={classes.content}>
          Game is finished
        </Typography>
      </StyledPage>
    );
  }

  return (
    <Page
      subHeader={
        !isLoading && (
          <Subheader className={classes.subheader}>
            <Typography variant="h5" className={classes.title}>
              {round + 1 === totalRounds
                ? 'Final round'
                : `Round ${round + 1} | (${pairNumber} / ${pairsInRound})`}
            </Typography>
          </Subheader>
        )
      }
    >
      <div className={classes.content}>
        {!isLoading &&
          (pair as ContestItemDto[])?.map((item, i) => (
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
