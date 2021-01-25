import React, { useState, ReactNode } from 'react';
import RouterLink from 'next/link';
import { useRouter } from 'next/router';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AddIcon from '@material-ui/icons/Add';
import HomeIcon from '@material-ui/icons/Home';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import MenuIcon from '@material-ui/icons/Menu';
import classNames from 'classnames';
import { useMutation } from 'react-query';
import { authApi } from '../../../hooks/api/auth';

import { useCurrentUser } from '../../../hooks/api/user';
import ROUTES from '../../../utils/routes';
import ContestNavigation from '../ContestsNavigation';
import Menu, { MenuLink } from '../Menu';
import { getKeyValue } from '../../../utils/functions';
import styles from './styles';

const useStyles = makeStyles(styles);

interface Props {
  color?:
    | 'transparent'
    | 'white'
    | 'dark'
    | 'primary'
    | 'info'
    | 'success'
    | 'warning'
    | 'danger'
    | 'rose';
  rightLinks?: ReactNode;
  leftLinks?: ReactNode;
  brand: ReactNode;
  changeColorOnScroll?: any;
  withoutSubmenu?: boolean;
}

const Header: React.FC<Props> = ({
  color = 'white',
  rightLinks,
  leftLinks,
  brand,
  withoutSubmenu = false,
}) => {
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const { data: { data: user } = {}, refetch, clear } = useCurrentUser({});
  const [logout] = useMutation(authApi.logout);
  const { username = '' } = user || {};
  const handleDrawerToggle = () => {
    setMobileOpen((x) => !x);
  };
  const appBarClasses = classNames({
    [classes.appBar]: true,
    [getKeyValue(classes)(color)]: color,
  });
  const brandComponent = <Button className={classes.title}>{brand}</Button>;
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
      <AppBar position="fixed" className={appBarClasses}>
        <Toolbar className={classes.container}>
          {leftLinks !== undefined ? brandComponent : null}
          <div className={classes.flex}>
            {leftLinks !== undefined ? (
              <Hidden smDown implementation="css">
                {leftLinks}
              </Hidden>
            ) : (
              brandComponent
            )}
          </div>
          {username ? (
            <>
              <Hidden smDown implementation="css">
                {rightLinks}
              </Hidden>
              <Hidden mdUp>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={handleDrawerToggle}
                >
                  <MenuIcon />
                </IconButton>
              </Hidden>
            </>
          ) : (
            rightLinks
          )}
        </Toolbar>
        <Divider style={{ width: '100%' }} />
        {!withoutSubmenu && (
          <Toolbar className={classes.subMenuContainer}>
            {username && (
              <Hidden smDown implementation="css">
                <Menu links={links} />
              </Hidden>
            )}
            <ContestNavigation />
          </Toolbar>
        )}
        {username && (
          <Hidden mdUp implementation="css">
            <Drawer
              variant="temporary"
              anchor="right"
              open={mobileOpen}
              classes={{
                paper: classes.drawerPaper,
              }}
              onClose={handleDrawerToggle}
            >
              <div className={classes.appResponsive}>
                <List>
                  {links.map(({ href, label, icon, active }) => (
                    <RouterLink key={href} href={href}>
                      <ListItem button>
                        <ListItemIcon>{icon}</ListItemIcon>
                        <ListItemText primary={label} />
                      </ListItem>
                    </RouterLink>
                  ))}
                  <Divider />
                  <ListItem
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
                  </ListItem>
                </List>
              </div>
            </Drawer>
          </Hidden>
        )}
      </AppBar>
      <Toolbar />
      <Toolbar />
      <Toolbar />
    </>
  );
};

export default Header;
