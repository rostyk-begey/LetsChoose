import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import HomePage from 'app/pages/Home';
import LoginPage from 'app/pages/Login';
import RegisterPage from 'app/pages/Register';
import IndexPage from 'app/pages/Index';
import UserPage from 'app/pages/User';
import ContestPage from 'app/pages/Contest';

import ROUTES from 'app/utils/routes';

const useRoutes = (isAuthenticated) =>
  isAuthenticated ? (
    <Switch>
      <Route path={ROUTES.HOME} component={HomePage} exact />
      <Route path={`${ROUTES.USERS}/:id`} component={UserPage} />
      <Route path={`${ROUTES.CONTEST}/:id`} component={ContestPage} />
      <Redirect to={ROUTES.HOME} />
    </Switch>
  ) : (
    <Switch>
      <Route path={ROUTES.INDEX} component={IndexPage} exact />
      <Route path={ROUTES.LOGIN} component={LoginPage} />
      <Route path={ROUTES.REGISTER} component={RegisterPage} />
      <Redirect to={ROUTES.INDEX} />
    </Switch>
  );

export default useRoutes;
