import React, { ReactNode } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';

export interface AuthFormCardProps {
  title: string;
  submitButtonText: string;
  onSubmit: () => any;
  submitDisabled?: boolean;
  cardAfter: ReactNode;
}

const useStyles = makeStyles({
  root: {
    width: '100%',
    maxWidth: 400,
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  loginBtn: {
    width: '100%',
    textTransform: 'none',
  },
});

const AuthFormCard: React.FC<AuthFormCardProps> = ({
  title,
  submitButtonText,
  onSubmit,
  submitDisabled,
  cardAfter,
  children,
}) => {
  const classes = useStyles();

  return (
    <Card
      className={classes.root}
      component="form"
      onSubmit={onSubmit}
      variant="outlined"
    >
      <CardHeader title={<Typography variant="h6">{title}</Typography>} />
      <CardContent className={classes.cardContent}>
        {children}
        <Box my={2} display="flex" justifyContent="stretch">
          <Button
            color="primary"
            variant="contained"
            type="submit"
            disabled={submitDisabled}
            className={classes.loginBtn}
          >
            {submitButtonText}
          </Button>
        </Box>
        {cardAfter}
      </CardContent>
    </Card>
  );
};

export default AuthFormCard;
