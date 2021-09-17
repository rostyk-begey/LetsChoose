import React from 'react';
import {
  createTheme as createMuiTheme,
  Divider,
  Button,
  makeStyles,
  Typography,
  ThemeProvider as MuiThemeProvider,
} from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import { useSnackbar } from 'notistack';
import { useForm, FormProvider } from 'react-hook-form';
import { useConfirm } from 'material-ui-confirm';

import {
  useUpdateUserPassword,
  useCurrentUser,
  useUserDeleteProfile,
  useUserUpdateProfile,
} from '@lets-choose/client/hooks';
import { ROUTES } from '@lets-choose/client/utils';
import {
  FormTextInput,
  FormTextInputProps,
  Page,
  Subheader,
} from '@lets-choose/client/components';
import { SettingsPageSection } from './SettingsPageSection';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flex: 1,
    padding: theme.spacing(3),
  },
  content: {
    margin: '0 auto',
    maxWidth: 1000,
    width: '100%',
  },
  form: {
    maxWidth: 400,
  },
  input: {
    display: 'flex',
    marginBottom: theme.spacing(3),
  },
  divider: {
    margin: theme.spacing(0, 4, 3, 4),
  },
  subheader: {
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    color: theme.palette.text.primary,
  },
  submitBtn: {
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

const redTheme = createMuiTheme({ palette: { primary: red } });

export const SettingsPage: React.FC = () => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const confirm = useConfirm();
  const {
    data: { data: user } = {},
    remove,
    refetch: refetchCurrentUser,
  } = useCurrentUser({ redirectTo: ROUTES.HOME });
  const { isLoading: updateProfileIsLoading, mutateAsync: updateProfile } =
    useUserUpdateProfile();
  const { isLoading: updatePasswordIsLoading, mutateAsync: updatePassword } =
    useUpdateUserPassword();
  const { mutateAsync: deleteAccount } = useUserDeleteProfile();
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
  function submitHandler<T>(
    onSubmit: (data: T) => Promise<unknown>,
    selectData = (data: T) => data,
  ) {
    return async (data: T) => {
      try {
        await onSubmit(selectData(data));
        remove();
        await refetchCurrentUser();
        enqueueSnackbar('Successfully saved', { variant: 'success' });
      } catch (e: any) {
        const message = e?.response?.data?.message || 'An error occurred';
        enqueueSnackbar(message, { variant: 'error' });
      }
    };
  }
  const handleProfileFormSubmit = submitHandler(updateProfile);
  const handlePasswordFormSubmit = submitHandler(
    updatePassword,
    ({ password, newPassword }) => ({ password, newPassword }),
  );
  const handleDeleteClick = async () => {
    await confirm({ description: 'This action is permanent!' });
    await deleteAccount();
  };
  const currentPassword = passwordForm.watch('password', '');

  return (
    <Page
      className={classes.root}
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
        </SettingsPageSection>
      </div>
    </Page>
  );
};
