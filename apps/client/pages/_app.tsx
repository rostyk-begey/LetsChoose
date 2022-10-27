import { useEffect, useRef } from 'react';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { ThemeProvider } from '@lets-choose/client/components';
import { queryClient } from '@lets-choose/client/utils';
import StyledEngineProvider from '@mui/material/StyledEngineProvider';
import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import 'animate.css';
import { ConfirmProvider } from 'material-ui-confirm';
import { DefaultSeo, DefaultSeoProps } from 'next-seo';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { SnackbarProvider } from 'notistack';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import createEmotionCache from '../lib/createEmotionCache';

export const url = 'https://lets-choose.herokuapp.com';
export const defaultSeo: DefaultSeoProps = {
  title: undefined,
  titleTemplate: "%s | Let's Choose",
  defaultTitle: "Let's Choose",
  description:
    "Let's Choose is a platform where you can create contests to compare images",
  openGraph: {
    type: 'website',
    locale: 'en_IE',
    url,
    site_name: "Let's Choose",
    images: [
      {
        url: `${url}/images/logo.png`,
        alt: "Let'sChoose",
      },
    ],
  },
  facebook: {
    appId: '1153193155159012',
  },
};

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const MyApp = ({
  Component,
  pageProps,
  router,
  emotionCache = clientSideEmotionCache,
}: MyAppProps) => {
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles);
    }
  });

  const notistackRef = useRef();
  const handleDismissClick = (key) => () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    notistackRef?.current?.closeSnackbar(key);
  };

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Let&apos;s Choose</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <script src="https://accounts.google.com/gsi/client" async defer />
      </Head>
      <DefaultSeo
        {...{
          ...defaultSeo,
          openGraph: {
            ...defaultSeo.openGraph,
            url: `${defaultSeo?.openGraph?.url}${router.asPath}`,
          },
        }}
      />
      <StyledEngineProvider injectFirst>
        <ThemeProvider>
          <CssBaseline />
          <QueryClientProvider client={queryClient}>
            <SnackbarProvider
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              ref={notistackRef}
              autoHideDuration={3000}
              action={(key) => (
                <IconButton onClick={handleDismissClick(key)} size="large">
                  <CloseIcon />
                </IconButton>
              )}
            >
              <ConfirmProvider>
                <GlobalStyles
                  styles={{
                    '#__next': {
                      display: 'flex',
                      height: '100vh',
                      flexDirection: 'column',
                    },
                  }}
                />
                <Component {...pageProps} />
                <ReactQueryDevtools position="bottom-right" />
              </ConfirmProvider>
            </SnackbarProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </CacheProvider>
  );
};

export default MyApp;
