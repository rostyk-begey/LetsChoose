import React from 'react';
import { Grid, Loader } from 'tabler-react';
import { useParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';

import ContestCard from 'app/components/ContestCard';
import PageWithNavbar from 'app/components/PageWithNavbar';
import ProfileCard from 'app/components/ProfileCard';
import { useUserFind } from 'app/hooks/api/user';
import { useContestAllInfinite } from 'app/hooks/api/contest';
import useGetParams from 'app/hooks/getParams';
import ROUTES from 'app/utils/routes';

const SORT_OPTIONS = {
  POPULAR: 'POPULAR',
  NEWEST: 'NEWEST',
};

const UserPage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { data: { data: { _id: id, ...user } = {} } = {} } = useUserFind(
    username,
  );
  const { params, handleSearch, onInputChange } = useGetParams(
    `${ROUTES.USERS}/${username}`,
    {
      search: '',
      sortBy: SORT_OPTIONS.POPULAR,
    },
  );
  const { data, fetchMore, canFetchMore, isSuccess } = useContestAllInfinite({
    author: username,
    ...params,
  });

  return (
    <PageWithNavbar
      params={params}
      onInputChange={onInputChange}
      handleSearch={handleSearch}
    >
      <Grid.Row>
        <Grid.Col lg={4} width={12}>
          <ProfileCard user={user} />
        </Grid.Col>
        <Grid.Col lg={8} width={12}>
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
                data?.map(({ data: { contests } }) =>
                  contests.map((contest) => (
                    <Grid.Col width={12} md={6} lg={6} key={contest._id}>
                      <ContestCard data={contest} />
                    </Grid.Col>
                  )),
                )}
            </Grid.Row>
          </InfiniteScroll>
        </Grid.Col>
      </Grid.Row>
    </PageWithNavbar>
  );
};

export default UserPage;
