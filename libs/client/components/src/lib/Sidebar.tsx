import React from 'react';
import {
  Avatar,
  Box,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Typography,
} from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import SettingsIcon from '@material-ui/icons/SettingsRounded';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import AddIcon from '@material-ui/icons/AddCircleRounded';
import AddOutlinedIcon from '@material-ui/icons/AddCircleOutlineRounded';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import HomeIcon from '@material-ui/icons/HomeRounded';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import Skeleton from '@material-ui/lab/Skeleton';
import RouterLink from 'next/link';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import { useMutation } from 'react-query';

import { authApi } from '@lets-choose/client/hooks';
import { ROUTES } from '@lets-choose/client/utils';
import { MenuLink } from './Menu';

export interface SidebarProps {
  open?: boolean;
  collapsed?: boolean;
  isLoading?: boolean;
  username: string;
  avatar?: string;
  onLogout: () => any;
}

const useStyles = makeStyles((theme) => ({
  menuItem: {
    transition: 'all 0s linear 0.2s',
    justifyContent: 'center',
  },
  menuItemOpen: {
    justifyContent: 'flex-start',
  },
  menuItemText: {
    transition: 'all 0.3s ease 0s, max-width 0s linear 0.2s',
    opacity: 0,
    maxWidth: 0,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  menuItemTextOpen: {
    opacity: 1,
    maxWidth: 500,
  },
  menuItemIcon: {
    transition: 'all 0.3s ease 0s',
    minWidth: 'unset',
    marginRight: 0,
    color: theme.palette.primary.main,
  },
  menuItemIconOpen: {
    marginRight: theme.spacing(4),
  },
  avatar: {
    transition: 'all 0.3s ease 0s',
    width: 48,
    height: 48,
    marginBottom: 0,
  },
  avatarOpen: {
    width: 60,
    height: 60,
    marginBottom: theme.spacing(2),
  },
  username: {
    transition: 'all 0.3s ease 0s',
    maxHeight: 0,
    textTransform: 'none',
    opacity: 0,
  },
  usernameOpen: {
    maxHeight: 100,
    opacity: 1,
  },
  profileBox: {
    padding: theme.spacing(2, 1),
    transition: 'all 0.3s ease 0s',
  },
  profileBoxOpen: {
    padding: theme.spacing(2),
  },
  sidebarMenu: {
    paddingTop: 0,
  },
}));

export const Sidebar: React.FC<SidebarProps> = ({
  username,
  avatar,
  open,
  collapsed,
  isLoading,
  onLogout,
}) => {
  const classes = useStyles();
  const { mutateAsync: logout } = useMutation(authApi.logout);
  const router = useRouter();
  const links: MenuLink[] = [
    {
      href: ROUTES.HOME,
      active: ROUTES.HOME === router.asPath,
      label: 'Home',
      icon: ROUTES.HOME === router.asPath ? <HomeIcon /> : <HomeOutlinedIcon />,
    },
    {
      href: `${ROUTES.USERS}/${username}`,
      active: `${ROUTES.USERS}/${username}` === router.asPath,
      label: 'My profile',
      icon:
        `${ROUTES.USERS}/${username}` === router.asPath ? (
          <AccountCircleIcon />
        ) : (
          <AccountCircleOutlinedIcon />
        ),
    },
    {
      href: ROUTES.CONTESTS.NEW,
      active: ROUTES.CONTESTS.NEW === router.asPath,
      label: 'New Contest',
      icon:
        ROUTES.CONTESTS.NEW === router.asPath ? (
          <AddIcon />
        ) : (
          <AddOutlinedIcon />
        ),
    },
    {
      href: ROUTES.SETTINGS,
      active: ROUTES.SETTINGS === router.asPath,
      label: 'Settings',
      icon:
        ROUTES.SETTINGS === router.asPath ? (
          <SettingsIcon />
        ) : (
          <SettingsOutlinedIcon />
        ),
    },
  ];

  return (
    <>
      <Box
        className={classNames(classes.profileBox, {
          [classes.profileBoxOpen]: open || !collapsed,
        })}
      >
        {!isLoading ? (
          <RouterLink href={`${ROUTES.USERS}/${username}`} passHref>
            <Avatar
              component="a"
              src={avatar}
              className={classNames(classes.avatar, {
                [classes.avatarOpen]: open || !collapsed,
              })}
            />
          </RouterLink>
        ) : (
          <Skeleton
            animation="wave"
            variant="circle"
            className={classes.avatar}
          />
        )}
        {!isLoading ? (
          <Typography
            variant="h6"
            noWrap
            className={classNames(classes.username, {
              [classes.usernameOpen]: open || !collapsed,
            })}
          >
            @{username}
          </Typography>
        ) : (
          <Skeleton
            animation="wave"
            height={20}
            width="85%"
            className={classNames(classes.username, {
              [classes.usernameOpen]: open || !collapsed,
            })}
          />
        )}
      </Box>
      <Divider />
      <List className={classes.sidebarMenu}>
        {links.map(({ href, label, icon, active }) => (
          <RouterLink key={href} href={href} passHref>
            <ListItem
              component="a"
              button
              selected={active}
              className={classNames(classes.menuItem, {
                [classes.menuItemOpen]: open || !collapsed,
              })}
            >
              <ListItemIcon
                className={classNames(classes.menuItemIcon, {
                  [classes.menuItemIconOpen]: open || !collapsed,
                })}
              >
                {icon}
              </ListItemIcon>
              <ListItemText
                primary={label}
                className={classNames(classes.menuItemText, {
                  [classes.menuItemTextOpen]: open || !collapsed,
                })}
              />
            </ListItem>
          </RouterLink>
        ))}
        <Divider />
        <ListItem
          button
          className={classNames(classes.menuItem, {
            [classes.menuItemOpen]: open || !collapsed,
          })}
          onClick={async () => {
            await logout();
            onLogout();
          }}
        >
          <ListItemIcon
            className={classNames(classes.menuItemIcon, {
              [classes.menuItemIconOpen]: open || !collapsed,
            })}
          >
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            className={classNames(classes.menuItemText, {
              [classes.menuItemTextOpen]: open || !collapsed,
            })}
          />
        </ListItem>
      </List>
    </>
  );
};
