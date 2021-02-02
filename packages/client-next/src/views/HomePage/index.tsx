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
    fetchMore,
    canFetchMore,
    isLoading,
    refetch,
  } = useContestAllInfinite({
    search: search as string,
    sortBy: sortBy as any,
    perPage: 3,
  });

  return (
    <Page withContestNavigation>
      <Container>
        <InfiniteScroll
          pageStart={0}
          loadMore={() => fetchMore()}
          hasMore={!!canFetchMore}
        >
          <Grid container spacing={3}>
            {data?.map(({ data: { contests = [] } }) =>
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
            {(isLoading || canFetchMore) &&
              Array.from({
                length: data
                  ? 3 - data[data.length - 1].data.contests.length
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
