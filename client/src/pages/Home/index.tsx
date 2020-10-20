import React from 'react';
// @ts-ignore
import { Grid, Loader } from 'tabler-react';
import InfiniteScroll from 'react-infinite-scroller';

import ContestCard from '../../components/ContestCard';
import { useContestAllInfinite } from '../../hooks/api/contest';
import useGetParams from '../../hooks/getParams';
import ROUTES from '../../utils/routes';
import PageWithNavbar from '../../components/PageWithNavbar';
import { Contest } from '../../../../server/models/Contest';

const SORT_OPTIONS = {
  POPULAR: 'POPULAR',
  NEWEST: 'NEWEST',
};

const HomePage: React.FC = () => {
  const { params, handleSearch, onInputChange } = useGetParams(ROUTES.HOME, {
    search: '',
    sortBy: SORT_OPTIONS.POPULAR,
  });
  const { data, fetchMore, canFetchMore, isSuccess } = useContestAllInfinite(
    params,
  );

  return (
    <PageWithNavbar
      // @ts-ignore
      params={params}
      handleSearch={handleSearch}
      onInputChange={onInputChange}
    >
      <InfiniteScroll
        pageStart={0}
        loadMore={() => fetchMore()}
        hasMore={canFetchMore}
        loader={
          <div className="d-flex justify-content-center">
            <Loader />
          </div>
        }
      >
        <Grid.Row>
          {isSuccess &&
            data?.map(
              ({
                data: { contests = [] },
              }: {
                data: { contests: Contest[] };
              }) =>
                contests.map((contest) => (
                  <Grid.Col width={12} md={6} lg={4} key={contest._id}>
                    {/* @ts-ignore */}
                    <ContestCard data={contest} />
                  </Grid.Col>
                )),
            )}
        </Grid.Row>
      </InfiniteScroll>
    </PageWithNavbar>
  );
};

export default HomePage;
