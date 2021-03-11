import { NextSeo } from 'next-seo';
import React from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Divider from '@material-ui/core/Divider';
import Skeleton from '@material-ui/lab/Skeleton';
import Avatar from '@material-ui/core/Avatar';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import { useRouter } from 'next/router';
import InfiniteScroll from 'react-infinite-scroller';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import json2mq from 'json2mq';

import ContestCard from '../common/ContestCard';
import ContestNavigation from '../common/ContestNavigation';
import Page from '../common/Page';
import Subheader from '../common/Subheader';
import { useUserFindRedirect } from '../../hooks/api/user';
import useQueryState from '../../hooks/getParams';
import { useContestAllInfinite } from '../../hooks/api/contest';
import ROUTES from '../../utils/routes';
import {
  PRIMARY_SUBHEADER_ID,
  SECONDARY_SUBHEADER_HEIGHT,
  SECONDARY_SUBHEADER_ID,
} from '../../utils/constants';

const useStyles = makeStyles((theme) => ({
  navigationSubheader: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  profileSubheader: {
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.text.primary,
  },
  divider: {
    width: 2,
    height: 32,
    margin: theme.spacing(0, 3),
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
  const { data, fetchNextPage, hasNextPage } = useContestAllInfinite({
    search: search as string,
    sortBy: sortBy as any,
    author: username as string,
    perPage: 3,
  });
  const pages = data?.pages || [];
  const { data: { data: user } = {}, isLoading } = useUserFindRedirect(
    username,
    {
      redirectTo: ROUTES.HOME,
    },
  );
  const { avatar } = user || {};
  const matchesMaxWidth1024 = useMediaQuery(
    json2mq({
      maxWidth: 1024,
    }),
  );

  return (
    <Page
      withContestNavigation={!matchesMaxWidth1024}
      subHeader={
        <>
          {matchesMaxWidth1024 && (
            <Subheader className={classes.navigationSubheader}>
              <ContestNavigation />
            </Subheader>
          )}
          <Subheader
            id={
              matchesMaxWidth1024
                ? SECONDARY_SUBHEADER_ID
                : PRIMARY_SUBHEADER_ID
            }
            height={SECONDARY_SUBHEADER_HEIGHT}
            className={classes.profileSubheader}
            animated
          >
            {isLoading ? (
              <Skeleton
                animation="wave"
                variant="circle"
                className={classes.avatar}
              />
            ) : (
              <Avatar src={avatar} className={classes.avatar} />
            )}
            {isLoading ? (
              <Skeleton
                animation="wave"
                height={24}
                width={180}
                className={classes.username}
              />
            ) : (
              <Typography variant="h5" className={classes.username}>
                @{username}
              </Typography>
            )}
            <Divider orientation="vertical" className={classes.divider} />
            {isLoading ? (
              <Skeleton animation="wave" height={16} width={100} />
            ) : (
              <Typography variant="body1">
                {pages?.[0]?.data?.totalItems || 0} contests
              </Typography>
            )}
          </Subheader>
        </>
      }
    >
      <NextSeo
        title={`@${username}`}
        openGraph={{
          title: `@${username}`,
          images: [
            {
              url: user?.avatar as string,
              alt: `@${username}`,
            },
          ],
        }}
      />
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
                  <ContestCard contest={contest} />
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

export default UserPage;
