import React, { useEffect } from 'react';
import { AppProps } from 'next/app';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import queryClient from '../utils/queryClient';

import '../assets/scss/material-kit-react.scss';
import 'animate.css';

const MyApp = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles?.parentElement?.removeChild(jssStyles);
    }
  });

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default MyApp;
