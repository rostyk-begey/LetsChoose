import { SORT_OPTIONS } from '@lets-choose/common';
import { NextSeo } from 'next-seo';
import React from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Divider from '@material-ui/core/Divider';
import Skeleton from '@material-ui/lab/Skeleton';
import Avatar from '@material-ui/core/Avatar';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import { useRouter } from 'next/router';
import json2mq from 'json2mq';

import ContestGrid from '../common/ContestGrid';
import ContestNavigation from '../common/ContestNavigation';
import {
  PRIMARY_SUBHEADER_ID,
  SECONDARY_SUBHEADER_ID,
} from '../common/Layout/constants';
import Page from '../common/Page';
import Subheader from '../common/Subheader';
import { useUserFindRedirect } from '../../hooks/api/user';
import useQueryState from '../../hooks/getParams';
import { useContestAllInfinite } from '../../hooks/api/contest';

const avatarSize = 45;

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
    width: avatarSize,
    height: avatarSize,
  },
}));

const UserPage: React.FC = () => {
  const {
    query: { username },
  } = useRouter();
  const classes = useStyles();
  const [sortBy] = useQueryState('sortBy', 'POPULAR');
  const [search] = useQueryState('search', '');
  const { data } = useContestAllInfinite({
    search: search as string,
    sortBy: sortBy as '' | keyof typeof SORT_OPTIONS,
    author: username as string,
    perPage: 3,
  });
  const pages = data?.pages || [];
  const { data: { data: user } = {}, isLoading } = useUserFindRedirect(
    username,
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
          {isLoading ? (
            <Subheader
              id={PRIMARY_SUBHEADER_ID}
              className={classes.profileSubheader}
              style={{ zIndex: 1001 }}
            >
              <Skeleton
                animation="wave"
                variant="circle"
                className={classes.avatar}
              />
              <Skeleton
                animation="wave"
                height={24}
                width={180}
                className={classes.username}
              />
              <Divider orientation="vertical" className={classes.divider} />
              <Skeleton animation="wave" height={16} width={100} />
            </Subheader>
          ) : (
            <Subheader
              id={PRIMARY_SUBHEADER_ID}
              className={classes.profileSubheader}
              style={{ zIndex: 1001 }}
            >
              <Avatar src={avatar} className={classes.avatar} />
              <Typography variant="h5" className={classes.username}>
                @{username}
              </Typography>
              <Divider orientation="vertical" className={classes.divider} />
              <Typography variant="body1">
                {pages?.[0]?.data?.totalItems || 0} contests
              </Typography>
            </Subheader>
          )}
          {matchesMaxWidth1024 && (
            <Subheader
              id={SECONDARY_SUBHEADER_ID}
              className={classes.navigationSubheader}
              animated
            >
              <ContestNavigation />
            </Subheader>
          )}
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
      <ContestGrid author={username as string} />
    </Page>
  );
};

export default UserPage;
