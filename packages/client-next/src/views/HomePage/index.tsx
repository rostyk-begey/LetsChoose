import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import { Contest, GetContestQuery, SORT_OPTIONS } from '@lets-choose/common';

import ContestCard from '../../components/ContestCard';
import Page from '../../components/Page';
import useGetParams from '../../hooks/getParams';
import { useContestAllInfinite } from '../../hooks/api/contest';
import ROUTES from '../../utils/routes';

const HomePage: React.FC = () => {
  const { params, handleSearch, onInputChange } = useGetParams<
    Partial<GetContestQuery>
  >(ROUTES.HOME, {
    search: '',
    sortBy: 'POPULAR',
  });
  const { data, fetchMore, canFetchMore, isSuccess } = useContestAllInfinite(
    params,
  );

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
