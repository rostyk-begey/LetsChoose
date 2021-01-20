import React from 'react';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import makeStyles from '@material-ui/core/styles/makeStyles';

import Page from '../Page';

const useStyles = makeStyles(() => ({
  root: {
    margin: 'auto 0',
  },
}));

const PageWithForm: React.FC = ({ children }) => {
  const classes = useStyles();

  return (
    <Page className={classes.root}>
      <Container>
        <Grid container justify="center">
          <Grid item xs={4}>
            {children}
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default PageWithForm;
