import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useMutation } from 'react-query';
import RouterLink from 'next/link';
import { AuthLoginDto } from '@lets-choose/common';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import FormTextInput, {
  FormTextInputProps,
} from '../../components/common/FormTextInput';
import { useCurrentUser } from '../../hooks/api/user';
import ROUTES from '../../utils/routes';
import { authApi } from '../../hooks/api/auth';
import AuthFormCardWithOAuth from '../../components/common/AuthFormCardWithOAuth';
import PasswordTextInput from '../../components/common/PasswordTextInput';
import InputWithIcon from '../../components/common/InputWithIcon';
import PageWithForm from '../../components/common/PageWithForm';

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
  const [googleLogin, googleLoginQuery] = useMutation(authApi.loginGoogle);
  const onOAuthSuccess = async (data) => {
    await googleLogin(data);
    await refetchCurrentUser();
  };

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
          onSubmit={form.handleSubmit(async (data) => {
            await httpLogin(data);
            await refetchCurrentUser();
          })}
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
