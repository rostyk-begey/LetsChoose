import React from 'react';
import { Redirect, Route } from 'react-router-dom';

import ROUTES from 'app/utils/routes';
import { IRoute } from '../../hooks/routes';

interface Props extends IRoute {}

const PrivateRoute: React.FC<Props> = ({
  allowed,
  redirectTo = ROUTES.LOGIN,
  component: Component,
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) =>
      allowed ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{ pathname: redirectTo, state: { from: props.location } }}
        />
      )
    }
  />
);

export default PrivateRoute;
