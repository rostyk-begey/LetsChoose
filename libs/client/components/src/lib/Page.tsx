import React, { ReactNode } from 'react';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';
import Tooltip from '@mui/material/Tooltip';
import RouterLink from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import BrightnessHighIcon from '@mui/icons-material/BrightnessHigh';
import IconButton from '@mui/material/IconButton';
import Image from 'next/image';

import {
  useCurrentUser,
  useGoogleSignInPrompt,
} from '@lets-choose/client/hooks';
import { ROUTES } from '@lets-choose/client/utils';
import { Sidebar } from './Sidebar';
import { useDarkMode } from './ThemeProvider';
import { ContestNavigation } from './ContestNavigation';
import { Layout } from './Layout';

const PREFIX = 'Page';

const classes = {
  logo: `${PREFIX}-logo`,
};

const StyledLayout = styled(Layout)(({ theme }) => ({
  padding: theme.spacing(3, 0),
  backgroundColor: theme.palette.background.default,

  [`& .${classes.logo}`]: {
    width: 182,
    [theme.breakpoints.down('lg')]: {
      width: 150,
    },
  },
}));

const logo = '/images/logo.png';
const logoWhite = '/images/logo-white.png';

export interface PageProps {
  withContestNavigation?: boolean;
  isLoading?: boolean;
  className?: string;
  subHeader?: ReactNode;
}

const disableOneTapPages = [ROUTES.FORGOT_PASSWORD, ROUTES.GAMES.INDEX];

export const Page: React.FC<PageProps> = ({
  withContestNavigation = false,
  children,
  className,
  subHeader,
  isLoading,
}) => {
  const {
    data: user,
    remove,
    isSuccess,
    isFetched,
    refetch: refetchCurrentUser,
  } = useCurrentUser({});
  const { username = '', avatar } = user || {};
  const [darkMode, setDarkMode] = useDarkMode();
  const router = useRouter();

  const authButtons = (
    <>
      <Button
        color="primary"
        variant="outlined"
        href={ROUTES.REGISTER}
        sx={{
          mr: 1,
          ml: withContestNavigation ? 4 : 0,
          flexShrink: 0,
        }}
      >
        Sign up
      </Button>
      <Button
        sx={{
          flexShrink: 0,
        }}
        color="primary"
        href={ROUTES.LOGIN}
      >
        Log in
      </Button>
    </>
  );

  useGoogleSignInPrompt({
    enabled:
      isFetched &&
      !user &&
      !disableOneTapPages.some((path) => router.asPath.includes(path)),
  });

  const darkModeSwitch = (
    <Tooltip
      title="Toggle dark mode"
      aria-label="toggle-dark-mode"
      placement="bottom"
      PopperProps={{ disablePortal: true }}
    >
      <IconButton onClick={() => setDarkMode(!darkMode)} size="large">
        {darkMode ? <BrightnessHighIcon /> : <Brightness4Icon />}
      </IconButton>
    </Tooltip>
  );

  return (
    <StyledLayout
      title={
        <RouterLink href={ROUTES.HOME}>
          <Box sx={{ '& div': { display: 'block' } }}>
            <Image
              className={classes.logo}
              loader={({ src }) => src}
              width={182}
              height={46}
              unoptimized
              src={darkMode ? logoWhite : logo}
              alt=""
            />
          </Box>
        </RouterLink>
      }
      isLoading={isLoading}
      subHeader={subHeader}
      className={className}
      toolbarContent={
        <Box ml="auto" display="flex" alignItems="center">
          {darkModeSwitch}
          {withContestNavigation && <ContestNavigation />}
          {!user && authButtons}
        </Box>
      }
      primarySidebar={
        user
          ? ({ open, collapsed } = {}) => (
              <Sidebar
                isLoading={!isSuccess}
                username={username}
                avatar={avatar}
                open={open}
                collapsed={collapsed}
              />
            )
          : undefined
      }
    >
      {children}
    </StyledLayout>
  );
};
