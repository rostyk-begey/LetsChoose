import { ThemeOptions } from '@material-ui/core/styles';
import {
  dangerColor,
  infoColor,
  primaryColor,
  secondaryColor,
  successColor,
  warningColor,
} from './material-kit-react';

export const themeOptions: ThemeOptions = {
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
