import React from 'react';
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import { queryClient } from '@lets-choose/client/utils';
import { ConfirmProvider } from 'material-ui-confirm';
import { SnackbarProvider } from 'notistack';
import { QueryClientProvider } from 'react-query';
import { ThemeProvider } from '../src/lib/ThemeProvider';

export const decorators = [
  (Story) => (
    <StyledEngineProvider injectFirst>
      <ThemeProvider>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <SnackbarProvider autoHideDuration={2000}>
            <ConfirmProvider>
              <Story />
            </ConfirmProvider>
          </SnackbarProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  ),
];
