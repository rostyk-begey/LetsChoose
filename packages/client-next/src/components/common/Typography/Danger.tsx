import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

import styles from '../../../assets/jss/material-kit-react/components/typographyStyle';

const useStyles = makeStyles(styles);

const Danger: React.FC = ({ children }) => {
  const classes = useStyles();
  return (
    <div className={classNames(classes.defaultFontStyle, classes.dangerText)}>
      {children}
    </div>
  );
};

export default Danger;
