import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';

const styles = createStyles({
  clearfix: {
    '&:after,&:before': {
      display: 'table',
      content: '" "',
    },
    '&:after': {
      clear: 'both',
    },
  },
});

const useStyles = makeStyles(styles);

const Clearfix: React.FC = () => {
  const classes = useStyles();
  return <div className={classes.clearfix} />;
};

export default Clearfix;
