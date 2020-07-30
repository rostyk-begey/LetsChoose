import React, { useContext } from 'react';
import { StandaloneFormPage } from 'tabler-react';
import { Link, useHistory } from 'react-router-dom';

import AuthContext from 'app/context/AuthContext';
import useHttp from 'app/hooks/http';
import useURLSearchParams from 'app/hooks/URLSearchParams';
import ROUTES from 'app/utils/routes';
import AuthForm from 'app/components/AuthForm';

const INPUTS = [
  {
    label: 'Login',
    name: 'login',
    placeholder: 'login',
    type: 'text',
    validation: {
      pattern: {
        required: 'Please enter a login',
      },
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
  const auth = useContext(AuthContext);
  const { request, loading, error } = useHttp();
  const history = useHistory();
  const onSubmit = async (form) => {
    try {
      const { token, userId } = await request(
        ROUTES.API.AUTH.LOGIN,
        'POST',
        form,
        {
          accepts: 'application/json',
        },
      );
      auth.login(token, userId);
      history.push(query.get('redirectTo'));
    } catch (e) {}
  };

  return (
    <StandaloneFormPage imageURL="">
      <AuthForm
        inputs={INPUTS}
        title="Login to your Account"
        buttonText="Login"
        onSubmit={onSubmit}
        buttonLoading={loading}
        formAfter={
          <div className="mt-2">
            Don't have an account? <Link to={ROUTES.REGISTER}>Sign up</Link>
          </div>
        }
      />
    </StandaloneFormPage>
  );
};

export default LoginPage;
