import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

import { getKeyValue } from '../../utils/functions';

import styles from '../../assets/jss/material-kit-react/components/cardHeaderStyle';

interface Props {
  className?: string;
  color?: 'warning' | 'success' | 'danger' | 'info' | 'primary';
  plain?: boolean;
}

const useStyles = makeStyles(styles);

const CardHeader: React.FC<Props> = ({ className, children, color, plain }) => {
  const classes = useStyles();
  const cardHeaderClasses = classNames(
    classes.cardHeader,
    {
      [getKeyValue(classes)(
        (color + 'CardHeader') as keyof typeof styles,
      )]: color,
      [classes.cardHeaderPlain]: plain,
    },
    className,
  );

  return <div className={cardHeaderClasses}>{children}</div>;
};

export default CardHeader;
