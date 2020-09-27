import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Alert, Card, StandaloneFormPage } from 'tabler-react';

import AuthForm from 'app/components/AuthForm';
import ROUTES from 'app/utils/routes';
import { useApiResetPassword } from 'app/hooks/api/auth';

import logo from 'assets/images/logo.svg';

const INPUTS = [
  {
    password: true,
    label: 'New password',
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

const PasswordReset = () => {
  const { token } = useParams();
  const [resetPassword, resetPasswordQuery] = useApiResetPassword();

  const onSubmit = (form) => resetPassword({ token, data: form });

  return (
    <StandaloneFormPage imageURL={logo}>
      {resetPasswordQuery.isSuccess ? (
        <Card>
          <Card.Body className="p-6">
            <Alert type="success" icon="check">
              Password successfully reset! <Link to={ROUTES.LOGIN}>Login</Link>
            </Alert>
          </Card.Body>
        </Card>
      ) : (
        <AuthForm
          inputs={INPUTS}
          title="Reset password"
          buttonText="Submit"
          onSubmit={onSubmit}
          buttonLoading={resetPasswordQuery.isLoading}
          formAfter={
            <div className="mt-2">
              Go to <Link to={ROUTES.LOGIN}>login</Link>
            </div>
          }
        />
      )}
    </StandaloneFormPage>
  );
};

export default PasswordReset;
