import React from 'react';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import { useForm, FormProvider } from 'react-hook-form';
import RouterLink from 'next/link';
import { AuthLoginDto } from '@lets-choose/common';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import FormTextInput, { FormTextInputProps } from '../common/FormTextInput';
import { useCurrentUser } from '../../hooks/api/user';
import ROUTES from '../../utils/routes';
import { authApi, useAxiosMutation } from '../../hooks/api/auth';
import AuthFormCardWithOAuth from '../common/AuthFormCardWithOAuth';
import PasswordTextInput from '../common/PasswordTextInput';
import InputWithIcon from '../common/InputWithIcon';
import PageWithForm from '../common/PageWithForm';

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
      autoComplete: 'current-password',
    },
  },
};

const LoginPage: React.FC = () => {
  useCurrentUser({
    redirectTo: ROUTES.HOME,
    redirectIfFound: true,
  });
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const { mutateAsync: httpLogin, ...httpLoginQuery } = useAxiosMutation(
    authApi.login,
    {
      onSuccess: () => router.push(ROUTES.HOME).then(),
    },
  );
  const form = useForm<AuthLoginDto>({
    defaultValues: {
      login: '',
      password: '',
    },
  });
  const { mutateAsync: googleLogin, ...googleLoginQuery } = useAxiosMutation(
    authApi.loginGoogle,
    {
      onSuccess: () => router.push(ROUTES.HOME).then(),
    },
  );
  const onOAuthSuccess = async (data) => {
    try {
      await googleLogin(data);
    } catch (e) {
      enqueueSnackbar(e.response.data.message, { variant: 'error' });
    }
  };
  const onFormSubmit = form.handleSubmit(async (data) => {
    try {
      await httpLogin(data);
    } catch (e) {
      enqueueSnackbar(e.response.data.message, { variant: 'error' });
    }
  });

  return (
    <PageWithForm>
      <FormProvider {...form}>
        <AuthFormCardWithOAuth
          title="Log in"
          googleButtonLabel="Sign in with google"
          submitDisabled={
            httpLoginQuery.isLoading || googleLoginQuery.isLoading
          }
          onOAuthSuccess={onOAuthSuccess}
          submitButtonText="Log in"
          onSubmit={onFormSubmit}
          cardAfter={
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
          }
        >
          <InputWithIcon icon={AccountCircleOutlinedIcon}>
            <FormTextInput {...inputs.login} />
          </InputWithIcon>
          <InputWithIcon icon={LockOutlinedIcon}>
            <PasswordTextInput {...inputs.password} />
          </InputWithIcon>
        </AuthFormCardWithOAuth>
      </FormProvider>
    </PageWithForm>
  );
};

export default LoginPage;
