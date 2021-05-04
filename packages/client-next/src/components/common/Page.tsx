import React, { ReactNode, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import Tooltip from '@material-ui/core/Tooltip';
import RouterLink from 'next/link';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import BrightnessHighIcon from '@material-ui/icons/BrightnessHigh';
import IconButton from '@material-ui/core/IconButton';
import classNames from 'classnames';
import { authApi, useAxiosMutation } from '../../hooks/api/auth';

import { useCurrentUser } from '../../hooks/api/user';
import Sidebar from './Sidebar';
import { useDarkMode } from './ThemeProvider';
import ROUTES from '../../utils/routes';
import ContestNavigation from './ContestNavigation';
import Layout from './Layout';
import logo from '../../assets/icons/logo.png';
import logoWhite from '../../assets/icons/logo-white.png';

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
  signupBtn: {
    margin: theme.spacing(0, 1, 0, 4),
    flexShrink: 0,
  },
  loginBtn: {
    flexShrink: 0,
  },
}));

const Page: React.FC<Props> = ({
  withContestNavigation = false,
  children,
  className,
  subHeader,
}) => {
  const classes = useStyles();
  const {
    data: { data: user } = {},
    remove,
    isSuccess,
    refetch: refetchCurrentUser,
  } = useCurrentUser({});
  const { username = '', avatar } = user || {};
  const [darkMode, setDarkMode] = useDarkMode();
  const { enqueueSnackbar } = useSnackbar();

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

  const { mutateAsync: googleLogin } = useAxiosMutation(authApi.loginGoogle);

  useEffect(() => {
    if (!user && window?.google?.accounts) {
      const options: google.IdConfiguration = {
        client_id: process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID as string,
        auto_select: false,
        cancel_on_tap_outside: false,
        context: 'signin',
        callback: async ({ credential: token }) => {
          try {
            await googleLogin({ token });
            remove();
            await refetchCurrentUser();
            enqueueSnackbar('Successfully logged in', { variant: 'success' });
          } catch (e) {
            enqueueSnackbar(e.response.data.message, { variant: 'error' });
          }
        },
      };
      window.google.accounts.id.initialize(options);
      window.google.accounts.id.prompt();
    }
  }, [user, typeof window]);

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
          <img src={darkMode ? logoWhite : logo} alt="" />
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
