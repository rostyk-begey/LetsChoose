import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import { GoogleLoginResponse } from 'react-google-login';
import { useForm, FormProvider } from 'react-hook-form';
import RouterLink from 'next/link';
import { AuthLoginDto } from '@lets-choose/common/dto';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import {
  FormTextInput,
  FormTextInputProps,
  AuthFormCardWithOAuth,
  PasswordTextInput,
  InputWithIcon,
  PageWithForm,
} from '@lets-choose/client/components';
import { useCurrentUser, authApi } from '@lets-choose/client/hooks';
import { ROUTES } from '@lets-choose/client/utils';
import { useMutation } from '@tanstack/react-query';

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

export const LoginPage = () => {
  useCurrentUser({
    redirectTo: ROUTES.HOME,
    redirectIfFound: true,
  });
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const mutationConfig = {
    onSuccess: () => router.push(ROUTES.HOME).then(),
    onError: (e: any) => {
      enqueueSnackbar(e.response.data.message, { variant: 'error' });
    },
  };
  const { mutate: httpLogin, ...httpLoginQuery } = useMutation(
    authApi.login,
    mutationConfig,
  );
  const form = useForm<AuthLoginDto>({
    defaultValues: {
      login: '',
      password: '',
    },
  });
  const { mutate: googleLogin, ...googleLoginQuery } = useMutation(
    authApi.loginGoogle,
    mutationConfig,
  );
  const onOAuthSuccess = ({ tokenId: token }: GoogleLoginResponse) => {
    googleLogin({ token });
  };
  const onFormSubmit = form.handleSubmit((data) => {
    httpLogin(data);
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
          /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
          // @ts-ignore
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
