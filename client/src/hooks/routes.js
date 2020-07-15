import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import HomePage from 'app/pages/Home';
import LoginPage from 'app/pages/Login';
import RegisterPage from 'app/pages/Register';
import IndexPage from 'app/pages/Index';

const useRoutes = (isAuthenticated) => {
  if (isAuthenticated) {
    return (
      <Switch>
        <Route path="/home" exact>
          <HomePage />
        </Route>
        <Redirect to="/home" />
      </Switch>
    );
  }

  return (
    <Switch>
      <Route path="/" exact>
        <IndexPage />
      </Route>
      <Route path="/login">
        <LoginPage />
      </Route>
      <Route path="/register">
        <RegisterPage />
      </Route>
      <Redirect to="/" />
    </Switch>
  );
};

export default useRoutes;
