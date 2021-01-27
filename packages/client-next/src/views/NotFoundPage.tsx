import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';

import Page from '../components/common/Page';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
  },
  title: {
    margin: 'auto',
  },
}));

const NotFoundPage: React.FC = () => {
  const classes = useStyles();

  return (
    <Page className={classes.root}>
      <Typography variant="h1" className={classes.title}>
        Page not found...
      </Typography>
    </Page>
  );
};

export default NotFoundPage;
