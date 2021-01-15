import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import styles from '../../../assets/jss/material-kit-react/components/typographyStyle';

const useStyles = makeStyles(styles);

const Small: React.FC = ({ children }) => {
  const classes = useStyles();
  return (
    <div className={classes.defaultFontStyle + ' ' + classes.smallText}>
      {children}
    </div>
  );
};

export default Small;
