import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import React from 'react';

import styles from '../../../assets/jss/material-kit-react/components/cardBodyStyle';

interface Props {
  className?: string;
}

const useStyles = makeStyles(styles);

const CardBody: React.FC<Props> = ({ className, children }) => {
  const classes = useStyles();
  const cardBodyClasses = classNames(classes.cardBody, className);
  return <div className={cardBodyClasses}>{children}</div>;
};

export default CardBody;
