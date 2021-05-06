import { NextSeo } from 'next-seo';
import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import json2mq from 'json2mq';

import ContestGrid from '../common/ContestGrid';
import ContestNavigation from '../common/ContestNavigation';
import Page from '../common/Page';
import Subheader from '../common/Subheader';

const useStyles = makeStyles({
  subheader: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
});

const HomePage: React.FC = () => {
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
      <NextSeo
        openGraph={{
          images: [
            {
              url: '/images/logo.png',
              alt: "Let'sChoose",
            },
          ],
        }}
      />
      <ContestGrid />
    </Page>
  );
};

export default HomePage;
