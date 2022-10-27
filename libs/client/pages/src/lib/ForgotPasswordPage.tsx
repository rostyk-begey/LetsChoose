import { NextSeo } from 'next-seo';
import { useForm, FormProvider } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
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

export const ForgotPasswordPage = () => {
  const { refetch: refetchCurrentUser } = useCurrentUser({
    redirectTo: ROUTES.HOME,
    redirectIfFound: true,
  });
  const { mutate: httpForgotPassword, isLoading } = useMutation(
    authApi.forgotPassword,
    {
      onSuccess: () => {
        refetchCurrentUser();
      },
    },
  );
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
          submitDisabled={isLoading}
          submitButtonText="Request password reset"
          onSubmit={form.handleSubmit((data) => {
            httpForgotPassword(data);
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
