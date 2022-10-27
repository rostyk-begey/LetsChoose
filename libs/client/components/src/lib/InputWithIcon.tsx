import { ElementType, ReactNode } from 'react';
import { styled } from '@mui/material';
import Grid from '@mui/material/Grid';

export interface InputWithIconProps {
  icon: ElementType;
  children: ReactNode | ReactNode[];
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

export const InputWithIcon = ({ icon: Icon, children }: InputWithIconProps) => (
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
