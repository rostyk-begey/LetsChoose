import React from 'react';
import { NextSeo } from 'next-seo';
import { useForm, FormProvider } from 'react-hook-form';
import { useMutation } from 'react-query';
import RouterLink from 'next/link';
import { AuthForgotPasswordDto } from '@lets-choose/common/dto';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

import {
  FormTextInput,
  FormTextInputProps,
  AuthFormCard,
  InputWithIcon,
  PageWithForm,
} from '@lets-choose/client/components';
import { useCurrentUser, authApi } from '@lets-choose/client/hooks';
import { ROUTES } from '@lets-choose/client/utils';

const inputs: Record<string, FormTextInputProps> = {
  login: {
    name: 'login',
    validation: {
      required: 'Please enter a login',
    },
    fieldProps: {
      type: 'text',
      label: 'Username or Email',
      variant: 'outlined',
    },
  },
};

export const ForgotPasswordPage: React.FC = () => {
  const { refetch: refetchCurrentUser } = useCurrentUser({
    redirectTo: ROUTES.HOME,
    redirectIfFound: true,
  });
  const { mutateAsync: httpForgotPassword, ...httpForgotPasswordQuery } =
    useMutation(authApi.forgotPassword);
  const form = useForm<AuthForgotPasswordDto>({
    defaultValues: {
      email: '',
    },
  });

  return (
    <PageWithForm>
      <NextSeo title="Forgot password" />
      <FormProvider {...form}>
        <AuthFormCard
          title="Forgot password"
          submitDisabled={httpForgotPasswordQuery.isLoading}
          submitButtonText="Request password reset"
          onSubmit={form.handleSubmit(async (data) => {
            await httpForgotPassword(data);
            await refetchCurrentUser();
          })}
          cardAfter={
            <Grid container>
              <Grid item>
                <RouterLink href={ROUTES.LOGIN} passHref>
                  <Link variant="body2">Go back to login page</Link>
                </RouterLink>
              </Grid>
            </Grid>
          }
        >
          <InputWithIcon icon={AccountCircleOutlinedIcon}>
            <FormTextInput {...inputs.login} />
          </InputWithIcon>
        </AuthFormCard>
      </FormProvider>
    </PageWithForm>
  );
};
