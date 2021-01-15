import { createMuiTheme } from '@material-ui/core';
import {
  dangerColor,
  infoColor,
  primaryColor,
  roseColor,
  successColor,
  warningColor,
} from './assets/jss/material-kit-react';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: primaryColor,
    },
    secondary: {
      main: roseColor,
    },
    error: {
      main: dangerColor,
    },
    warning: {
      main: warningColor,
    },
    info: {
      main: infoColor,
    },
    success: {
      main: successColor,
    },
    // gray: grayColor,
  },
});

export default theme;
