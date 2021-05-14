import React from 'react';
import {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
  useGoogleLogin,
} from 'react-google-login';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

import AuthFormCard, { AuthFormCardProps } from './AuthFormCard';
import GoogleButtonLogo from '../../assets/icons/google-button-dark-logo.svg?sprite';

interface Props extends AuthFormCardProps {
  googleButtonLabel: string;
  onOAuthSuccess: (
    response: GoogleLoginResponse | GoogleLoginResponseOffline,
  ) => void;
}

const useStyles = makeStyles((theme) => ({
  loginBtnGoogle: {
    width: '100%',
    textTransform: 'none',
    backgroundColor: '#4285F4',
    border: '1px solid #4285F4',
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    color: 'white',
    height: '36px',
    transition: 'all 0.25s ease-in-out',
    margin: theme.spacing(2, 0),
    '&:hover': {
      backgroundColor: '#3367D6',
    },
  },
  loginBtnGoogleIcon: {
    position: 'absolute',
    left: -4,
    height: 42,
  },
}));

const AuthFormCardWithOAuth: React.FC<Props> = ({
  onOAuthSuccess,
  googleButtonLabel,
  cardAfter,
  ...props
}) => {
  const classes = useStyles();
  const { signIn } = useGoogleLogin({
    onSuccess: onOAuthSuccess,
    clientId: process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID as string,
    cookiePolicy: 'single_host_origin',
    redirectUri: 'postmessage',
    responseType: 'id_token',
  });

  return (
    <AuthFormCard
      {...props}
      cardAfter={
        <>
          <Typography variant="body1" align="center">
            Or
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Button
                onClick={signIn}
                disabled={props.submitDisabled}
                className={classes.loginBtnGoogle}
              >
                <img
                  alt=""
                  src={GoogleButtonLogo}
                  className={classes.loginBtnGoogleIcon}
                />
                {googleButtonLabel}
              </Button>
            </Grid>
          </Grid>
          {cardAfter}
        </>
      }
    />
  );
};

export default AuthFormCardWithOAuth;
