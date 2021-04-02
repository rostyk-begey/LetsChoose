import React, { useEffect } from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import CssBaseline from '@material-ui/core/CssBaseline';
import { StylesProvider } from '@material-ui/core/styles';
import { QueryClientProvider } from 'react-query';
import { DefaultSeo } from 'next-seo';

import ThemeProvider from '../components/common/ThemeProvider';
import queryClient from '../utils/queryClient';

import '../assets/scss/material-kit-react.scss';
import 'animate.css';

const defaultSeo = {
  title: undefined,
  titleTemplate: "%s | Let's Choose",
  defaultTitle: "Let's Choose",
  description:
    "Let's Choose is a platform where you can create contests to compare images",
  openGraph: {
    type: 'website',
    locale: 'en_IE',
    url: 'http://ec2-18-217-198-156.us-east-2.compute.amazonaws.com/',
    site_name: "Let's Choose",
  },
};

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
      <DefaultSeo {...defaultSeo} />
      <ThemeProvider>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
        </QueryClientProvider>
      </ThemeProvider>
    </StylesProvider>
  );
};

export default MyApp;
