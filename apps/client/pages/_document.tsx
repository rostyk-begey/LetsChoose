/* eslint-disable react/display-name */
import React, { Children } from 'react';
import { themeOptions } from '@lets-choose/client/utils';
// import { ServerStyleSheets } from '@mui/material/styles';
import createEmotionServer from '@emotion/server/create-instance';
import { SimplePaletteColorOptions } from '@mui/material/styles';
import Document, { Head, Html, Main, NextScript } from 'next/document';
// import { ServerStyleSheet } from 'styled-components';
import createEmotionCache from '../lib/createEmotionCache';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* PWA primary color */}
          <meta
            name="theme-color"
            content={
              (themeOptions?.palette?.primary as SimplePaletteColorOptions).main
            }
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
          <link
            href="https://use.fontawesome.com/releases/v5.0.10/css/all.css"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with server-side generation (SSG).
MyDocument.getInitialProps = async (ctx) => {
  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client-old
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  // You can consider sharing the same emotion cache between all the SSR requests to speed up performance.
  // However, be aware that it can have global side effects.
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  // Render app and page and get the context of the page with collected side effects.
  // const sheets = new ServerStyleSheets();
  // const styledComponentsSheet = new ServerStyleSheet();
  const originalRenderPage = ctx.renderPage;

  try {
    // ctx.renderPage = () =>
    //   originalRenderPage({
    //     // eslint-disable-next-line react/display-name
    //     enhanceApp: (App: any) => (props) =>
    //       styledComponentsSheet.collectStyles(
    //         sheets.collect(<App {...props} emotionCache={cache} />),
    //       ),
    //   });

    ctx.renderPage = () =>
      originalRenderPage({
        // eslint-disable-next-line react/display-name
        enhanceApp: (App: any) => (props) =>
          <App emotionCache={cache} {...props} />,
      });

    const initialProps = await Document.getInitialProps(ctx);
    // This is important. It prevents emotion to render invalid HTML.
    // See https://github.com/mui-org/material-ui/issues/26561#issuecomment-855286153
    const emotionStyles = extractCriticalToChunks(initialProps.html);
    const emotionStyleTags = emotionStyles.styles.map((style) => (
      <style
        data-emotion={`${style.key} ${style.ids.join(' ')}`}
        key={style.key}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: style.css }}
      />
    ));

    return {
      ...initialProps,
      // Styles fragment is rendered after the app and page rendering finish.
      styles: [
        ...Children.toArray(initialProps.styles),
        ...emotionStyleTags,
        // sheets.getStyleElement(),
        // styledComponentsSheet.getStyleElement(),
      ],
    };
  } finally {
    // styledComponentsSheet.seal();
  }
};
