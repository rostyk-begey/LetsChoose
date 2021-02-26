import React from 'react';
import { useRouter } from 'next/router';
import { Contest, ContestItem } from '@lets-choose/common';
import Chip from '@material-ui/core/Chip';
import { Theme } from '@material-ui/core/styles';
import Skeleton from '@material-ui/lab/Skeleton';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import PlayCircleFilledWhiteIcon from '@material-ui/icons/PlayCircleFilledWhite';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import RecentActorsRoundedIcon from '@material-ui/icons/RecentActorsRounded';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import makeStyles from '@material-ui/core/styles/makeStyles';
import InfiniteScroll from 'react-infinite-scroller';

import {
  useContestFind,
  useContestItemsInfinite,
} from '../../../hooks/api/contest';
import { useGameStart } from '../../../hooks/api/game';
import ROUTES from '../../../utils/routes';
import Page from '../../common/Page';
import Subheader from '../../common/Subheader';
import Table from './Table';

const useStyles = makeStyles(({ breakpoints, ...theme }: Theme) => ({
  root: {
    display: 'flex',
  },
  content: {
    margin: 'auto',
  },
  subheader: {
    display: 'flex',
    alignItems: 'center',
  },
  playBtn: {
    marginLeft: 'auto',
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
  subheaderStats: {
    display: 'flex',
    alignItems: 'center',
    [breakpoints.down('sm')]: {
      display: 'none',
    },
    // marginLeft: theme.spacing(2),
  },
  contestContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  contestActionsBar: {
    padding: theme.spacing(2),
    marginTop: 'auto',
    display: 'flex',
    alignItems: 'center',
  },
  chip: {
    margin: theme.spacing(0.5),
  },
}));

const itemsPerPage = 10;

const ContestPage: React.FC = () => {
  const {
    query: { contestId },
    ...router
  } = useRouter();

  const { data, isLoading: contestIsLoading } = useContestFind(
    contestId as string,
  );
  const contest = (data?.data as Contest) || null;
  const classes = useStyles({ thumbnail: contest?.thumbnail || '' });
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
  } = useContestItemsInfinite(
    contestId as string,
    { perPage: itemsPerPage },
    { enabled: !!contest },
  );
  const isLoading = contestIsLoading || contestItemsIsLoading;
  const pages = contestItemsData?.pages || [];
  const { totalItems = 0 } = pages?.[0]?.data || {};

  if (!isLoading && !contest) {
    return (
      <Page className={classes.root}>
        <Typography variant="h1" className={classes.content}>
          Contest not found...
        </Typography>
      </Page>
    );
  }
  const thumbnail = contest?.thumbnail.replace(
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
      label={`${contest?.games} Games`}
      className={classes.chip}
    />
  );

  return (
    <Page
      subHeader={
        contest ? (
          <Subheader className={classes.subheader}>
            <Typography variant="h5">{contest.title}</Typography>
            <div className={classes.subheaderStats}>
              <Divider orientation="vertical" className={classes.divider} />
              {itemsChip}
              {gamesChip}
            </div>
            <Button
              color="primary"
              variant="contained"
              onClick={onStartGame}
              className={classes.playBtn}
              startIcon={<PlayCircleFilledWhiteIcon />}
            >
              Play
            </Button>
          </Subheader>
        ) : (
          <Subheader className={classes.subheader}>
            <Skeleton animation="wave" width={200} height={32} />
            <div className={classes.subheaderStats}>
              <Divider orientation="vertical" className={classes.divider} />
              <Skeleton
                animation="wave"
                width={100}
                height={24}
                className={classes.chip}
              />
              <Skeleton
                animation="wave"
                width={100}
                height={24}
                className={classes.chip}
              />
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
      <Container>
        <Grid container spacing={2} justify="center">
          <Grid item xs={12}>
            <Card>
              <Grid container>
                <Grid item md={5} xs={12}>
                  <figure className={classes.thumbnailContainer}>
                    {contest ? (
                      <img
                        src={thumbnail}
                        className={classes.thumbnail}
                        alt=""
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
                </Grid>
                <Grid item md={7} xs={12} className={classes.contestContent}>
                  {contest ? (
                    <>
                      <CardContent>
                        <Typography variant="h3" gutterBottom>
                          {contest.title}
                        </Typography>
                        <Typography variant="body1">
                          {contest.excerpt}
                        </Typography>
                      </CardContent>
                      <div className={classes.contestActionsBar}>
                        {itemsChip}
                        {gamesChip}
                        <Button
                          size="small"
                          color="primary"
                          variant="contained"
                          onClick={onStartGame}
                          className={classes.playBtn}
                          startIcon={<PlayCircleFilledWhiteIcon />}
                        >
                          Play
                        </Button>
                      </div>
                    </>
                  ) : (
                    <CardContent>
                      <Skeleton animation="wave" width="45%" height={56} />
                      <Skeleton animation="wave" width="20%" height={24} />
                    </CardContent>
                  )}
                </Grid>
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
                          [] as ContestItem[],
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

export default ContestPage;
