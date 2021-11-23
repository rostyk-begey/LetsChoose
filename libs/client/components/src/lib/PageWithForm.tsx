import React from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';

import { Page } from './Page';

const StyledPage = styled(Page)(() => ({
  display: 'flex',
  alignItems: 'center',
}));

export const PageWithForm: React.FC = ({ children }) => (
  <StyledPage>
    <Container>
      <Grid container justifyContent="center">
        {children}
      </Grid>
    </Container>
  </StyledPage>
);
