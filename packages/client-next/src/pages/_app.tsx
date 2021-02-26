import React, { useEffect } from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { CssBaseline } from '@material-ui/core';
import { StylesProvider } from '@material-ui/core/styles';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import queryClient from '../utils/queryClient';

import '../assets/scss/material-kit-react.scss';
import 'animate.css';

const MyApp = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles);
    }
  });

  return (
    <StylesProvider injectFirst>
      <Head>
        <title>Let&apos;s Choose</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </StylesProvider>
  );
};

export default MyApp;
