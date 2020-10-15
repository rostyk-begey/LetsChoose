import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Alert, Card, StandaloneFormPage, Dimmer } from 'tabler-react';

import ROUTES from 'app/utils/routes';
import { useApiConfirmEmail } from 'app/hooks/api/auth';

import logo from 'assets/images/logo.svg';

const ConfirmEmail = () => {
  const { token } = useParams();
  const { isSuccess } = useApiConfirmEmail(token);

  return (
    <StandaloneFormPage imageURL={logo}>
      {isSuccess && (
        <Card>
          <Card.Body className="p-6">
            <Alert type="success" icon="check">
              Email successfully verified
            </Alert>
            <div className="mt-2">
              Go to <Link to={ROUTES.LOGIN}>login</Link>
            </div>
          </Card.Body>
        </Card>
      )}
    </StandaloneFormPage>
  );
};

export default ConfirmEmail;
