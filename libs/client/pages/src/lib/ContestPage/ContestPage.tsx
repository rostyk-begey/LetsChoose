import {
  DropdownButton,
  Page,
  Subheader,
} from '@lets-choose/client/components';

import {
  useContestDelete,
  useContestFind,
  useContestItemsInfinite,
  useContestReset,
  useCurrentUser,
  useGameStart,
} from '@lets-choose/client/hooks';
import { cloudinaryUploadPath, ROUTES } from '@lets-choose/client/utils';
import { ContestDto, ContestItemDto } from '@lets-choose/common/dto';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Chip from '@material-ui/core/Chip';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import PlayCircleFilledWhiteIcon from '@material-ui/icons/PlayCircleFilledWhite';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import RecentActorsRoundedIcon from '@material-ui/icons/RecentActorsRounded';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import Skeleton from '@material-ui/lab/Skeleton';
import { AxiosResponse } from 'axios';
import { NextSeo } from 'next-seo';
import Image from 'next/image';
import { NextRouter, useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { Table } from './Table';

const useStyles = makeStyles(({ breakpoints, ...theme }: Theme) => ({
  headerTitle: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    marginRight: theme.spacing(2),
    fontSize: '1.2rem',
    fontWeight: theme.typography.fontWeightMedium,
    [breakpoints.down('md')]: {
      fontSize: '1.1rem',
    },
  },
  subheader: {
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.text.primary,
    [breakpoints.down('sm')]: {
      padding: theme.spacing(1, 1.5),
    },
  },
  container: {
    [breakpoints.down('sm')]: {
      padding: theme.spacing(0, 1.5),
    },
  },
  playBtn: {
    color: theme.palette.common.white,
    marginLeft: 'auto',
  },
  actionButtonIcon: {
    marginRight: theme.spacing(0.5),
  },
  thumbnailContainer: {
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    paddingBottom: '75%',
    position: 'relative',
    overflow: 'hidden',
    padding: 0,
    margin: 0,
  },
  thumbnail: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  divider: {
    width: 2,
    height: 32,
    margin: theme.spacing(0, 3),
  },
  subheaderText: {},
  subheaderStats: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.8rem',
    color: theme.palette.text.secondary,
    '& > span': {
      display: 'inline-flex',
      alignItems: 'center',
      marginRight: theme.spacing(0.5),
      '& > svg': {
        fontSize: '1.2rem',
        marginRight: 2,
      },
    },
  },
  contestContentCard: {
    display: 'grid',
    gridTemplateColumns: '40% auto',
    '@media (max-width: 768px)': {
      display: 'block',
    },
  },
  contestContent: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
    [breakpoints.down('sm')]: {
      padding: theme.spacing(1.5),
    },
    [breakpoints.down('xs')]: {
      padding: theme.spacing(2, 1, 1),
    },
  },
  contestContentText: {
    padding: 0,
  },
  contestContentTitle: {
    [breakpoints.down('md')]: {
      fontSize: '1.3rem',
      fontWeight: theme.typography.fontWeightMedium,
    },
    [breakpoints.down('sm')]: {
      fontSize: '1.1rem',
    },
  },
  contestContentExcerpt: {
    [breakpoints.down('md')]: {
      fontSize: '1rem',
    },
    [breakpoints.down('sm')]: {
      fontSize: '0.9rem',
    },
  },
  contestActionsBar: {
    paddingTop: theme.spacing(2),
    marginTop: 'auto',
    display: 'flex',
    alignItems: 'center',
  },
  chip: {
    marginRight: theme.spacing(0.5),
  },
}));

const itemsPerPage = 10;

export interface ContestPageProps {
  initialContest: ContestDto;
}

export const ContestPage: React.FC<ContestPageProps> = ({ initialContest }) => {
  const { id: contestId } = initialContest;
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const {
    data: contestResponse,
    isLoading: contestIsLoading,
    remove: removeContest,
  } = useContestFind(contestId as string, {
    initialData: { data: initialContest } as AxiosResponse<ContestDto>,
  });
  const { data: { data: user } = {} } = useCurrentUser({});
  const contest = (contestResponse?.data as ContestDto) || initialContest;
  const isCurrentUserAuthor = user?.id === contest.author;
  const classes = useStyles({ thumbnail: contest.thumbnail || '' });
  const { mutateAsync: startGame } = useGameStart();
  const onStartGame = async () => {
    const { data: { gameId = null } = {} } =
      (await startGame(contestId as string)) || {};
    await router.push(`${ROUTES.GAMES.INDEX}/${gameId}`);
  };
  const {
    data: contestItemsData,
    fetchNextPage,
    hasNextPage,
    isLoading: contestItemsIsLoading,
    remove: removeContestItems,
  } = useContestItemsInfinite(
    contestId as string,
    { perPage: itemsPerPage },
    { enabled: !!contest },
  );
  const isLoading = contestIsLoading || contestItemsIsLoading;
  const pages = contestItemsData?.pages || [];
  const { totalItems = 0 } = pages?.[0]?.data || {};
  const { mutateAsync: resetContest } = useContestReset(contest.id);
  const { mutateAsync: deleteContest } = useContestDelete(contest.id);

  const thumbnail = contest.thumbnail.replace(
    'image/upload',
    'image/upload/c_fill,ar_4:3',
  );
  const itemsChip = (
    <Chip
      icon={<RecentActorsRoundedIcon />}
      label={`${totalItems} Items`}
      className={classes.chip}
    />
  );
  const gamesChip = (
    <Chip
      icon={<PlayCircleOutlineIcon />}
      label={`${contest.games} Games`}
      className={classes.chip}
    />
  );
  const chipSkeleton = (
    <Skeleton
      animation="wave"
      width={100}
      height={24}
      className={classes.chip}
    />
  );

  return (
    <Page
      subHeader={
        contest ? (
          <Subheader className={classes.subheader}>
            <div className={classes.subheaderText}>
              <Typography variant="h5" className={classes.headerTitle}>
                {contest.title}
              </Typography>
              <div className={classes.subheaderStats}>
                <span>
                  <RecentActorsRoundedIcon />
                  {totalItems} Items
                </span>
                <span>
                  <PlayCircleOutlineIcon />
                  {contest.games} Games
                </span>
              </div>
            </div>
            {isCurrentUserAuthor ? (
              <DropdownButton
                className={classes.playBtn}
                mainButtonProps={{
                  startIcon: <PlayCircleFilledWhiteIcon />,
                  children: 'Play',
                  onClick: onStartGame,
                }}
                items={[
                  {
                    content: (
                      <>
                        <ListItemIcon>
                          <EditIcon />
                        </ListItemIcon>
                        Edit
                      </>
                    ),
                    onClick: () => {
                      router.push(`${ROUTES.CONTESTS.INDEX}/${contestId}/edit`);
                    },
                  },
                  {
                    content: (
                      <>
                        <ListItemIcon>
                          <RotateLeftIcon />
                        </ListItemIcon>
                        Reset
                      </>
                    ),
                    onClick: async () => {
                      if (
                        window.confirm(
                          'Are you sure you want to reset contest? All data will be reset to defaults.',
                        )
                      ) {
                        await resetContest();
                        await removeContest();
                        await removeContestItems();
                        enqueueSnackbar('Contest successfully reset', {
                          variant: 'success',
                        });
                      }
                    },
                  },
                  {
                    content: (
                      <>
                        <ListItemIcon>
                          <DeleteIcon />
                        </ListItemIcon>
                        Delete
                      </>
                    ),
                    onClick: async () => {
                      if (window.confirm('Are you sure you want to delete?')) {
                        await deleteContest();
                        await router.push(ROUTES.HOME);

                        enqueueSnackbar('Contest successfully deleted', {
                          variant: 'success',
                        });
                      }
                    },
                  },
                ]}
              />
            ) : (
              <Button
                color="secondary"
                variant="contained"
                onClick={onStartGame}
                className={classes.playBtn}
                startIcon={<PlayCircleFilledWhiteIcon />}
              >
                Play
              </Button>
            )}
          </Subheader>
        ) : (
          <Subheader className={classes.subheader}>
            <Skeleton animation="wave" width={200} height={32} />
            <div className={classes.subheaderStats}>
              <Divider orientation="vertical" className={classes.divider} />
              {chipSkeleton}
              {chipSkeleton}
            </div>
            <Skeleton
              animation="wave"
              width={100}
              height={60}
              className={classes.playBtn}
            />
          </Subheader>
        )
      }
    >
      <NextSeo
        title={initialContest.title}
        description={initialContest.excerpt}
        openGraph={{
          title: initialContest.title,
          ...(initialContest.excerpt && {
            description: initialContest.excerpt,
          }),
          images: [
            {
              url: initialContest.thumbnail,
              alt: initialContest.title,
            },
          ],
        }}
      />
      <Container className={classes.container}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12}>
            <Card>
              <Grid container className={classes.contestContentCard}>
                <figure className={classes.thumbnailContainer}>
                  {contest ? (
                    <Image
                      src={cloudinaryUploadPath(thumbnail)}
                      className={classes.thumbnail}
                      alt=""
                      layout="fill"
                    />
                  ) : (
                    <Skeleton
                      animation="wave"
                      width="100%"
                      height="100%"
                      variant="rect"
                      className={classes.thumbnail}
                    />
                  )}
                </figure>
                <div className={classes.contestContent}>
                  {contest ? (
                    <>
                      <CardContent className={classes.contestContentText}>
                        <Typography
                          variant="h4"
                          className={classes.contestContentTitle}
                          gutterBottom
                        >
                          {contest.title}
                        </Typography>
                        <Typography
                          variant="body1"
                          className={classes.contestContentExcerpt}
                        >
                          {contest.excerpt}
                        </Typography>
                      </CardContent>
                      <div className={classes.contestActionsBar}>
                        {itemsChip}
                        {gamesChip}
                        <Fab
                          color="secondary"
                          variant="extended"
                          size="small"
                          className={classes.playBtn}
                          onClick={onStartGame}
                        >
                          <PlayCircleFilledWhiteIcon
                            fontSize="small"
                            className={classes.actionButtonIcon}
                          />
                          Play
                        </Fab>
                      </div>
                    </>
                  ) : (
                    <>
                      <CardContent>
                        <Skeleton animation="wave" width="45%" height={56} />
                        <Skeleton animation="wave" width="20%" height={24} />
                      </CardContent>
                      <div className={classes.contestActionsBar}>
                        {chipSkeleton}
                        {chipSkeleton}
                        <Skeleton
                          animation="wave"
                          width={100}
                          height={24}
                          className={classes.playBtn}
                        />
                      </div>
                    </>
                  )}
                </div>
              </Grid>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <InfiniteScroll
                pageStart={0}
                loadMore={() => fetchNextPage()}
                hasMore={!!hasNextPage}
              >
                <Table
                  data={
                    isLoading
                      ? Array.from({ length: 4 }).fill(0)
                      : pages.reduce(
                          (acc, { data: { items } }) => [...acc, ...items],
                          [] as ContestItemDto[],
                        )
                  }
                  skeleton={isLoading}
                />
              </InfiniteScroll>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};
