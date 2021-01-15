import React from 'react';
import { AuthLoginDto } from '@lets-choose/common';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import RouterLink from 'next/link';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import { useForm, FormProvider } from 'react-hook-form';
import { useMutation } from 'react-query';

import Button from '../../components/common/CustomButtons/Button';
import Page from '../../components/common/Page';
import FormTextInput, {
  FormTextInputProps,
} from '../../components/common/FormTextInput';
import { useCurrentUser } from '../../hooks/api/user';
import useClientAuth from '../../hooks/auth';
import ROUTES from '../../utils/routes';
import { authApi, useApiLogin } from '../../hooks/api/auth';

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
  const clientAuth = useClientAuth();
  const { refetch: refetchCurrentUser } = useCurrentUser({
    redirectTo: ROUTES.HOME,
    redirectIfFound: true,
  });
  const [httpLogin, httpLoginQuery] = useMutation(authApi.login);
  const form = useForm<AuthLoginDto>({
    defaultValues: {
      login: '',
      password: '',
    },
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
                  const response = await httpLogin(data);
                  // clientAuth.login(response?.data?.accessToken);
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
                  <Button
                    color="primary"
                    type="submit"
                    disabled={httpLoginQuery.isLoading}
                  >
                    Log in
                  </Button>
                  <Typography variant="body1" align="center">
                    OR
                  </Typography>
                  <Button color="google">Sign in with google</Button>
                  <Button color="facebook">Sign in with facebook</Button>
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
