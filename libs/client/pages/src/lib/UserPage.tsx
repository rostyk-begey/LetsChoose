import React from 'react';
import { SORT_OPTIONS, UserPublicDto } from '@lets-choose/common/dto';
import { NextSeo } from 'next-seo';
import { styled, Theme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';
import json2mq from 'json2mq';

import {
  ContestGrid,
  ContestNavigation,
  Page,
  Subheader,
} from '@lets-choose/client/components';
import {
  useUserFind,
  useQueryState,
  useContestAllInfinite,
} from '@lets-choose/client/hooks';

const avatarSize = 45;
const mobileAvatarSize = 40;

const PREFIX = 'UserPage';
const classes = {
  navigationSubheader: `${PREFIX}-navigationSubheader`,
  profileSubheader: `${PREFIX}-profileSubheader`,
  profileSubheaderText: `${PREFIX}-profileSubheaderText`,
  divider: `${PREFIX}-divider`,
  username: `${PREFIX}-username`,
  contestsCounter: `${PREFIX}-contestsCounter`,
  avatar: `${PREFIX}-avatar`,
};

const StyledSubheader = styled(Subheader)(({ theme }) => ({
  [`&.${classes.navigationSubheader}`]: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: theme.spacing(1),
  },

  [`&.${classes.profileSubheader}`]: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1),
    color: theme.palette.text.primary,
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(0.5, 1),
    },
  },

  [`& .${classes.profileSubheaderText}`]: {
    display: 'inline-flex',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      alignItems: 'flex-start',
      flexDirection: 'column',
    },
  },

  [`& .${classes.divider}`]: {
    width: 2,
    height: 32,
    margin: theme.spacing(0, 3),
    [theme.breakpoints.down('md')]: { display: 'none' },
  },
  [`& .${classes.username}`]: {
    [theme.breakpoints.down('md')]: {
      fontSize: '0.9rem',
      fontWeight: theme.typography.fontWeightMedium,
    },
  },
  [`& .${classes.contestsCounter}`]: {
    [theme.breakpoints.down('md')]: {
      fontSize: '0.8rem',
    },
  },
  [`& .${classes.avatar}`]: {
    width: avatarSize,
    height: avatarSize,
    marginRight: theme.spacing(1),
    [theme.breakpoints.down('md')]: {
      width: mobileAvatarSize,
      height: mobileAvatarSize,
    },
  },
}));

export interface UserPageProps {
  initialUser: UserPublicDto;
}

export const UserPage: React.FC<UserPageProps> = ({ initialUser }) => {
  const { query: { username = initialUser.username } = {} } = useRouter() || {};
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
    initialData: initialUser as never,
  });
  const user = userResponse || initialUser;
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
            <StyledSubheader className={classes.profileSubheader}>
              <Skeleton
                animation="wave"
                variant="circular"
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
            </StyledSubheader>
          ) : (
            <StyledSubheader className={classes.profileSubheader}>
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
            </StyledSubheader>
          )}
          {matchesMaxWidth1024 && (
            <Subheader className={classes.navigationSubheader} animated>
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
