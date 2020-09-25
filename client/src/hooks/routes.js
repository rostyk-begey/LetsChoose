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
import UpdateContestPage from 'app/pages/UpdateContestPage';

const useRoutes = (isAuthenticated) => {
  const routes = [
    {
      path: ROUTES.HOME,
      allowed: true,
      component: HomePage,
      exact: true,
    },
    {
      path: `${ROUTES.USERS}/:username`,
      allowed: true,
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
      path: ROUTES.CONTESTS.UPDATE,
      allowed: isAuthenticated,
      component: UpdateContestPage,
      exact: false,
    },
    {
      path: ROUTES.CONTESTS.SINGLE,
      allowed: true,
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
        // eslint-disable-next-line react/jsx-props-no-spreading
        <PrivateRoute {...route} key={route.path} />
      ))}
      <Route path="*">
        <Redirect to={ROUTES.INDEX} />
      </Route>
    </Switch>
  );
};

export default useRoutes;
