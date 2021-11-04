import React from 'react';
import { styled } from '@mui/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import json2mq from 'json2mq';
import {
  ContestGrid,
  ContestNavigation,
  Page,
  Subheader,
} from '@lets-choose/client/components';

const StyledSubheader = styled(Subheader)({
  display: 'flex',
  justifyContent: 'flex-end',
});

export const HomePage: React.FC = () => {
  const matchesMaxWidth1024 = useMediaQuery(
    json2mq({
      maxWidth: 1024,
    }),
  );

  return (
    <Page
      withContestNavigation={!matchesMaxWidth1024}
      subHeader={
        matchesMaxWidth1024 && (
          <StyledSubheader animated>
            <ContestNavigation />
          </StyledSubheader>
        )
      }
    >
      <ContestGrid />
    </Page>
  );
};
