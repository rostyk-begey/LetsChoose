import React, { useCallback, useContext } from 'react';
import { Link } from 'react-router-dom';

import Page from 'app/components/Page';
import AuthForm from 'app/components/AuthForm';
import AuthContext from 'app/context/AuthContext';
import useForm from 'app/hooks/form';
import useHttp from 'app/hooks/http';
import ROUTES from 'app/utils/routes';

import './index.scss';

const INPUTS = [
  {
    noLayout: true,
    email: true,
    label: 'Email',
    name: 'email',
    validate: true,
    error: 'Please enter correct email address',
    icon: 'email',
  },
  {
    noLayout: true,
    label: 'Username',
    name: 'username',
    icon: 'account_circle',
    pattern: '/^[a-zA-Z._0-9]{3,}$/',
    error:
      'Please use only english letters, numbers, dots and underscores (min length: 3)',
    validate: true,
  },
  {
    noLayout: true,
    password: true,
    label: 'Password',
    name: 'password',
    icon: 'enhanced_encryption',
    pattern: '/^.{6,}$/',
    error: 'Password should have at least 6 characters',
    required: true,
    validate: true,
  },
];

const RegisterPage = () => {
  const baseClassName = 'register-page';
  const auth = useContext(AuthContext);
  const { request, loading, error } = useHttp();
  const { form, onChange } = useForm({ email: '', username: '', password: '' });
  const onSubmit = useCallback(async () => {
    try {
      await request(ROUTES.API.AUTH.REGISTER, 'POST', form);
      const { token, userId } = await request(
        ROUTES.API.AUTH.LOGIN,
        'POST',
        { login: form.username, password: form.password },
        {
          accepts: 'application/json',
        },
      );
      auth.login(token, userId);
    } catch (e) {
      M.toast({ html: e.message });
    }
  }, [form]);

  return (
    <Page
      className={baseClassName}
      containerClassName={`${baseClassName}__container`}
    >
      <AuthForm
        inputs={INPUTS}
        onChange={onChange}
        onSubmit={onSubmit}
        submitText="Sign Up"
        submitIcon="send"
        buttonDisabled={loading}
        formAfter={
          <span className={`${baseClassName}__form-text`}>
            Already have an account?{' '}
            <Link to={ROUTES.LOGIN} tabIndex={-1}>
              Login
            </Link>
          </span>
        }
      />
    </Page>
  );
};

export default RegisterPage;
