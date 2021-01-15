import React from 'react';
import { AuthRegisterDto } from '@lets-choose/common';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import RouterLink from 'next/link';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { useForm, FormProvider } from 'react-hook-form';
import { useMutation } from 'react-query';

import Button from '../../components/common/CustomButtons/Button';
import Page from '../../components/common/Page';
import FormTextInput, {
  FormTextInputProps,
} from '../../components/common/FormTextInput';
import { authApi } from '../../hooks/api/auth';
import { useCurrentUser } from '../../hooks/api/user';
import ROUTES from '../../utils/routes';

const useStyles = makeStyles(() =>
  createStyles({
    cardContent: {
      display: 'flex',
      flexDirection: 'column',
    },
  }),
);

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
      margin: 'normal',
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
      margin: 'normal',
    },
  },
  password: {
    name: 'password',
    validation: {
      required: 'Please enter a password',
    },
    fieldProps: {
      type: 'password',
      label: 'Password',
      variant: 'outlined',
      margin: 'normal',
      autoComplete: 'current-password',
    },
  },
};

const RegisterPage: React.FC = () => {
  const classes = useStyles();
  const [register, registerQuery] = useMutation(authApi.register);
  const form = useForm<AuthRegisterDto>({});
  useCurrentUser({
    redirectTo: ROUTES.HOME,
    redirectIfFound: true,
  });

  return (
    <Page>
      <Container>
        <Grid container justify="center">
          <Grid item xs={4}>
            <FormProvider {...form}>
              <Card
                component="form"
                onSubmit={form.handleSubmit((data) => {
                  register(data);
                })}
                variant="outlined"
              >
                <CardHeader
                  title={<Typography variant="h6">Sign up</Typography>}
                />
                <CardContent className={classes.cardContent}>
                  <FormTextInput {...inputs.username} />
                  <FormTextInput {...inputs.email} />
                  <FormTextInput {...inputs.password} />
                  <Button
                    color="primary"
                    type="submit"
                    disabled={registerQuery.isLoading}
                  >
                    Sign up
                  </Button>
                  <Typography variant="body1" align="center">
                    OR
                  </Typography>
                  <Button color="google">Sign up with google</Button>
                  <Button color="facebook">Sign up with facebook</Button>
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
                </CardContent>
              </Card>
            </FormProvider>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default RegisterPage;
