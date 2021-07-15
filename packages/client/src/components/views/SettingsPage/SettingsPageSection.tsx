import React from 'react';
import { makeStyles, createStyles, Typography } from '@material-ui/core';

interface Props {
  name: string;
  description?: React.ReactElement | string;
}

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: 'flex',
      padding: theme.spacing(3, 0, 5, 0),
      '&:not(:first-child)': {
        borderTop: `1px solid ${theme.palette.divider}`,
      },
      [theme.breakpoints.down('xs')]: {
        flexDirection: 'column',
      },
    },
    info: {
      flex: '1 1 auto',
      maxWidth: '33.33%',
      width: '100%',
      marginRight: '8.33%',
      [theme.breakpoints.down('xs')]: {
        maxWidth: 'unset',
        marginRight: 0,
        marginBottom: theme.spacing(5),
      },
    },
    content: {
      flex: '1 1 auto',
    },
  }),
);

const SettingsPageSection: React.FC<Props> = ({
  name,
  description,
  children,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.info}>
        <Typography variant="h6" color="secondary">
          {name}
        </Typography>
        {description && (
          <Typography variant="caption">{description}</Typography>
        )}
      </div>
      <div className={classes.content}>{children}</div>
    </div>
  );
};

export default SettingsPageSection;
