import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import styles from '../../../assets/jss/material-kit-react/components/typographyStyle';

const useStyles = makeStyles(styles);

const Quote: React.FC<{ author: string }> = ({ author, children }) => {
  const classes = useStyles();
  return (
    <blockquote className={classes.defaultFontStyle + ' ' + classes.quote}>
      <p className={classes.quoteText}>{children}</p>
      <small className={classes.quoteAuthor}>{author}</small>
    </blockquote>
  );
};

export default Quote;
