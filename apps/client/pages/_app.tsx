import React, { useEffect, useRef } from 'react';
import { ThemeProvider } from '@lets-choose/client/components';
import { queryClient } from '@lets-choose/client/utils';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { SnackbarProvider } from 'notistack';
import Head from 'next/head';
import { AppProps } from 'next/app';
import CssBaseline from '@material-ui/core/CssBaseline';
import { StylesProvider } from '@material-ui/core/styles';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { DefaultSeo, DefaultSeoProps } from 'next-seo';
import { ConfirmProvider } from 'material-ui-confirm';

import 'animate.css';

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

const MyApp = ({ Component, pageProps, router }: AppProps) => {
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
    <StylesProvider injectFirst>
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
      <ThemeProvider>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <SnackbarProvider
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            ref={notistackRef}
            autoHideDuration={3000}
            action={(key) => (
              <IconButton onClick={handleDismissClick(key)}>
                <CloseIcon />
              </IconButton>
            )}
          >
            <ConfirmProvider>
              <Component {...pageProps} />
              <ReactQueryDevtools position="bottom-right" />
            </ConfirmProvider>
          </SnackbarProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </StylesProvider>
  );
};

export default MyApp;
