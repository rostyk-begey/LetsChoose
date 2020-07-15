import React, { useCallback, useContext } from 'react';
import { Link } from 'react-router-dom';

import Page from 'app/components/Page';
import AuthContext from 'app/context/AuthContext';
import useHttp from 'app/hooks/http';
import useForm from 'app/hooks/form';
import ROUTES from 'app/utils/routes';
import AuthForm from 'app/components/AuthForm';

import './index.scss';

const INPUTS = [
  {
    noLayout: true,
    label: 'Username or Email',
    name: 'login',
    icon: 'account_circle',
  },
  {
    noLayout: true,
    password: true,
    label: 'Password',
    name: 'password',
    icon: 'enhanced_encryption',
  },
];

const LoginPage = () => {
  const baseClassName = 'login-page';
  const auth = useContext(AuthContext);
  const { request, loading, error } = useHttp();
  const { form, onChange } = useForm({ login: '', password: '' });
  const onSubmit = useCallback(async () => {
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
        className={`${baseClassName}_login-form`}
        onChange={onChange}
        onSubmit={onSubmit}
        inputs={INPUTS}
        submitText="Login"
        submitIcon="send"
        buttonDisabled={loading}
        formAfter={
          <span className={`${baseClassName}__form-text`}>
            Don't have an account?{' '}
            <Link to={ROUTES.REGISTER} tabIndex={-1}>
              Sign up
            </Link>
          </span>
        }
      />
    </Page>
  );
};

export default LoginPage;
