import { useRouter } from 'next/router';
import React, { ReactNode, useState } from 'react';
import RouterLink from 'next/link';
import { useMutation } from 'react-query';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Divider from '@material-ui/core/Divider';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import classNames from 'classnames';

import { useCurrentUser } from '../../../hooks/api/user';
import { authApi } from '../../../hooks/api/auth';
import ROUTES from '../../../utils/routes';
import Header from '../Header';
import Footer from '../Footer';

interface Props {
  withoutSubmenu?: boolean;
  className?: string;
}

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  content: {},
}));

const Page: React.FC<Props> = ({
  className,
  children,
  withoutSubmenu = false,
}) => {
  const classes = useStyles();
  const { data: { data: user } = {}, clear, refetch } = useCurrentUser({});
  const [logout] = useMutation(authApi.logout);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.root}>
      <Header
        brand={<RouterLink href={ROUTES.HOME}>Let&apos;s Choose</RouterLink>}
        withoutSubmenu={withoutSubmenu}
        rightLinks={
          user ? (
            <>
              <Button
                aria-controls="user-menu"
                aria-haspopup="true"
                onClick={handleClick}
              >
                <Avatar alt={user.username} src={user.avatar} />
              </Button>
              <Menu
                id="user-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <RouterLink href={`${ROUTES.USERS}/${user.username}`}>
                  <ListItem button>
                    <ListItemIcon>
                      <AccountCircleOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText primary={`@${user.username}`} />
                  </ListItem>
                </RouterLink>
                <Divider />
                <MenuItem
                  onClick={async () => {
                    await logout();
                    clear();
                    await refetch();
                  }}
                >
                  <ListItemIcon>
                    <ExitToAppIcon />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button color="primary" href={ROUTES.LOGIN}>
                Log in
              </Button>
              <Button color="primary" variant="outlined" href={ROUTES.REGISTER}>
                Sign up
              </Button>
            </>
          )
        }
      />
      <div className={classNames(classes.content, className)}>{children}</div>
      <Footer />
    </div>
  );
};

export default Page;
