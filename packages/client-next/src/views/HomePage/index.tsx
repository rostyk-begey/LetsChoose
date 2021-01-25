import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import { Contest } from '@lets-choose/common';

import ContestCard from '../../components/common/ContestCard';
import Page from '../../components/common/Page';
import useQueryState from '../../hooks/getParams';
import { useContestAllInfinite } from '../../hooks/api/contest';

const HomePage: React.FC = () => {
  const [sortBy] = useQueryState('sortBy', 'POPULAR');
  const [search] = useQueryState('search', '');
  const { data, fetchMore, canFetchMore, isSuccess } = useContestAllInfinite({
    search: search as string,
    sortBy: sortBy as any,
  });

  return (
    <Page>
      <Container>
        <InfiniteScroll
          pageStart={0}
          loadMore={() => fetchMore()}
          hasMore={canFetchMore}
          loader={
            <div className="d-flex justify-content-center">
              {/*<Loader />*/}
              loading...
            </div>
          }
        >
          <Grid container spacing={3}>
            {isSuccess &&
              data?.map(
                ({
                  data: { contests = [] },
                }: {
                  data: { contests: Contest[] };
                }) =>
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
          </Grid>
        </InfiniteScroll>
      </Container>
    </Page>
  );
};

export default HomePage;
