import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import React from 'react';
import styles from '../../assets/jss/material-kit-react/components/badgeStyle';

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

const getKeyValue = <T extends object, U extends keyof T>(obj: T) => (key: U) =>
  obj[key];

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
