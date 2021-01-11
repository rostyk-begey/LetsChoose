import React from 'react';
import Grid, { GridProps } from '@material-ui/core/Grid';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

interface Props extends GridProps {
  className?: string;
}

const styles = createStyles({
  grid: {
    marginRight: '-15px',
    marginLeft: '-15px',
    width: 'auto',
  },
});

const useStyles = makeStyles(styles);

const GridContainer: React.FC<Props> = ({ children, className, ...rest }) => {
  const classes = useStyles();

  return (
    <Grid container {...rest} className={classNames(classes.grid, className)}>
      {children}
    </Grid>
  );
};

export default GridContainer;
