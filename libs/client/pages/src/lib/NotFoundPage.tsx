import React from 'react';
import { NextSeo } from 'next-seo';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';

import { Page } from '@lets-choose/client/components';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
  },
  title: {
    margin: 'auto',
  },
}));

export const NotFoundPage: React.FC = () => {
  const classes = useStyles();

  return (
    <Page className={classes.root}>
      <NextSeo title="Not found" />
      <Typography variant="h1" className={classes.title}>
        Page not found...
      </Typography>
    </Page>
  );
};

export default NotFoundPage;
