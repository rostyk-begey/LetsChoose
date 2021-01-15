import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import styles from '../../../assets/jss/material-kit-react/components/typographyStyle';

const useStyles = makeStyles(styles);

const Muted: React.FC = ({ children }) => {
  const classes = useStyles();

  return (
    <div className={classes.defaultFontStyle + ' ' + classes.mutedText}>
      {children}
    </div>
  );
};

export default Muted;
