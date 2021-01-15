import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import React from 'react';

import { getKeyValue } from '../../../utils/functions';
import styles from '../../../assets/jss/material-kit-react/components/badgeStyle';

interface Props {
  color?:
    | 'badge'
    | 'gray'
    | 'primary'
    | 'warning'
    | 'danger'
    | 'success'
    | 'info'
    | 'rose';
}

const useStyles = makeStyles(styles);

const Badge: React.FC<Props> = ({ color = 'gray', children }) => {
  const classes = useStyles();

  return (
    <span className={classNames(classes.badge, getKeyValue(classes)(color))}>
      {children}
    </span>
  );
};

export default Badge;
