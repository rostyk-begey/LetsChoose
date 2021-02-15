import React from 'react';
import { AuthRegisterDto } from '@lets-choose/common';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import RouterLink from 'next/link';
import { useForm, FormProvider } from 'react-hook-form';
import { useMutation } from 'react-query';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import AlternateEmailOutlinedIcon from '@material-ui/icons/AlternateEmailOutlined';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';

import FormTextInput, {
  FormTextInputProps,
} from '../../components/common/FormTextInput';
import { authApi } from '../../hooks/api/auth';
import { useCurrentUser } from '../../hooks/api/user';
import ROUTES from '../../utils/routes';
import AuthFormCardWithOAuth from '../../components/common/AuthFormCardWithOAuth';
import PasswordTextInput from '../../components/common/PasswordTextInput';
import InputWithIcon from '../../components/common/InputWithIcon';
import PageWithForm from '../../components/common/PageWithForm';

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

const RegisterPage: React.FC = () => {
  const { refetch: refetchCurrentUser } = useCurrentUser({
    redirectTo: ROUTES.HOME,
    redirectIfFound: true,
  });
  const { mutateAsync: register, ...registerQuery } = useMutation(
    authApi.register,
  );
  const form = useForm<AuthRegisterDto>({});
  const { mutateAsync: googleLogin, ...googleLoginQuery } = useMutation(
    authApi.loginGoogle,
  );
  const onOAuthSuccess = async (data) => {
    await googleLogin(data);
    await refetchCurrentUser();
  };

  return (
    <PageWithForm>
      <FormProvider {...form}>
        <AuthFormCardWithOAuth
          googleButtonLabel="Sign up with google"
          onOAuthSuccess={onOAuthSuccess}
          title="Sign up"
          submitButtonText="Sign up"
          onSubmit={form.handleSubmit((data) => {
            register(data);
          })}
          submitDisabled={registerQuery.isLoading || googleLoginQuery.isLoading}
          cardAfter={
            <Grid container justify="flex-end">
              <Grid item>
                <Link
                  component={RouterLink}
                  href={ROUTES.LOGIN}
                  variant="body2"
                >
                  Already have an account? Log in
                </Link>
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

export default RegisterPage;
