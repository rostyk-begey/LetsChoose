import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import AddIcon from '@material-ui/icons/Add';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import HomeIcon from '@material-ui/icons/Home';
import Skeleton from '@material-ui/lab/Skeleton';
import RouterLink from 'next/link';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import { useMutation } from 'react-query';

import { authApi } from '../../hooks/api/auth';
import ROUTES from '../../utils/routes';
import { MenuLink } from './Menu';

interface Props {
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

const Sidebar: React.FC<Props> = ({
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
      icon: <HomeIcon />,
    },
    {
      href: `${ROUTES.USERS}/${username}`,
      active: `${ROUTES.USERS}/${username}` === router.asPath,
      label: 'My profile',
      icon: <AccountCircleOutlinedIcon />,
    },
    {
      href: ROUTES.CONTESTS.NEW,
      active: ROUTES.CONTESTS.NEW === router.asPath,
      label: 'New Contest',
      icon: <AddIcon />,
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

export default Sidebar;
