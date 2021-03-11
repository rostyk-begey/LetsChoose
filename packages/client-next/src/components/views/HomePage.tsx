import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import InfiniteScroll from 'react-infinite-scroller';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import json2mq from 'json2mq';

import ContestCard from '../common/ContestCard';
import ContestNavigation from '../common/ContestNavigation';
import Page from '../common/Page';
import useQueryState from '../../hooks/getParams';
import { useContestAllInfinite } from '../../hooks/api/contest';
import Subheader from '../common/Subheader';

const useStyles = makeStyles({
  subheader: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
});

const HomePage: React.FC = () => {
  const [sortBy] = useQueryState('sortBy', 'POPULAR');
  const [search] = useQueryState('search', '');
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    refetch,
  } = useContestAllInfinite({
    search: search as string,
    sortBy: sortBy as any,
    perPage: 3,
  });
  const pages = data?.pages || [];
  const matchesMaxWidth1024 = useMediaQuery(
    json2mq({
      maxWidth: 1024,
    }),
  );
  const classes = useStyles();

  return (
    <Page
      withContestNavigation={!matchesMaxWidth1024}
      subHeader={
        matchesMaxWidth1024 && (
          <Subheader className={classes.subheader} animated>
            <ContestNavigation />
          </Subheader>
        )
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
                  <ContestCard contest={contest} onDelete={refetch} />
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

export default HomePage;
