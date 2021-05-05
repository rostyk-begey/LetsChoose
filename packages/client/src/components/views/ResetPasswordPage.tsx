import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import RouterLink from 'next/link';
import { useRouter } from 'next/router';
import { AuthResetPasswordDto } from '@lets-choose/common';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import { FormTextInputProps } from '../common/FormTextInput';
import ROUTES from '../../utils/routes';
import { useApiResetPassword } from '../../hooks/api/auth';
import AuthFormCard from '../common/AuthFormCard';
import PasswordTextInput from '../common/PasswordTextInput';
import InputWithIcon from '../common/InputWithIcon';
import PageWithForm from '../common/PageWithForm';

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

const ResetPasswordPage: React.FC = () => {
  const router = useRouter();
  const token = router.query.token as string;
  const {
    mutate: resetPassword,
    ...resetPasswordQuery
  } = useApiResetPassword();
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

export default ResetPasswordPage;
