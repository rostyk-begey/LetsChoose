import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import json2mq from 'json2mq';
import {
  ContestGrid,
  ContestNavigation,
  Page,
  Subheader,
} from '@lets-choose/client/components';
import getConfig from 'next/config';

const useStyles = makeStyles({
  subheader: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
});

export const HomePage: React.FC = () => {
  const matchesMaxWidth1024 = useMediaQuery(
    json2mq({
      maxWidth: 1024,
    }),
  );
  const classes = useStyles();

  return (
    <Page
      withContestNavigation={!matchesMaxWidth1024}
      subHeader={
        matchesMaxWidth1024 && (
          <Subheader className={classes.subheader} animated>
            <ContestNavigation />
          </Subheader>
        )
      }
    >
      <ContestGrid />
    </Page>
  );
};
