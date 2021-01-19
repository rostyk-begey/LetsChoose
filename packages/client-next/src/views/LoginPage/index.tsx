import React from 'react';
import { useGoogleLogin } from 'react-google-login';
import { useForm, FormProvider } from 'react-hook-form';
import { useMutation } from 'react-query';
import RouterLink from 'next/link';
import { AuthLoginDto } from '@lets-choose/common';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

import Page from '../../components/common/Page';
import FormTextInput, {
  FormTextInputProps,
} from '../../components/common/FormTextInput';
import { useCurrentUser } from '../../hooks/api/user';
import ROUTES from '../../utils/routes';
import { authApi } from '../../hooks/api/auth';
import GoogleButtonLogo from '../../assets/icons/google-button-dark-logo.svg?sprite';

const useStyles = makeStyles(() => ({
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  buttonProgress: {
    color: 'white',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  loginBtn: {
    width: '100%',
    textTransform: 'none',
  },
  loginBtnGoogle: {
    backgroundColor: '#4285F4',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    color: 'white',
    height: '36px',
  },
  loginBtnGoogleIcon: {
    position: 'absolute',
    left: -4,
    height: 42,
  },
}));

const inputs: Record<string, FormTextInputProps> = {
  login: {
    name: 'login',
    validation: {
      required: 'Please enter a login',
    },
    fieldProps: {
      type: 'text',
      label: 'Login',
      variant: 'outlined',
      margin: 'normal',
    },
  },
  password: {
    name: 'password',
    validation: {
      required: 'Please enter a password',
    },
    fieldProps: {
      type: 'password',
      label: 'Password',
      variant: 'outlined',
      margin: 'normal',
      autoComplete: 'current-password',
    },
  },
};

const LoginPage: React.FC = () => {
  const classes = useStyles();
  const { refetch: refetchCurrentUser } = useCurrentUser({
    redirectTo: ROUTES.HOME,
    redirectIfFound: true,
  });
  const [httpLogin, httpLoginQuery] = useMutation(authApi.login);
  const [googleLogin, googleLoginQuery] = useMutation(authApi.loginGoogle);
  const form = useForm<AuthLoginDto>({
    defaultValues: {
      login: '',
      password: '',
    },
  });
  const onOAuthSuccess = async (data) => {
    await googleLogin(data);
    await refetchCurrentUser();
  };
  const { signIn, loaded } = useGoogleLogin({
    onSuccess: onOAuthSuccess,
    clientId: process.env.googleOAuthClientId as string,
    cookiePolicy: 'single_host_origin',
    redirectUri: 'postmessage',
    responseType: 'code',
  });

  return (
    <Page>
      <Container>
        <Grid container justify="center">
          <Grid item xs={4}>
            <FormProvider {...form}>
              <Card
                component="form"
                onSubmit={form.handleSubmit(async (data) => {
                  await httpLogin(data);
                  await refetchCurrentUser();
                })}
                variant="outlined"
              >
                <CardHeader
                  title={<Typography variant="h6">Log in</Typography>}
                />
                <CardContent className={classes.cardContent}>
                  <FormTextInput {...inputs.login} />
                  <FormTextInput {...inputs.password} />
                  <Box my={2} display="flex" justifyContent="stretch">
                    <Button
                      color="primary"
                      variant="contained"
                      type="submit"
                      disabled={
                        httpLoginQuery.isLoading || googleLoginQuery.isLoading
                      }
                      style={{
                        width: '100%',
                        textTransform: 'none',
                      }}
                      className={classes.loginBtn}
                    >
                      Log in
                    </Button>
                  </Box>
                  <Typography variant="body1" align="center">
                    Or
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Button
                        onClick={signIn}
                        className={classNames(
                          classes.loginBtn,
                          classes.loginBtnGoogle,
                        )}
                        disabled={
                          httpLoginQuery.isLoading || googleLoginQuery.isLoading
                        }
                      >
                        <img
                          alt=""
                          src={GoogleButtonLogo}
                          className={classes.loginBtnGoogleIcon}
                        />
                        Sign in with Google
                      </Button>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item xs>
                      <RouterLink href={ROUTES.FORGOT_PASSWORD} passHref>
                        <Link variant="body2">Forgot password?</Link>
                      </RouterLink>
                    </Grid>
                    <Grid item>
                      <RouterLink href={ROUTES.REGISTER} passHref>
                        <Link variant="body2">
                          Don&apos;t have an account? Sign Up
                        </Link>
                      </RouterLink>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </FormProvider>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default LoginPage;
