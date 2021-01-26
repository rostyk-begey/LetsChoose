import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { ColumnToRow, Item } from '@mui-treasury/components/flex';
import { NavItem, NavMenu } from '@mui-treasury/components/menu/navigation';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

import styles from './styles';

const useStyles = makeStyles(styles);

const Footer: React.FC = () => {
  const classes = useStyles();

  return (
    <Box px={3} width="100%" className={classes.footer}>
      <ColumnToRow
        at="md"
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
              Let&apos;s Choose © {new Date().getFullYear()} All right reserved
            </Typography>
          </Box>
        </Item>
      </ColumnToRow>
    </Box>
  );
};

export default Footer;
