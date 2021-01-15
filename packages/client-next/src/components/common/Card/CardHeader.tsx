import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CardHeader, { CardHeaderProps } from '@material-ui/core/CardHeader';
import classNames from 'classnames';

import { getKeyValue } from '../../../utils/functions';

import styles from '../../../assets/jss/material-kit-react/components/cardHeaderStyle';

interface Props extends CardHeaderProps {
  className?: string;
  color?: 'warning' | 'success' | 'danger' | 'info' | 'primary';
  plain?: boolean;
}

const useStyles = makeStyles(styles);

const CustomCardHeader: React.FC<Props> = ({
  className,
  children,
  color,
  plain,
  ...rest
}) => {
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

  return (
    <CardHeader className={cardHeaderClasses} {...rest}>
      {children}
    </CardHeader>
  );
};

export default CustomCardHeader;
