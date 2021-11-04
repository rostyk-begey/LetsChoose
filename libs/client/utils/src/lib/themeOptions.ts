import { ThemeOptions } from '@mui/material/styles';
import {
  dangerColor,
  infoColor,
  primaryColor,
  secondaryColor,
  successColor,
  warningColor,
} from './material-kit-react';

export const themeOptions: ThemeOptions = {
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '@global': {
          '#__next': {
            display: 'flex',
            height: '100vh',
            flexDirection: 'column',
          },
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
