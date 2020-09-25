import React from 'react';
import { Redirect, Route } from 'react-router-dom';

import ROUTES from 'app/utils/routes';

const PrivateRoute = ({
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
