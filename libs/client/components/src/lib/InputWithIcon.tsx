import React, { ElementType } from 'react';
import { styled } from '@mui/material';
import Grid from '@mui/material/Grid';

export interface InputWithIconProps {
  icon: ElementType;
}

const PREFIX = 'InputWithIcon';

const classes = {
  inputContainer: `${PREFIX}-inputContainer`,
};

const Root = styled('div')(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${classes.inputContainer}`]: {
    flex: 1,
    '& > *': {
      width: '100%',
    },
  },
}));

export const InputWithIcon: React.FC<InputWithIconProps> = ({
  icon: Icon,
  children,
}) => (
  <Root>
    <Grid container spacing={1} alignItems="center">
      <Grid item>
        <Icon />
      </Grid>
      <Grid item className={classes.inputContainer}>
        {children}
      </Grid>
    </Grid>
  </Root>
);
