import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { ColumnToRow, Item } from '@mui-treasury/components/flex';
import { NavItem, NavMenu } from '@mui-treasury/components/menu/navigation';
import usePlainNavigationMenuStyles from '@mui-treasury/styles/navigationMenu/plain';
import React from 'react';
import { List, ListItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Favorite from '@material-ui/icons/Favorite';
import classNames from 'classnames';

import styles from './styles';

const useStyles = makeStyles(styles);

const Footer: React.FC<{ whiteFont?: boolean }> = ({ whiteFont }) => {
  const classes = useStyles();
  const footerClasses = classNames({
    [classes.footer]: true,
    [classes.footerWhiteFont]: whiteFont,
  });
  const aClasses = classNames({
    [classes.a]: true,
    [classes.footerWhiteFont]: whiteFont,
  });

  return (
    <footer className={footerClasses}>
      {/*<div className={classes.container}>*/}
      {/*  <div className={classes.left}>*/}
      {/*    <List className={classes.list}>*/}
      {/*      <ListItem className={classes.inlineBlock}>*/}
      {/*        <a*/}
      {/*          href="https://www.creative-tim.com/index.tsx?ref=mkr-footer"*/}
      {/*          className={classes.block}*/}
      {/*          target="_blank"*/}
      {/*          rel="noreferrer"*/}
      {/*        >*/}
      {/*          Creative Tim*/}
      {/*        </a>*/}
      {/*      </ListItem>*/}
      {/*      <ListItem className={classes.inlineBlock}>*/}
      {/*        <a*/}
      {/*          href="https://www.creative-tim.com/presentation?ref=mkr-footer"*/}
      {/*          className={classes.block}*/}
      {/*          target="_blank"*/}
      {/*          rel="noreferrer"*/}
      {/*        >*/}
      {/*          About us*/}
      {/*        </a>*/}
      {/*      </ListItem>*/}
      {/*      <ListItem className={classes.inlineBlock}>*/}
      {/*        <a*/}
      {/*          href="http://blog.creative-tim.com/index.tsx?ref=mkr-footer"*/}
      {/*          className={classes.block}*/}
      {/*          target="_blank"*/}
      {/*          rel="noreferrer"*/}
      {/*        >*/}
      {/*          Blog*/}
      {/*        </a>*/}
      {/*      </ListItem>*/}
      {/*      <ListItem className={classes.inlineBlock}>*/}
      {/*        <a*/}
      {/*          href="https://www.creative-tim.com/license?ref=mkr-footer"*/}
      {/*          className={classes.block}*/}
      {/*          target="_blank"*/}
      {/*          rel="noreferrer"*/}
      {/*        >*/}
      {/*          Licenses*/}
      {/*        </a>*/}
      {/*      </ListItem>*/}
      {/*    </List>*/}
      {/*  </div>*/}
      {/*  <div className={classes.right}>*/}
      {/*    &copy; {new Date().getFullYear()} , made with{' '}*/}
      {/*    <Favorite className={classes.icon} /> by{' '}*/}
      {/*    <a*/}
      {/*      href="https://www.creative-tim.com?ref=mkr-footer"*/}
      {/*      className={aClasses}*/}
      {/*      target="_blank"*/}
      {/*      rel="noreferrer"*/}
      {/*    >*/}
      {/*      Creative Tim*/}
      {/*    </a>{' '}*/}
      {/*    for a better web.*/}
      {/*  </div>*/}
      {/*</div>*/}
      <Box px={3} width="100%">
        <ColumnToRow
          at={'md'}
          columnStyle={{ alignItems: 'center' }}
          rowStyle={{ alignItems: 'unset' }}
        >
          <Item grow ml={-2} shrink={0}>
            <NavMenu>
              <ColumnToRow at="sm">
                <NavItem className={classNames(classes.legalLink)}>
                  Terms & Conditions
                </NavItem>
                <NavItem className={classNames(classes.legalLink)}>
                  Privacy Policy
                </NavItem>
              </ColumnToRow>
            </NavMenu>
          </Item>
          <Item>
            <Box py={1} textAlign={{ xs: 'center', md: 'right' }}>
              <Typography component="p" variant="caption" color="textSecondary">
                Let&apos;s Choose © {new Date().getFullYear()} All right
                reserved
              </Typography>
            </Box>
          </Item>
        </ColumnToRow>
      </Box>
    </footer>
  );
};

export default Footer;
