import React from 'react';
import { Link, useParams } from 'react-router-dom';
// @ts-ignore
import { Alert, Card, StandaloneFormPage } from 'tabler-react';

import ROUTES from '../../utils/routes';
import { useApiConfirmEmail } from '../../hooks/api/auth';

// @ts-ignore
import logo from 'assets/images/logo.svg';

const ConfirmEmail: React.FC = () => {
  const { token } = useParams<{ token: string }>();
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
