import React, { useState, useEffect, ReactNode } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Menu from '@material-ui/icons/Menu';
import classNames from 'classnames';

import styles from '../../assets/jss/material-kit-react/components/headerStyle';
import { getKeyValue } from '../../utils/functions';

const useStyles = makeStyles(styles);

interface Props {
  color?:
    | 'appBar'
    | 'flex'
    | 'fixed'
    | 'transparent'
    | 'white'
    | 'absolute'
    | 'dark'
    | 'container'
    | 'title'
    | 'appResponsive'
    | 'primary'
    | 'info'
    | 'success'
    | 'warning'
    | 'danger'
    | 'rose'
    | 'drawerPaper';
  rightLinks?: ReactNode;
  leftLinks?: ReactNode;
  brand: ReactNode;
  fixed?: boolean;
  absolute?: boolean;
  changeColorOnScroll?: any;
}

const Header: React.FC<Props> = ({
  color = 'white',
  rightLinks,
  leftLinks,
  brand,
  fixed,
  absolute,
  changeColorOnScroll,
}) => {
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    window.addEventListener('scroll', headerColorChange);
    return () => window.removeEventListener('scroll', headerColorChange);
  });
  const handleDrawerToggle = () => {
    setMobileOpen((x) => !x);
  };
  const headerColorChange = () => {
    if (typeof window === 'undefined' || !changeColorOnScroll) {
      return;
    }

    const windowsScrollTop = window.pageYOffset;
    if (windowsScrollTop > changeColorOnScroll.height) {
      document.body
        .getElementsByTagName('header')[0]
        .classList.remove(getKeyValue(classes)(color));
      document.body
        .getElementsByTagName('header')[0]
        .classList.add(getKeyValue(classes)(changeColorOnScroll.color));
    } else {
      document.body
        .getElementsByTagName('header')[0]
        .classList.add(getKeyValue(classes)(color));
      document.body
        .getElementsByTagName('header')[0]
        .classList.remove(getKeyValue(classes)(changeColorOnScroll.color));
    }
  };
  const appBarClasses = classNames({
    [classes.appBar]: true,
    [getKeyValue(classes)(color)]: color,
    [classes.absolute]: absolute,
    [classes.fixed]: fixed,
  });
  const brandComponent = <Button className={classes.title}>{brand}</Button>;
  return (
    <AppBar className={appBarClasses}>
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
        <Hidden smDown implementation="css">
          {rightLinks}
        </Hidden>
        <Hidden mdUp>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
          >
            <Menu />
          </IconButton>
        </Hidden>
      </Toolbar>
      <Hidden mdUp implementation="js">
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
            {leftLinks}
            {rightLinks}
          </div>
        </Drawer>
      </Hidden>
    </AppBar>
  );
};

export default Header;
