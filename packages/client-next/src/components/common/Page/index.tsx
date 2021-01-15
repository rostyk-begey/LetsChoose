import Button from '@material-ui/core/Button';
import React, { ReactNode } from 'react';
import { ButtonGroup, TextField } from '@material-ui/core';
import RouterLink from 'next/link';
import { useMutation } from 'react-query';

import { useCurrentUser } from '../../../hooks/api/user';
import { authApi } from '../../../hooks/api/auth';
import ROUTES from '../../../utils/routes';
// import Button from '../CustomButtons/Button';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Menu from '../Menu';

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
              // round
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
      <Footer />
    </>
  );
};

export default Page;
