import React from 'react';
import { alpha } from '@mui/material';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const PREFIX = 'Footer';

const classes = {
  legalLink: `${PREFIX}-legalLink`,
  navMenu: `${PREFIX}-navMenu`,
};

const Root = styled('div')(
  ({ theme: { typography, palette, breakpoints, ...theme } }) => ({
    marginTop: 'auto',
    padding: theme.spacing(1, 3),
    textAlign: 'center',
    zIndex: 2,
    position: 'relative',
    display: 'flex',
    width: '100%',
    [breakpoints.down('xs')]: {
      flexDirection: 'column',
    },

    [`& .${classes.legalLink}`]: {
      ...typography.caption,
      justifyContent: 'center',
      color:
        palette.mode === 'dark'
          ? `${alpha(palette.common.white, 0.57)}`
          : palette.text.secondary,
      position: 'relative',
      [breakpoints.up('sm')]: {
        '&:not(:first-of-type)': {
          '&:before': {
            content: '"|"',
            display: 'block',
            position: 'absolute',
            left: 0,
          },
        },
      },
    },

    [`& .${classes.navMenu}`]: {
      display: 'flex',
      flex: '1 0 auto',
      [breakpoints.down('xs')]: {
        justifyContent: 'center',
      },
    },
  }),
);

export const Footer: React.FC = () => (
  <Root>
    {/* TODO: update footer navigation */}
    {/*<NavMenu className={classes.navMenu}>*/}
    {/*  <NavItem className={classNames(classes.legalLink)}>*/}
    {/*    Terms & Conditions*/}
    {/*  </NavItem>*/}
    {/*  <NavItem className={classNames(classes.legalLink)}>*/}
    {/*    Privacy Policy*/}
    {/*  </NavItem>*/}
    {/*</NavMenu>*/}
    <Box py={1} textAlign={{ xs: 'center', md: 'right' }}>
      <Typography component="p" variant="caption" color="textSecondary">
        Let&apos;s Choose © {new Date().getFullYear()} All right reserved
      </Typography>
    </Box>
  </Root>
);
