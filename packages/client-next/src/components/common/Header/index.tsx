import React, { useState, ReactNode } from 'react';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Menu from '@material-ui/icons/Menu';
import classNames from 'classnames';

import styles from './styles';
import { getKeyValue } from '../../../utils/functions';

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
  subMenu?: ReactNode;
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
  subMenu,
}) => {
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen((x) => !x);
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
      {subMenu && (
        <>
          <Divider style={{ width: '100%' }} />
          <Toolbar className={classes.subMenuContainer}>{subMenu}</Toolbar>
        </>
      )}
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
