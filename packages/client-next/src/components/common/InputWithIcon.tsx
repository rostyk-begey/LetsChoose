import React, { ElementType } from 'react';
import Grid from '@material-ui/core/Grid';
import makeStyles from '@material-ui/core/styles/makeStyles';

interface Props {
  icon: ElementType;
}

const useStyles = makeStyles((theme) => ({
  container: {
    margin: theme.spacing(1, 0),
  },
  inputContainer: {
    flex: 1,
    '& > *': {
      width: '100%',
    },
  },
}));

const InputWithIcon: React.FC<Props> = ({ icon: Icon, children }) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Grid container spacing={1} alignItems="center">
        <Grid item>
          <Icon />
        </Grid>
        <Grid item className={classes.inputContainer}>
          {children}
        </Grid>
      </Grid>
    </div>
  );
};

export default InputWithIcon;
