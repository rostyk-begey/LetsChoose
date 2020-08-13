import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import PrivateRoute from 'app/components/PrivateRoute';
import HomePage from 'app/pages/Home';
import LoginPage from 'app/pages/Login';
import RegisterPage from 'app/pages/Register';
import IndexPage from 'app/pages/Index';
import UserPage from 'app/pages/User';
import ContestPage from 'app/pages/Contest';
import CreateContestPage from 'app/pages/CreateContest';

import ROUTES from 'app/utils/routes';

const useRoutes = (isAuthenticated) => {
  const routes = [
    {
      path: ROUTES.INDEX,
      allowed: true,
      component: IndexPage,
      exact: true,
    },
    {
      path: ROUTES.HOME,
      allowed: isAuthenticated,
      component: HomePage,
      exact: true,
    },
    {
      path: `${ROUTES.USERS}/:id`,
      allowed: isAuthenticated,
      component: UserPage,
      exact: false,
    },
    {
      path: ROUTES.CONTESTS.NEW,
      allowed: isAuthenticated,
      component: CreateContestPage,
      exact: true,
    },
    {
      path: `${ROUTES.CONTESTS.INDEX}/:id`,
      allowed: isAuthenticated,
      component: ContestPage,
      exact: false,
    },
    {
      path: ROUTES.LOGIN,
      allowed: !isAuthenticated,
      redirectTo: ROUTES.HOME,
      component: LoginPage,
      exact: false,
    },
    {
      path: ROUTES.REGISTER,
      allowed: !isAuthenticated,
      redirectTo: ROUTES.HOME,
      component: RegisterPage,
      exact: false,
    },
  ];
  return (
    <Switch>
      {routes.map((route) => (
        <PrivateRoute {...route} key={route.path} />
      ))}
      <Route path="*">
        <Redirect to={ROUTES.INDEX} />
      </Route>
    </Switch>
  );
};

export default useRoutes;
