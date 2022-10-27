import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';
import { ReactNode } from 'react';

const PREFIX = 'SettingsPageSection';

const classes = {
  root: `${PREFIX}-root`,
  info: `${PREFIX}-info`,
  content: `${PREFIX}-content`,
};

const Root = styled('section')(({ theme }) => ({
  display: 'flex',
  padding: theme.spacing(3, 0, 5, 0),
  '&:not(:first-child)': {
    borderTop: `1px solid ${theme.palette.divider}`,
  },
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },

  [`& .${classes.info}`]: {
    flex: '1 1 auto',
    maxWidth: '33.33%',
    width: '100%',
    marginRight: '8.33%',
    [theme.breakpoints.down('sm')]: {
      maxWidth: 'unset',
      marginRight: 0,
      marginBottom: theme.spacing(5),
    },
  },

  [`& .${classes.content}`]: {
    flex: '1 1 auto',
  },
}));

export interface SettingsPageSectionProps {
  name: string;
  description?: ReactNode;
  children: ReactNode | ReactNode[];
}

export const SettingsPageSection = ({
  name,
  description,
  children,
}: SettingsPageSectionProps) => (
  <Root>
    <div className={classes.info}>
      <Typography variant="h6" color="secondary">
        {name}
      </Typography>
      {description && <Typography variant="caption">{description}</Typography>}
    </div>
    <div className={classes.content}>{children}</div>
  </Root>
);
