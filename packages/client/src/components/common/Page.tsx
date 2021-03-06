import React, { ReactNode } from 'react';
import { useRouter } from 'next/router';
import Tooltip from '@material-ui/core/Tooltip';
import RouterLink from 'next/link';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import BrightnessHighIcon from '@material-ui/icons/BrightnessHigh';
import IconButton from '@material-ui/core/IconButton';
import classNames from 'classnames';
import Image from 'next/image';

import { useCurrentUser } from '../../hooks/api/user';
import useGoogleSignInPrompt from '../../hooks/googleSignInPrompt';
import Sidebar from './Sidebar';
import { useDarkMode } from './ThemeProvider';
import ROUTES from '../../utils/routes';
import ContestNavigation from './ContestNavigation';
import Layout from './Layout';
import logo from '../../../public/images/logo.png';
import logoWhite from '../../../public/images/logo-white.png';

interface Props {
  withContestNavigation?: boolean;
  className?: string;
  subHeader?: ReactNode;
}

const useStyles = makeStyles((theme) => ({
  content: {
    padding: theme.spacing(3, 0),
    backgroundColor: theme.palette.background.default,
  },
  signupBtn: ({
    withContestNavigation,
  }: {
    withContestNavigation: boolean;
  }) => ({
    marginRight: theme.spacing(1),
    marginLeft: withContestNavigation ? theme.spacing(4) : 0,
    flexShrink: 0,
  }),
  loginBtn: {
    flexShrink: 0,
  },
  logo: {
    [theme.breakpoints.down('md')]: {
      width: 150,
    },
  },
}));

const disableOneTapPages = [ROUTES.FORGOT_PASSWORD, ROUTES.GAMES.INDEX];

const Page: React.FC<Props> = ({
  withContestNavigation = false,
  children,
  className,
  subHeader,
}) => {
  const classes = useStyles({ withContestNavigation });
  const {
    data: { data: user } = {},
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
        className={classes.signupBtn}
        href={ROUTES.REGISTER}
      >
        Sign up
      </Button>
      <Button className={classes.loginBtn} color="primary" href={ROUTES.LOGIN}>
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
    <div>
      <Tooltip
        title="Toggle dark mode"
        aria-label="toggle-dark-mode"
        placement="bottom"
        PopperProps={{ disablePortal: true }}
      >
        <IconButton onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <BrightnessHighIcon /> : <Brightness4Icon />}
        </IconButton>
      </Tooltip>
    </div>
  );

  return (
    <Layout
      title={
        <RouterLink href={ROUTES.HOME}>
          <Image
            className={classes.logo}
            loader={({ src }) => src}
            src={darkMode ? logoWhite : logo}
            alt=""
          />
        </RouterLink>
      }
      subHeader={subHeader}
      className={classNames(classes.content, className)}
      toolbarContent={
        <Box ml="auto" display="flex" alignItems="center">
          {darkModeSwitch}
          {withContestNavigation && <ContestNavigation />}
          {!user && authButtons}
        </Box>
      }
      primarySidebar={
        user
          ? ({ open, collapsed }) => (
              <Sidebar
                isLoading={!isSuccess}
                username={username}
                avatar={avatar}
                open={open}
                collapsed={collapsed}
                onLogout={async () => {
                  remove();
                  await refetchCurrentUser();
                }}
              />
            )
          : undefined
      }
    >
      {children}
    </Layout>
  );
};

export default Page;
