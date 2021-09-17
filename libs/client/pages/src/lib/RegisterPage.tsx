import React from 'react';
import { NextSeo } from 'next-seo';
import { useSnackbar } from 'notistack';
import { AuthRegisterDto } from '@lets-choose/common/dto';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import RouterLink from 'next/link';
import { GoogleLoginResponse } from 'react-google-login';
import { useForm, FormProvider } from 'react-hook-form';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import AlternateEmailOutlinedIcon from '@material-ui/icons/AlternateEmailOutlined';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';

import {
  FormTextInput,
  FormTextInputProps,
  AuthFormCardWithOAuth,
  PasswordTextInput,
  InputWithIcon,
  PageWithForm,
} from '@lets-choose/client/components';
import {
  authApi,
  useAxiosMutation,
  useCurrentUser,
} from '@lets-choose/client/hooks';
import { ROUTES } from '@lets-choose/client/utils';

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
  const loginMutationConfig: any = {
    onSuccess: () => refetchCurrentUser().then(),
  };
  const { mutateAsync: register, ...registerQuery } = useAxiosMutation(
    authApi.register,
    loginMutationConfig,
  );
  const { mutateAsync: googleLogin, ...googleLoginQuery } = useAxiosMutation(
    authApi.loginGoogle,
    loginMutationConfig,
  );
  const onOAuthSuccess = async ({ tokenId: token }: GoogleLoginResponse) => {
    try {
      await googleLogin({ token });
    } catch (e: any) {
      // TODO: ts any
      enqueueSnackbar(e.response.data.message, { variant: 'error' });
    }
  };
  const onFormSubmit = form.handleSubmit(async (data) => {
    try {
      await register(data);
    } catch (e: any) {
      // TODO: ts any
      enqueueSnackbar(e.response.data.message, { variant: 'error' });
    }
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
