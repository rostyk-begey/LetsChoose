import React from 'react';
import { styled } from '@mui/material/styles';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import SettingsIcon from '@mui/icons-material/SettingsRounded';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import AddIcon from '@mui/icons-material/AddCircleRounded';
import AddOutlinedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import HomeIcon from '@mui/icons-material/HomeRounded';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem, { ListItemProps } from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Skeleton from '@mui/material/Skeleton';
import RouterLink from 'next/link';
import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from 'react-query';

import { authApi, userQueryKeys } from '@lets-choose/client/hooks';
import { ROUTES } from '@lets-choose/client/utils';

const PREFIX = 'Sidebar';

const classes = {
  avatar: `${PREFIX}-avatar`,
  avatarOpen: `${PREFIX}-avatarOpen`,
  username: `${PREFIX}-username`,
  usernameOpen: `${PREFIX}-usernameOpen`,
  profileBox: `${PREFIX}-profileBox`,
  profileBoxOpen: `${PREFIX}-profileBoxOpen`,
  sidebarMenu: `${PREFIX}-sidebarMenu`,
  transition: `${PREFIX}-transition`,
};

const Root = styled('div', {
  shouldForwardProp: (prop) => prop !== 'collapsed',
})<{ collapsed?: boolean }>(({ theme, collapsed }) => ({
  [`& .${classes.transition}`]: {
    transition: theme.transitions.create('all', {
      duration: theme.transitions.duration.shorter,
      easing: theme.transitions.easing.easeInOut,
    }),
  },

  [`& .${classes.avatar}`]: {
    width: 48,
    height: 48,
    marginBottom: 0,
    ...(!collapsed && {
      width: 60,
      height: 60,
      marginBottom: theme.spacing(2),
    }),
  },

  [`& .${classes.username}`]: {
    transition: 'all 0.3s ease 0s',
    textTransform: 'none',
    maxHeight: collapsed ? 0 : 100,
    opacity: collapsed ? 0 : 1,
  },

  [`& .${classes.profileBox}`]: {
    padding: !collapsed ? theme.spacing(2) : theme.spacing(2, 1),
  },

  [`& .${classes.sidebarMenu}`]: {
    paddingTop: 0,
  },
}));

export interface SidebarProps {
  open?: boolean;
  collapsed?: boolean;
  isLoading?: boolean;
  username: string;
  avatar?: string;
}

const MENU_ITEM_PREFIX = 'MenuItem';
const menuItemClasses = {
  icon: `${MENU_ITEM_PREFIX}-icon`,
  text: `${MENU_ITEM_PREFIX}-text`,
  button: `${MENU_ITEM_PREFIX}-button`,
};
const MenuItem = styled(ListItem, {
  shouldForwardProp: (prop) => prop !== 'open',
})<
  ListItemProps & {
    open?: boolean;
  }
>(({ theme, open }) => ({
  padding: 0,
  transition: 'all 0s linear 0.2s',
  minWidth: open ? 254 : 64,

  [`& .${menuItemClasses.icon}`]: {
    transition: 'all 0.3s ease 0s',
    minWidth: 'unset',
    marginRight: open ? theme.spacing(4) : 0,
    color: theme.palette.primary.main,
  },

  [`& .${menuItemClasses.text}`]: {
    transition: 'all 0.3s ease 0s, max-width 0s linear 0.2s',
    opacity: open ? 1 : 0,
    maxWidth: open ? 500 : 0,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },

  [`& .${menuItemClasses.button}`]: {
    transition: 'all 0s ease 0.1s',
    justifyContent: open ? 'flex-start' : 'center',
  },
}));

interface MenuLink {
  href: string;
  active?: boolean;
  label: string;
  icon: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({
  username,
  avatar,
  open,
  collapsed,
  isLoading,
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: logout } = useMutation(authApi.logout, {
    onSuccess: () => {
      queryClient.invalidateQueries(userQueryKeys.session());
    },
  });
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
    <Root collapsed={collapsed}>
      <Box className={classes.profileBox}>
        {!isLoading ? (
          <RouterLink href={`${ROUTES.USERS}/${username}`} passHref>
            <Avatar component="a" src={avatar} className={classes.avatar} />
          </RouterLink>
        ) : (
          <Skeleton
            animation="wave"
            variant="circular"
            className={classes.avatar}
          />
        )}
        {!isLoading ? (
          <Typography variant="h6" noWrap className={classes.username}>
            @{username}
          </Typography>
        ) : (
          <Skeleton
            animation="wave"
            height={20}
            width="85%"
            className={classes.username}
          />
        )}
      </Box>
      <Divider />
      <List className={classes.sidebarMenu}>
        {links.map(({ href, label, icon, active }) => (
          <RouterLink key={href} href={href} passHref>
            <MenuItem selected={active} open={open || !collapsed}>
              <ListItemButton component="a" className={menuItemClasses.button}>
                <ListItemIcon className={menuItemClasses.icon}>
                  {icon}
                </ListItemIcon>
                <ListItemText
                  primary={label}
                  className={menuItemClasses.text}
                />
              </ListItemButton>
            </MenuItem>
          </RouterLink>
        ))}
        <Divider />
        <MenuItem open={open || !collapsed}>
          <ListItemButton
            onClick={() => logout()}
            className={menuItemClasses.button}
          >
            <ListItemIcon className={menuItemClasses.icon}>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" className={menuItemClasses.text} />
          </ListItemButton>
        </MenuItem>
      </List>
    </Root>
  );
};
