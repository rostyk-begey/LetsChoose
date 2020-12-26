import React from 'react';
import { Link } from 'react-router-dom';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Alert, Card, StandaloneFormPage } from 'tabler-react';

// eslint-disable-next-line import/no-unresolved,@typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import logo from 'assets/images/logo.svg';
import AuthForm from '../../components/AuthForm';
import ROUTES from '../../utils/routes';
import { useApiForgotPassword } from '../../hooks/api/auth';

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
];

const ForgotPassword: React.FC = () => {
  const [requestPasswordReset, forgotPasswordQuery] = useApiForgotPassword();

  const onSubmit = (form: any) => requestPasswordReset(form);

  return (
    <StandaloneFormPage imageURL={logo}>
      {forgotPasswordQuery.isSuccess ? (
        <Card>
          <Card.Body className="p-6">
            <Alert type="success" icon="check">
              Reset password link has been sent to your email
            </Alert>
            <div className="mt-2">
              Go back to <Link to={ROUTES.LOGIN}>login</Link>
            </div>
          </Card.Body>
        </Card>
      ) : (
        <AuthForm
          inputs={INPUTS}
          title="Reset password"
          buttonText="Reset password"
          onSubmit={onSubmit}
          buttonLoading={forgotPasswordQuery.isLoading}
          formAfter={
            <div className="mt-2">
              Go back to <Link to={ROUTES.LOGIN}>login</Link>
            </div>
          }
        />
      )}
    </StandaloneFormPage>
  );
};

export default ForgotPassword;
