import React, { ReactNode } from 'react';
import RouterLink from 'next/link';
import { useMutation } from 'react-query';
import Button from '@material-ui/core/Button';

import { useCurrentUser } from '../../../hooks/api/user';
import { authApi } from '../../../hooks/api/auth';
import ROUTES from '../../../utils/routes';
import Header from '../Header';
import Index from '../Footer';

interface Props {
  subMenu?: ReactNode;
}

const Page: React.FC<Props> = ({ children, subMenu }) => {
  const { data: { data: user } = {}, clear, refetch } = useCurrentUser({});
  const [logout] = useMutation(authApi.logout);

  return (
    <>
      <Header
        brand={<RouterLink href={ROUTES.HOME}>Let&apos;s Choose</RouterLink>}
        rightLinks={
          user ? (
            <Button
              color="primary"
              onClick={async () => {
                await logout();
                clear();
                await refetch();
              }}
            >
              Log out
            </Button>
          ) : (
            <>
              <Button color="primary" href={ROUTES.LOGIN}>
                Log in
              </Button>
              <Button color="secondary" href={ROUTES.REGISTER}>
                Sign up
              </Button>
            </>
          )
        }
        subMenu={subMenu}
      />
      <div>{children}</div>
      <Index />
    </>
  );
};

export default Page;
