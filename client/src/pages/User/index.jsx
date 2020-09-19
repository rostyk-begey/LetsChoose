import React from 'react';
import { Grid, Card, Loader } from 'tabler-react';
import { useParams } from 'react-router-dom';

import ContestCard from 'app/components/ContestCard';
import { useContestAllInfinite } from 'app/hooks/api/contest';
import useGetParams from 'app/hooks/getParams';
import ROUTES from 'app/utils/routes';
import PageWithNavbar from 'app/components/PageWithNavbar';
import InfiniteScroll from 'react-infinite-scroller';

const SORT_OPTIONS = {
  POPULAR: 'POPULAR',
  NEWEST: 'NEWEST',
};

const UserPage = () => {
  const { username } = useParams();
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
          <Card className="card-profile">
            <Card.Header backgroundURL="https://preview.tabler.io/demo/photos/eberhard-grossgasteiger-311213-500.jpg" />
            <Card.Body className="text-center">
              <img
                alt=""
                className="card-profile-img"
                src="https://preview.tabler.io/demo/faces/male/16.jpg"
              />
              <h3 className="mb-3">Peter Richards</h3>
              <p className="mb-4">
                Big belly rude boy, million dollar hustler. Unemployed.
              </p>
              <button type="button" className="btn btn-outline-primary btn-sm">
                <span className="fa fa-twitter" /> Follow
              </button>
            </Card.Body>
          </Card>
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
