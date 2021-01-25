import React from 'react';
import { useRouter } from 'next/router';
import InfiniteScroll from 'react-infinite-scroller';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import { Contest, UserDto } from '@lets-choose/common';

import ContestCard from '../../components/common/ContestCard';
import Page from '../../components/common/Page';
import ProfileCard from '../../components/common/ProfileCard';
import { useUserFindRedirect } from '../../hooks/api/user';
import useQueryState from '../../hooks/getParams';
import { useContestAllInfinite } from '../../hooks/api/contest';
import ROUTES from '../../utils/routes';

const UserPage: React.FC = () => {
  const {
    query: { username },
  } = useRouter();
  const [sortBy] = useQueryState('sortBy', 'POPULAR');
  const [search] = useQueryState('search', '');
  const { data, fetchMore, canFetchMore, isSuccess } = useContestAllInfinite({
    search: search as string,
    sortBy: sortBy as any,
    author: username as string,
  });
  const { data: { data: user = {} } = {} } = useUserFindRedirect(username, {
    redirectTo: ROUTES.HOME,
  });

  return (
    <Page>
      <Container>
        <Grid container spacing={3}>
          <Grid item md={4} xs={12}>
            <ProfileCard user={user as UserDto} />
          </Grid>
          <Grid item md={8} xs={12}>
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
                          sm={6}
                          xs={12}
                        >
                          <ContestCard contest={contest} />
                        </Grid>
                      )),
                  )}
              </Grid>
            </InfiniteScroll>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default UserPage;
