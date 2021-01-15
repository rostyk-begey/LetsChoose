import Router, { useRouter } from 'next/router';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import { Contest, GetContestQuery, SORT_OPTIONS } from '@lets-choose/common';
import { useLocationState } from 'use-location-state';

import ContestCard from '../../components/common/ContestCard';
import Menu from '../../components/common/Menu';
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
    <Page subMenu={<Menu />}>
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
          <Grid container justify="space-evenly" spacing={5}>
            {isSuccess &&
              data?.map(
                ({
                  data: { contests = [] },
                }: {
                  data: { contests: Contest[] };
                }) =>
                  contests.map((contest) => (
                    <Grid item key={contest.id} xs={4}>
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
