import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import RouterLink from 'next/link';
import { useRouter } from 'next/router';
import { AuthResetPasswordDto } from '@lets-choose/common/dto';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import {
  FormTextInputProps,
  AuthFormCard,
  PasswordTextInput,
  InputWithIcon,
  PageWithForm,
} from '@lets-choose/client/components';
import { ROUTES } from '@lets-choose/client/utils';
import { useApiResetPassword } from '@lets-choose/client/hooks';

const inputs: Record<string, FormTextInputProps> = {
  password: {
    name: 'password',
    validation: {
      required: 'Please enter a password',
    },
    fieldProps: {
      type: 'password',
      label: 'New password',
      variant: 'outlined',
      autoComplete: 'current-password',
    },
  },
};

export const ResetPasswordPage: React.FC = () => {
  const router = useRouter();
  const token = (router?.query?.token as string) || '';
  const { mutate: resetPassword, ...resetPasswordQuery } =
    useApiResetPassword();
  const form = useForm<AuthResetPasswordDto>({
    defaultValues: {
      password: '',
    },
  });

  return (
    <PageWithForm>
      <FormProvider {...form}>
        <AuthFormCard
          title="Reset password"
          submitDisabled={resetPasswordQuery.isLoading}
          submitButtonText="Request password"
          onSubmit={form.handleSubmit(async (data) => {
            await resetPassword({ token, data });
          })}
          cardAfter={
            <Grid container>
              <Grid item>
                <RouterLink href={ROUTES.LOGIN} passHref>
                  <Link variant="body2">Go to login page</Link>
                </RouterLink>
              </Grid>
            </Grid>
          }
        >
          <InputWithIcon icon={LockOutlinedIcon}>
            <PasswordTextInput {...inputs.password} />
          </InputWithIcon>
        </AuthFormCard>
      </FormProvider>
    </PageWithForm>
  );
};
