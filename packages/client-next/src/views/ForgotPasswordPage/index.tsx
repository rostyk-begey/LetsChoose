import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useMutation } from 'react-query';
import RouterLink from 'next/link';
import { AuthForgotPasswordDto } from '@lets-choose/common';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';

import FormTextInput, {
  FormTextInputProps,
} from '../../components/common/FormTextInput';
import { useCurrentUser } from '../../hooks/api/user';
import ROUTES from '../../utils/routes';
import { authApi } from '../../hooks/api/auth';
import AuthFormCard from '../../components/common/AuthFormCard';
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
      label: 'Username or Email',
      variant: 'outlined',
    },
  },
};

const ForgotPasswordPage: React.FC = () => {
  const { refetch: refetchCurrentUser } = useCurrentUser({
    redirectTo: ROUTES.HOME,
    redirectIfFound: true,
  });
  const {
    mutateAsync: httpForgotPassword,
    ...httpForgotPasswordQuery
  } = useMutation(authApi.forgotPassword);
  const form = useForm<AuthForgotPasswordDto>({
    defaultValues: {
      email: '',
    },
  });

  return (
    <PageWithForm>
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

export default ForgotPasswordPage;
