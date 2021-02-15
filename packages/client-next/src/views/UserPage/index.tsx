import { Skeleton } from '@material-ui/lab';
import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import { useRouter } from 'next/router';
import InfiniteScroll from 'react-infinite-scroller';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';

import ContestCard from '../../components/common/ContestCard';
import Page from '../../components/common/Page';
import Subheader from '../../components/common/Subheader';
import { useUserFindRedirect } from '../../hooks/api/user';
import useQueryState from '../../hooks/getParams';
import { useContestAllInfinite } from '../../hooks/api/contest';
import ROUTES from '../../utils/routes';

const useStyles = makeStyles((theme) => ({
  subheader: {
    display: 'flex',
    alignItems: 'center',
  },
  username: {
    marginLeft: theme.spacing(1),
  },
  counter: {
    marginLeft: theme.spacing(3),
  },
  avatar: {
    width: 64,
    height: 64,
  },
}));

const UserPage: React.FC = () => {
  const {
    query: { username },
  } = useRouter();
  const classes = useStyles();
  const [sortBy] = useQueryState('sortBy', 'POPULAR');
  const [search] = useQueryState('search', '');
  const { data, fetchNextPage, hasNextPage } = useContestAllInfinite({
    search: search as string,
    sortBy: sortBy as any,
    author: username as string,
    perPage: 3,
  });
  const pages = data?.pages || [];
  const { data: { data: user } = {}, isLoading } = useUserFindRedirect(
    username,
    {
      redirectTo: ROUTES.HOME,
    },
  );
  const { avatar } = user || {};

  return (
    <Page
      withContestNavigation
      subHeader={
        <Subheader className={classes.subheader}>
          {isLoading ? (
            <Skeleton
              animation="wave"
              variant="circle"
              className={classes.avatar}
            />
          ) : (
            <Avatar src={avatar} className={classes.avatar} />
          )}
          {isLoading ? (
            <Skeleton
              animation="wave"
              height={24}
              width={180}
              className={classes.username}
            />
          ) : (
            <Typography variant="h5" className={classes.username}>
              @{username}
            </Typography>
          )}
          {isLoading ? (
            <Skeleton
              animation="wave"
              height={16}
              width={100}
              className={classes.counter}
            />
          ) : (
            <Typography variant="body1" className={classes.counter}>
              {data?.[0]?.data?.totalItems} contests
            </Typography>
          )}
        </Subheader>
      }
    >
      <Container>
        <InfiniteScroll
          pageStart={0}
          loadMore={() => fetchNextPage()}
          hasMore={!!hasNextPage}
        >
          <Grid container spacing={3}>
            {pages.map(({ data: { contests = [] } }) =>
              contests.map((contest) => (
                <Grid
                  item
                  container
                  justify="center"
                  key={contest.id}
                  md={4}
                  sm={6}
                  xs={12}
                >
                  <ContestCard contest={contest} />
                </Grid>
              )),
            )}
            {(isLoading || hasNextPage) &&
              Array.from({
                length: pages.length
                  ? 3 - pages[pages.length - 1].data.contests.length
                  : 3,
              }).map((_, i) => (
                <Grid
                  item
                  container
                  justify="center"
                  key={i}
                  md={4}
                  sm={6}
                  xs={12}
                >
                  <ContestCard />
                </Grid>
              ))}
          </Grid>
        </InfiniteScroll>
      </Container>
    </Page>
  );
};

export default UserPage;
