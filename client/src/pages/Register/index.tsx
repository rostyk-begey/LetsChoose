import React from 'react';
import { Link } from 'react-router-dom';
// @ts-ignore
import { Alert, Card, StandaloneFormPage } from 'tabler-react';

import AuthForm from '../../components/AuthForm';
import ROUTES from '../../utils/routes';
import { useApiRegister } from '../../hooks/api/auth';

// @ts-ignore
import logo from 'assets/images/logo.svg';

const INPUTS = [
  {
    label: 'Email',
    name: 'email',
    type: 'email',
    placeholder: 'email',
    validation: {
      required: 'Please enter an email',
    },
  },
  {
    label: 'Username',
    name: 'username',
    placeholder: 'username',
    type: 'text',
    validation: {
      pattern: {
        value: /^[a-zA-Z._0-9]+$/,
        message:
          'Please use only english letters, numbers, dots and underscores',
        minLength: {
          value: 3,
          message: 'Username should have at least 3 characters',
        },
      },
    },
  },
  {
    password: true,
    label: 'Password',
    name: 'password',
    type: 'password',
    placeholder: 'password',
    validation: {
      required: 'Please enter a password',
      minLength: {
        value: 6,
        message: 'Password should have at least 6 characters',
      },
    },
  },
];

const RegisterPage: React.FC = () => {
  const [register, registerQuery] = useApiRegister();

  const onSubmit = (form: any) => register(form);

  return (
    <StandaloneFormPage imageURL={logo}>
      {registerQuery.isSuccess ? (
        <Card>
          <Card.Body className="p-6">
            <Alert type="success" icon="check">
              User successfully registered, please check you email
            </Alert>
          </Card.Body>
        </Card>
      ) : (
        <AuthForm
          inputs={INPUTS}
          title="Create New Account"
          buttonText="Create Account"
          onSubmit={onSubmit}
          buttonLoading={registerQuery.isLoading}
          formAfter={
            <div className="mt-2">
              Already have an account? <Link to={ROUTES.LOGIN}>Login</Link>
            </div>
          }
        />
      )}
    </StandaloneFormPage>
  );
};

export default RegisterPage;
