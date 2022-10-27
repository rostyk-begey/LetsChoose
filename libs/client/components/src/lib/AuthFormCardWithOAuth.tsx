import { styled } from '@mui/material/styles';
import {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
  useGoogleLogin,
} from 'react-google-login';
import { Typography, Grid } from '@mui/material';
import Button from '@mui/material/Button';
import Image from 'next/image';

import { AuthFormCard, AuthFormCardProps } from './AuthFormCard';

const googleButtonColor = '#4285F4';
const googleButtonHoverColor = '#3367D6';

const GoogleLoginButton = styled(Button)(({ theme }) => ({
  width: '100%',
  textTransform: 'none',
  backgroundColor: googleButtonColor,
  border: `1px solid ${googleButtonColor}`,
  overflow: 'hidden',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  color: theme.palette.common.white,
  height: '36px',
  margin: theme.spacing(2, 0),

  '&:hover': {
    backgroundColor: googleButtonHoverColor,
  },

  '& > div': {
    position: 'absolute',
    left: -4,
    height: googleIconHeight,
  },
}));

export interface AuthFormCardWithOAuthProps extends AuthFormCardProps {
  googleButtonLabel: string;
  onOAuthSuccess: (
    response: GoogleLoginResponse | GoogleLoginResponseOffline,
  ) => void;
}

const googleIconHeight = 42;

export const AuthFormCardWithOAuth = ({
  onOAuthSuccess,
  googleButtonLabel,
  cardAfter,
  ...props
}: AuthFormCardWithOAuthProps) => {
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
              <GoogleLoginButton
                onClick={signIn}
                disabled={props.submitDisabled}
              >
                <div>
                  <Image
                    alt=""
                    src="/images/google-button-dark-logo.svg"
                    width={googleIconHeight}
                    height={googleIconHeight}
                    loader={({ src }) => src}
                  />
                </div>
                {googleButtonLabel}
              </GoogleLoginButton>
            </Grid>
          </Grid>
          {cardAfter}
        </>
      }
    />
  );
};
