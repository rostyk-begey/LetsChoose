import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import React from 'react';

import styles from '../../../assets/jss/material-kit-react/components/cardFooterStyle';

interface Props {
  className?: string;
}

const useStyles = makeStyles(styles);

const CardFooter: React.FC<Props> = ({ className, children }) => {
  const classes = useStyles();
  const cardFooterClasses = classNames(classes.cardFooter, className);
  return <div className={cardFooterClasses}>{children}</div>;
};

export default CardFooter;
