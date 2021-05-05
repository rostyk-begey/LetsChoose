import React, { useMemo, createContext, useState, useContext } from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

import themeOptions from '../../utils/themeOptions';

type DarkMode = boolean;
type SetDarkMode = (enabled: boolean) => void;

const DarkModeContext = createContext<{
  darkMode: DarkMode;
  setDarkMode: SetDarkMode;
}>({
  darkMode: false,
  setDarkMode: () => null,
});

export const useDarkMode = (): [DarkMode, SetDarkMode] => {
  const { darkMode, setDarkMode } = useContext(DarkModeContext);
  return [darkMode, setDarkMode];
};

const DARK_THEME_KEY = 'USE_DARK_THEME';
const isLocalStorageDarkTheme = (): boolean => {
  return window?.localStorage.getItem(DARK_THEME_KEY) === 'true';
};

const ThemeProvider: React.FC = ({ children }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [darkModeEnabled, setDarkModeEnabled] = useState<boolean | null>(
    typeof window !== 'undefined' ? isLocalStorageDarkTheme() : null,
  );

  const theme = useMemo(
    () =>
      createMuiTheme({
        ...themeOptions,
        palette: {
          ...themeOptions.palette,
          type: darkModeEnabled ?? prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [darkModeEnabled, prefersDarkMode],
  );
  const setDarkMode = (enabled: boolean) => {
    localStorage.setItem(DARK_THEME_KEY, String(enabled));
    setDarkModeEnabled(enabled);
  };

  return (
    <DarkModeContext.Provider
      value={{ darkMode: darkModeEnabled ?? prefersDarkMode, setDarkMode }}
    >
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </DarkModeContext.Provider>
  );
};

export default ThemeProvider;
