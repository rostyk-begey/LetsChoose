import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles(
  ({ typography, palette, breakpoints, ...theme }) => ({
    legalLink: {
      ...typography.caption,
      justifyContent: 'center',
      color:
        palette.type === 'dark'
          ? 'rgba(255,255,255,0.57)'
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
    footer: {
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
    },
    navMenu: {
      display: 'flex',
      flex: '1 0 auto',
      [breakpoints.down('xs')]: {
        justifyContent: 'center',
      },
    },
  }),
);

export const Footer: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.footer}>
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
    </div>
  );
};
