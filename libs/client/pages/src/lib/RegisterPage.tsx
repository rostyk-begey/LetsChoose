import React from 'react';
import { NextSeo } from 'next-seo';
import { useSnackbar } from 'notistack';
import { AuthRegisterDto } from '@lets-choose/common/dto';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import RouterLink from 'next/link';
import { GoogleLoginResponse } from 'react-google-login';
import { useForm, FormProvider } from 'react-hook-form';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import AlternateEmailOutlinedIcon from '@mui/icons-material/AlternateEmailOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

import {
  FormTextInput,
  FormTextInputProps,
  AuthFormCardWithOAuth,
  PasswordTextInput,
  InputWithIcon,
  PageWithForm,
} from '@lets-choose/client/components';
import { authApi, useCurrentUser } from '@lets-choose/client/hooks';
import { ROUTES } from '@lets-choose/client/utils';
import { useMutation } from 'react-query';

const inputs: Record<keyof AuthRegisterDto, FormTextInputProps> = {
  email: {
    name: 'email',
    validation: {
      required: 'Please enter an email',
    },
    fieldProps: {
      type: 'email',
      label: 'Email',
      variant: 'outlined',
    },
  },
  username: {
    name: 'username',
    validation: {
      required: 'Please enter a username',
      pattern: {
        value: /^[a-zA-Z._0-9]+$/,
        message:
          'Please use only english letters, numbers, dots and underscores',
      },
      minLength: {
        value: 3,
        message: 'Username should have at least 3 characters',
      },
    },
    fieldProps: {
      type: 'text',
      label: 'Username',
      variant: 'outlined',
    },
  },
  password: {
    name: 'password',
    validation: {
      required: 'Please enter a password',
      minLength: {
        value: 6,
        message: 'Password should have at least 6 characters',
      },
    },
    fieldProps: {
      type: 'password',
      label: 'Password',
      variant: 'outlined',
      autoComplete: 'current-password',
    },
  },
};

export const RegisterPage: React.FC = () => {
  const { refetch: refetchCurrentUser } = useCurrentUser({
    redirectTo: ROUTES.HOME,
    redirectIfFound: true,
  });
  const { enqueueSnackbar } = useSnackbar();
  const form = useForm<AuthRegisterDto>({});
  const mutationConfig = {
    onSuccess: () => refetchCurrentUser(),
    onError: (e: any) => {
      enqueueSnackbar(e.response.data.message, { variant: 'error' });
    },
  };
  const { mutate: register, ...registerQuery } = useMutation(
    authApi.register,
    mutationConfig,
  );
  const { mutate: googleLogin, ...googleLoginQuery } = useMutation(
    authApi.loginGoogle,
    mutationConfig,
  );
  const onOAuthSuccess = ({ tokenId: token }: GoogleLoginResponse) => {
    googleLogin({ token });
  };
  const onFormSubmit = form.handleSubmit((data) => {
    register(data);
  });

  return (
    <PageWithForm>
      <NextSeo title="Sign up" />
      <FormProvider {...form}>
        <AuthFormCardWithOAuth
          googleButtonLabel="Sign up with google"
          /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
          // @ts-ignore
          onOAuthSuccess={onOAuthSuccess}
          title="Sign up"
          submitButtonText="Sign up"
          onSubmit={onFormSubmit}
          submitDisabled={registerQuery.isLoading || googleLoginQuery.isLoading}
          cardAfter={
            <Grid container justifyContent="flex-end">
              <Grid item>
                <RouterLink href={ROUTES.LOGIN} passHref>
                  <Link variant="body2">Already have an account? Log in</Link>
                </RouterLink>
              </Grid>
            </Grid>
          }
        >
          <InputWithIcon icon={AccountCircleOutlinedIcon}>
            <FormTextInput {...inputs.username} />
          </InputWithIcon>
          <InputWithIcon icon={AlternateEmailOutlinedIcon}>
            <FormTextInput {...inputs.email} />
          </InputWithIcon>
          <InputWithIcon icon={LockOutlinedIcon}>
            <PasswordTextInput {...inputs.password} />
          </InputWithIcon>
        </AuthFormCardWithOAuth>
      </FormProvider>
    </PageWithForm>
  );
};
