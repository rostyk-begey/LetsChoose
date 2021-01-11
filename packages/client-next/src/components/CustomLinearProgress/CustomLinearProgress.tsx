import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';
import { LinearProgressProps } from '@material-ui/core/LinearProgress/LinearProgress';

import { getKeyValue } from '../../utils/functions';

import styles from '../../assets/jss/material-kit-react/components/customLinearProgressStyle';

const useStyles = makeStyles(styles);

type Color =
  | 'primary'
  | 'warning'
  | 'danger'
  | 'success'
  | 'info'
  | 'rose'
  | 'gray';
type Props = { color: Color } & Omit<LinearProgressProps, 'color'>;

const CustomLinearProgress: React.FC<Props> = ({ color = 'gray' }) => {
  const classes = useStyles();
  return (
    <LinearProgress
      classes={{
        root:
          classes.root +
          ' ' +
          getKeyValue(classes)((color + 'Background') as keyof typeof styles),
        bar: `${classes.bar} ${getKeyValue(classes)(color)}`,
      }}
    />
  );
};

export default CustomLinearProgress;
