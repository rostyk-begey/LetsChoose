import { styled } from '@mui/material/styles';
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
  StyledEngineProvider,
} from '@mui/material/styles';
import { Divider, Button, Typography } from '@mui/material';
import { red } from '@mui/material/colors';
import { useSnackbar } from 'notistack';
import { useForm, FormProvider } from 'react-hook-form';
import { useConfirm } from 'material-ui-confirm';

import { useCurrentUser, userApi, authApi } from '@lets-choose/client/hooks';
import { ROUTES } from '@lets-choose/client/utils';
import {
  FormTextInput,
  FormTextInputProps,
  Page,
  Subheader,
} from '@lets-choose/client/components';
import { useMutation } from '@tanstack/react-query';
import { SettingsPageSection } from './SettingsPageSection';

const PREFIX = 'SettingsPage';

const classes = {
  content: `${PREFIX}-content`,
  form: `${PREFIX}-form`,
  input: `${PREFIX}-input`,
  divider: `${PREFIX}-divider`,
  subheader: `${PREFIX}-subheader`,
  title: `${PREFIX}-title`,
  submitBtn: `${PREFIX}-submitBtn`,
};

const StyledPage = styled(Page)(({ theme }) => ({
  display: 'flex',
  flex: 1,
  padding: theme.spacing(3),

  [`& .${classes.content}`]: {
    margin: '0 auto',
    maxWidth: 1000,
    width: '100%',
  },

  [`& .${classes.form}`]: {
    maxWidth: 400,
  },

  [`& .${classes.input}`]: {
    display: 'flex',
    marginBottom: theme.spacing(3),
  },

  [`& .${classes.divider}`]: {
    margin: theme.spacing(0, 4, 3, 4),
  },

  [`& .${classes.subheader}`]: {
    display: 'flex',
    alignItems: 'center',
  },

  [`& .${classes.title}`]: {
    color: theme.palette.text.primary,
  },

  [`& .${classes.submitBtn}`]: {
    width: '100%',
    maxWidth: 200,
  },
}));

const inputs: Record<string, FormTextInputProps> = {
  email: {
    name: 'email',
    validation: {
      required: 'Please enter an email',
    },
    fieldProps: {
      type: 'email',
      label: 'Email',
      placeholder: 'enter your email',
      variant: 'outlined',
      InputLabelProps: {
        shrink: true,
      },
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
      placeholder: 'enter username',
      variant: 'outlined',
      InputLabelProps: {
        shrink: true,
      },
    },
  },
  password: {
    name: 'password',
    validation: {
      required: 'Current password',
    },
    fieldProps: {
      type: 'password',
      label: 'Current password',
      placeholder: 'enter your current password',
      variant: 'outlined',
      autoComplete: 'current-password',
      InputLabelProps: {
        shrink: true,
      },
    },
  },
  newPassword: {
    name: 'newPassword',
    validation: {
      required: 'New password',
    },
    fieldProps: {
      type: 'password',
      label: 'New password',
      placeholder: 'enter new password',
      variant: 'outlined',
      autoComplete: 'new-password',
      InputLabelProps: {
        shrink: true,
      },
    },
  },
  confirmPassword: {
    name: 'newPassword',
    validation: {
      required: 'New password',
    },
    fieldProps: {
      type: 'password',
      label: 'Confirm password',
      placeholder: 'confirm password',
      variant: 'outlined',
      autoComplete: 'confirm-password',
      InputLabelProps: {
        shrink: true,
      },
    },
  },
};

const redTheme = createTheme({ palette: { primary: red } });

export const SettingsPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const confirm = useConfirm();
  const {
    data: user,
    remove,
    refetch: refetchCurrentUser,
  } = useCurrentUser({ redirectTo: ROUTES.HOME });
  const mutationOptions = {
    onSuccess: async () => {
      remove();
      await refetchCurrentUser();
      enqueueSnackbar('Successfully saved', { variant: 'success' });
    },
    onError: (e: any) => {
      const message = e?.response?.data?.message || 'An error occurred';
      enqueueSnackbar(message, { variant: 'error' });
    },
  };
  const { isLoading: updateProfileIsLoading, mutate: updateProfile } =
    useMutation(userApi.updateProfile, mutationOptions);
  const { isLoading: updatePasswordIsLoading, mutate: updatePassword } =
    useMutation(authApi.updatePassword, mutationOptions);
  const { mutate: deleteAccount } = useMutation(userApi.deleteProfile);
  const profileForm = useForm<any>({
    defaultValues: {
      username: user?.username || '',
      email: user?.email || '',
    },
  });
  const passwordForm = useForm<any>({
    defaultValues: {
      password: '',
      newPassword: '',
      confirmPassword: '',
    },
  });
  const submitHandler =
    // eslint-disable-next-line @typescript-eslint/ban-types
    <T extends object>(
      onSubmit: (data: T) => void,
      selectData = (data: T) => data,
    ) => {
      return (data: T) => onSubmit(selectData(data));
    };

  const handleProfileFormSubmit = submitHandler(updateProfile);
  const handlePasswordFormSubmit = submitHandler<{
    password: string;
    newPassword: string;
  }>(updatePassword, ({ password, newPassword }) => ({
    password,
    newPassword,
  }));
  const handleDeleteClick = async () => {
    await confirm({ description: 'This action is permanent!' });
    deleteAccount();
  };
  const currentPassword = passwordForm.watch('password', '');

  return (
    <StyledPage
      subHeader={
        <Subheader className={classes.subheader}>
          <Typography variant="h5" className={classes.title}>
            Settings
          </Typography>
        </Subheader>
      }
    >
      <div className={classes.content}>
        <SettingsPageSection
          name="Profile"
          description="Changing your email address will require confirmation."
        >
          <FormProvider {...profileForm}>
            <form
              className={classes.form}
              onSubmit={profileForm.handleSubmit(handleProfileFormSubmit)}
            >
              <FormTextInput
                {...inputs.username}
                fieldProps={{
                  ...inputs.username.fieldProps,
                  className: classes.input,
                }}
              />
              <FormTextInput
                {...inputs.email}
                fieldProps={{
                  ...inputs.email.fieldProps,
                  className: classes.input,
                }}
              />
              <Button
                color="primary"
                variant="outlined"
                type="submit"
                className={classes.submitBtn}
                disabled={updateProfileIsLoading || updatePasswordIsLoading}
              >
                Save
              </Button>
            </form>
          </FormProvider>
        </SettingsPageSection>
        <SettingsPageSection
          name="Password"
          description="Changing your password will log you out from other devices."
        >
          <FormProvider {...passwordForm}>
            <form
              className={classes.form}
              onSubmit={passwordForm.handleSubmit(handlePasswordFormSubmit)}
            >
              <FormTextInput
                {...inputs.password}
                fieldProps={{
                  ...inputs.password.fieldProps,
                  className: classes.input,
                }}
              />
              <Divider className={classes.divider} />
              <FormTextInput
                {...inputs.newPassword}
                fieldProps={{
                  ...inputs.newPassword.fieldProps,
                  className: classes.input,
                }}
              />
              <FormTextInput
                {...{
                  ...inputs.confirmPassword,
                  validation: {
                    ...inputs.confirmPassword.validation,
                    validate: (value: string) => {
                      return (
                        value === currentPassword ||
                        'The passwords do not match'
                      );
                    },
                  },
                }}
                fieldProps={{
                  ...inputs.confirmPassword.fieldProps,
                  className: classes.input,
                }}
              />
              <Button
                color="primary"
                variant="outlined"
                type="submit"
                className={classes.submitBtn}
                disabled={updateProfileIsLoading || updatePasswordIsLoading}
              >
                Update password
              </Button>
            </form>
          </FormProvider>
        </SettingsPageSection>
        <SettingsPageSection
          name="Close Account"
          description={
            <>
              <b>Warning:</b> Closing your account is irreversible.
            </>
          }
        >
          <StyledEngineProvider injectFirst>
            <MuiThemeProvider theme={redTheme}>
              <Button
                color="primary"
                variant="outlined"
                type="button"
                onClick={handleDeleteClick}
                className={classes.submitBtn}
              >
                Delete this account
              </Button>
            </MuiThemeProvider>
          </StyledEngineProvider>
        </SettingsPageSection>
      </div>
    </StyledPage>
  );
};
