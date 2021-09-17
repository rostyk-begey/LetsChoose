import React from 'react';
import {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
  useGoogleLogin,
} from 'react-google-login';
import { Typography, Grid, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Image from 'next/image';

import { AuthFormCard, AuthFormCardProps } from './AuthFormCard';

export interface AuthFormCardWithOAuthProps extends AuthFormCardProps {
  googleButtonLabel: string;
  onOAuthSuccess: (
    response: GoogleLoginResponse | GoogleLoginResponseOffline,
  ) => void;
}

const googleIconHeight = 42;

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
    height: googleIconHeight,
  },
}));

export const AuthFormCardWithOAuth: React.FC<AuthFormCardWithOAuthProps> = ({
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
    uxMode: 'popup',
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
                <div className={classes.loginBtnGoogleIcon}>
                  <Image
                    alt=""
                    src="/images/google-button-dark-logo.svg"
                    width={googleIconHeight}
                    height={googleIconHeight}
                    loader={({ src }) => src}
                  />
                </div>
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
