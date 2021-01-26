import { Drawer } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import RouterLink from 'next/link';
import React from 'react';
import { useRouter } from 'next/router';
import InfiniteScroll from 'react-infinite-scroller';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import { Contest, UserDto } from '@lets-choose/common';
import Layout, { Root, getSubheader } from '@mui-treasury/layout';
import styled from 'styled-components';

import ContestCard from '../../components/common/ContestCard';
import Page from '../../components/common/Page';
import { useUserFindRedirect } from '../../hooks/api/user';
import useQueryState from '../../hooks/getParams';
import { useContestAllInfinite } from '../../hooks/api/contest';
import ROUTES from '../../utils/routes';

const Subheader = getSubheader(styled);

const useStyles = makeStyles((theme) => ({
  profileHeader: {
    backgroundColor: theme.palette.background.default,
  },
  username: {
    marginLeft: theme.spacing(1),
  },
  avatar: {
    width: 64,
    height: 64,
  },
}));

const UserPage: React.FC = () => {
  const {
    query: { username },
  } = useRouter();
  const classes = useStyles();
  const [sortBy] = useQueryState('sortBy', 'POPULAR');
  const [search] = useQueryState('search', '');
  const { data, fetchMore, canFetchMore, isSuccess } = useContestAllInfinite({
    search: search as string,
    sortBy: sortBy as any,
    author: username as string,
  });
  const { data: { data: user } = {} } = useUserFindRedirect(username, {
    redirectTo: ROUTES.HOME,
  });
  const { avatar } = user || {};

  return (
    <Page
      withContestNavigation
      subHeader={
        <Subheader
          subheaderId="profileHeader"
          className={classes.profileHeader}
        >
          <Box px={2} py={1} display="flex" alignItems="center">
            <Avatar src={avatar} className={classes.avatar} />
            <Typography variant="h5" className={classes.username}>
              @{username}
            </Typography>
          </Box>
          <Divider />
        </Subheader>
      }
    >
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

export default UserPage;
