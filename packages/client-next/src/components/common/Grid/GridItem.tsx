import React from 'react';
import Grid, { GridProps } from '@material-ui/core/Grid';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

interface Props extends Omit<GridProps, 'item'> {
  className?: string;
}

const styles = createStyles({
  grid: {
    position: 'relative',
    width: '100%',
    minHeight: '1px',
    paddingRight: '15px',
    paddingLeft: '15px',
    flexBasis: 'auto',
  },
});

const useStyles = makeStyles(styles);

const GridItem: React.FC<Props> = ({ children, className, ...rest }) => {
  const classes = useStyles();

  return (
    <Grid item {...rest} className={classNames(classes.grid, className)}>
      {children}
    </Grid>
  );
};

export default GridItem;
