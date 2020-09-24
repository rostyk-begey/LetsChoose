import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { StandaloneFormPage } from 'tabler-react';

import AuthForm from 'app/components/AuthForm';
import AuthContext from 'app/context/AuthContext';
import ROUTES from 'app/utils/routes';
import { useApiLogin, useApiRegister } from 'app/hooks/api/auth';

import logo from 'assets/images/logo.svg';
import useAuth from 'app/hooks/auth';

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

const RegisterPage = () => {
  const auth = useAuth();
  const [register, ...registerQuery] = useApiRegister();
  const [login, ...loginQuery] = useApiLogin();

  const onSubmit = async (form) => {
    try {
      setTimeout(() => {}, 5000);
      await register(form);
      const {
        data: { accessToken },
      } = await login({ login: form.username, password: form.password });
      auth.login(accessToken);
    } catch (e) {
      console.log(e);
      // M.toast({ html: e.message });
    }
  };

  return (
    <StandaloneFormPage imageURL={logo}>
      <AuthForm
        inputs={INPUTS}
        title="Create New Account"
        buttonText="Create Account"
        onSubmit={onSubmit}
        buttonLoading={registerQuery.isLoading || loginQuery.isLoading}
        formAfter={
          <div className="mt-2">
            Already have an account? <Link to={ROUTES.LOGIN}>Login</Link>
          </div>
        }
      />
    </StandaloneFormPage>
  );
};

export default RegisterPage;
