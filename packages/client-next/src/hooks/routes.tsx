/*
import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import PrivateRoute from '../components/common/PrivateRoute';
import HomePage from '../pages/Home';
import LoginPage from '../pages/Login';
import RegisterPage from '../pages/Register';
import ForgotPasswordPage from '../pages/ForgotPassword';
import ResetPasswordPage from '../pages/PasswordReset';
import ConfirmEmailPage from '../pages/ConfirmEmail';
import UserPage from '../pages/User';
import GamePage from '../pages/Game';
import ContestPage from '../pages/Contest';
import CreateContestPage from '../pages/CreateContest';
import UpdateContestPage from '../pages/UpdateContestPage';

import ROUTES from '../utils/routes';

export interface IRoute {
  path: string;
  redirectTo?: string;
  allowed: boolean;
  exact: boolean;
  component: React.ElementType;
}

const useRoutes = (isAuthenticated: boolean): JSX.Element => {
  const routes: IRoute[] = [
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
    {
      path: ROUTES.FORGOT_PASSWORD,
      allowed: !isAuthenticated,
      redirectTo: ROUTES.HOME,
      component: ForgotPasswordPage,
      exact: true,
    },
    {
      path: ROUTES.RESET_PASSWORD,
      allowed: !isAuthenticated,
      redirectTo: ROUTES.HOME,
      component: ResetPasswordPage,
      exact: false,
    },
    {
      path: ROUTES.CONFIRM_EMAIL,
      allowed: !isAuthenticated,
      redirectTo: ROUTES.HOME,
      component: ConfirmEmailPage,
      exact: false,
    },
    {
      path: ROUTES.GAME,
      allowed: true,
      redirectTo: ROUTES.HOME,
      component: GamePage,
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
*/

export {};
