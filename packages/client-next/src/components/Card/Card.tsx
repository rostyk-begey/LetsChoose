import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import React from 'react';
import styles from '../../assets/jss/material-kit-react/components/cardStyle';

interface Props {
  className?: string;
  type?: 'plain' | 'carousel';
}

const useStyles = makeStyles(styles);

const Card: React.FC<Props> = ({ className, children, type }) => {
  const classes = useStyles();
  const cardClasses = classNames(
    classes.card,
    {
      [classes.card]: true,
      [classes.cardPlain]: type === 'plain',
      [classes.cardCarousel]: type === 'carousel',
    },
    className,
  );

  return <div className={cardClasses}>{children}</div>;
};

export default Card;
