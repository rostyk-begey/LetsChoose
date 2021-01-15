import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import classNames from 'classnames';

import styles from '../../../assets/jss/material-kit-react/components/cardStyle';

interface Props {
  className?: string;
  plain?: boolean;
  carousel?: boolean;
}

const useStyles = makeStyles(styles);

const CustomCard: React.FC<Props> = ({
  className,
  children,
  plain,
  carousel,
}) => {
  const classes = useStyles();
  const cardClasses = classNames(
    classes.card,
    {
      [classes.card]: true,
      [classes.cardPlain]: plain,
      [classes.cardCarousel]: carousel,
    },
    className,
  );

  return <Card>{children}</Card>;
};

export default CustomCard;
