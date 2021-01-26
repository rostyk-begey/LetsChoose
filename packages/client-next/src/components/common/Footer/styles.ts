import { Theme } from '@material-ui/core';
import { createStyles } from '@material-ui/core/styles';

import {
  container,
  primaryColor,
} from '../../../assets/jss/material-kit-react';

const styles = ({ typography, palette, breakpoints, ...theme }: Theme) =>
  createStyles({
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
    block: {
      color: 'inherit',
      padding: '0.9375rem',
      fontWeight: 500,
      fontSize: '12px',
      textTransform: 'uppercase',
      borderRadius: '3px',
      textDecoration: 'none',
      position: 'relative',
      display: 'block',
    },
    left: {
      float: 'left!important' as any,
      display: 'block',
    },
    right: {
      padding: '15px 0',
      margin: '0',
      float: 'right!important' as any,
    },
    footer: {
      marginTop: 'auto',
      padding: theme.spacing(1, 3),
      textAlign: 'center',
      zIndex: 2,
      position: 'relative',
    },
    a: {
      color: primaryColor,
      textDecoration: 'none',
      backgroundColor: 'transparent',
    },
    footerWhiteFont: {
      '&,&:hover,&:focus': {
        color: '#FFFFFF',
      },
    },
    container,
    list: {
      marginBottom: '0',
      padding: '0',
      marginTop: '0',
    },
    inlineBlock: {
      display: 'inline-block',
      padding: '0px',
      width: 'auto',
    },
    icon: {
      width: '18px',
      height: '18px',
      position: 'relative',
      top: '3px',
    },
  });
export default styles;
