import React from 'react';
import { SORT_OPTIONS, UserDto } from '@lets-choose/common';
import { NextSeo } from 'next-seo';
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
import { useUserFind } from '../../hooks/api/user';
import useQueryState from '../../hooks/getParams';
import { useContestAllInfinite } from '../../hooks/api/contest';

const avatarSize = 45;
const mobileAvatarSize = 40;

const useStyles = makeStyles((theme) => ({
  navigationSubheader: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: theme.spacing(1),
  },
  profileSubheader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1),
    color: theme.palette.text.primary,
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0.5, 1),
    },
  },
  profileSubheaderText: {
    display: 'inline-flex',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      alignItems: 'flex-start',
      flexDirection: 'column',
      '& $divider': {
        display: 'none',
      },
    },
  },
  divider: {
    width: 2,
    height: 32,
    margin: theme.spacing(0, 3),
  },
  username: {
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.9rem',
      fontWeight: theme.typography.fontWeightMedium,
    },
  },
  contestsCounter: {
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.8rem',
    },
  },
  avatar: {
    width: avatarSize,
    height: avatarSize,
    marginRight: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      width: mobileAvatarSize,
      height: mobileAvatarSize,
    },
  },
}));

export interface UserPageProps {
  initialUser: UserDto;
}

const UserPage: React.FC<UserPageProps> = ({ initialUser }) => {
  const { query: { username = initialUser.username } = {} } = useRouter() || {};
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
  const { data: userResponse, isLoading } = useUserFind(username as string, {
    initialData: { data: initialUser } as any,
  });
  const user = (userResponse?.data as UserDto) || initialUser;
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
              <Avatar src={user.avatar} className={classes.avatar} />
              <div className={classes.profileSubheaderText}>
                <Typography variant="h5" className={classes.username}>
                  @{username}
                </Typography>
                <Divider orientation="vertical" className={classes.divider} />
                <Typography variant="body1" className={classes.contestsCounter}>
                  {pages?.[0]?.data?.totalItems || 0} contests
                </Typography>
              </div>
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
              url: user.avatar,
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
