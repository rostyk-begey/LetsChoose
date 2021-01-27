import React, { useEffect } from 'react';
import { AppProps } from 'next/app';

import '../assets/scss/material-kit-react.scss';
import 'animate.css';

const MyApp = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles?.parentElement?.removeChild(jssStyles);
    }
  });

  return <Component {...pageProps} />;
};

export default MyApp;
