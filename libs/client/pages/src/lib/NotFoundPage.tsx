import { styled } from '@mui/material/styles';
import { NextSeo } from 'next-seo';
import Typography from '@mui/material/Typography';

import { Page } from '@lets-choose/client/components';

const PREFIX = 'NotFoundPage';

const classes = {
  title: `${PREFIX}-title`,
};

const StyledPage = styled(Page)({
  display: 'flex',

  [`& .${classes.title}`]: {
    margin: 'auto',
  },
});

export const NotFoundPage = () => {
  return (
    <StyledPage>
      <NextSeo title="Not found" />
      <Typography variant="h1" className={classes.title}>
        Page not found...
      </Typography>
    </StyledPage>
  );
};
