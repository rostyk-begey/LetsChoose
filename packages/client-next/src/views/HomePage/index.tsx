import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';

import ContestCard from '../../components/common/ContestCard';
import Page from '../../components/common/Page';
import useQueryState from '../../hooks/getParams';
import { useContestAllInfinite } from '../../hooks/api/contest';

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

  return (
    <Page withContestNavigation>
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
