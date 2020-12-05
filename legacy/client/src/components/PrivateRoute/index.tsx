import React from 'react';
import { Redirect, Route } from 'react-router-dom';

import ROUTES from '../../utils/routes';
import { IRoute } from '../../hooks/routes';

const PrivateRoute: React.FC<IRoute> = ({
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
