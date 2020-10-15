import React, { useContext } from 'react';
import { Alert, StandaloneFormPage } from 'tabler-react';
import { Link, useHistory } from 'react-router-dom';

import AuthContext from 'app/context/AuthContext';
import useURLSearchParams from 'app/hooks/URLSearchParams';
import ROUTES from 'app/utils/routes';
import AuthForm from 'app/components/AuthForm';
import { useApiLogin } from 'app/hooks/api/auth';

import logo from 'assets/images/logo.svg';
import useAuth from 'app/hooks/auth';

const INPUTS = [
  {
    label: 'Login',
    name: 'login',
    placeholder: 'login',
    type: 'text',
    validation: {
      required: 'Please enter a login',
    },
  },
  {
    label: 'Password',
    name: 'password',
    type: 'password',
    placeholder: 'password',
    validation: {
      required: 'Please enter a password',
    },
  },
];

const LoginPage = () => {
  const query = useURLSearchParams();
  const auth = useAuth();
  const [login, loginQuery] = useApiLogin();
  const history = useHistory();
  const onSubmit = async (form) => {
    try {
      const {
        data: { accessToken },
      } = await login(form);
      auth.login(accessToken);
      const redirectTo = query.get('redirectTo');
      if (redirectTo) history.push(redirectTo);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <StandaloneFormPage imageURL={logo}>
      <AuthForm
        inputs={INPUTS}
        title="Login to your Account"
        buttonText="Login"
        onSubmit={onSubmit}
        buttonLoading={loginQuery.isLoading}
        formAfter={
          <>
            <div className="mt-2">
              <Link to={ROUTES.FORGOT_PASSWORD}>Forgot your password?</Link>
              <br />
              Don&apos;t have an account?{' '}
              <Link to={ROUTES.REGISTER}>Sign up</Link>
            </div>
            {loginQuery.isError && loginQuery.error.response.status === 403 && (
              <Alert type="warning" className="mt-2 mb-0">
                Please confirm you email address
              </Alert>
            )}
          </>
        }
      />
    </StandaloneFormPage>
  );
};

export default LoginPage;
