import createMuiTheme, {
  ThemeOptions,
} from '@material-ui/core/styles/createMuiTheme';
import {
  dangerColor,
  infoColor,
  primaryColor,
  secondaryColor,
  successColor,
  warningColor,
} from '../assets/jss/material-kit-react';

const themeOptions: ThemeOptions = {
  overrides: {
    MuiCssBaseline: {
      '@global': {
        '#__next': {
          display: 'flex',
          height: '100vh',
          flexDirection: 'column',
        },
      },
    },
  },
  palette: {
    primary: {
      main: primaryColor,
    },
    secondary: {
      main: secondaryColor,
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
  },
};

export default themeOptions;
