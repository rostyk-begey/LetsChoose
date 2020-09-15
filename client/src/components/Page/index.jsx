import React, { useState, useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Site, Page as TablerPage, Button } from 'tabler-react';

import AuthContext from 'app/context/AuthContext';
import ROUTES from 'app/utils/routes';

import logo from '../../assets/images/logo.svg';
import { useApiAuth } from 'app/hooks/api/auth';
import routes from 'app/utils/routes';

const newNavBarItem = (to, value, icon, useExact) => ({
  to,
  icon,
  value,
  useExact,
  LinkComponent: Link,
});

const AUTH_BUTTONS = [
  {
    value: 'Login',
    outline: true,
    to: ROUTES.LOGIN,
  },
  {
    value: 'Sign up',
    to: ROUTES.REGISTER,
  },
];

export const Page = ({ isPrivate = false, children }) => {
  const { logout, isAuthenticated, userId } = useContext(AuthContext);
  const location = useLocation();
  const [auth, authQuery] = useApiAuth();
  const [navCollapse, setNavCollapse] = useState(true);
  const navBarItems = [
    newNavBarItem(ROUTES.HOME, 'Feed', 'home', ROUTES.HOME),
    newNavBarItem(
      `${ROUTES.USERS}/${userId}`,
      'My profile',
      'user',
      ROUTES.CONTESTS.NEW,
    ),
    newNavBarItem(ROUTES.CONTESTS.NEW, 'New', 'plus', ROUTES.CONTESTS.NEW),
  ];
  const accountDropdownProps = {
    avatarURL: '/',
    name: 'Jane Pearson',
    // description: 'Administrator',
    options: [
      {
        icon: 'user',
        value: 'Profile',
        to: `${ROUTES.USERS}/${userId}`,
      },
      { icon: 'settings', value: 'Settings' },
      // { icon: 'mail', value: 'Inbox', badge: '6' },
      // { icon: 'send', value: 'Message' },
      { isDivider: true },
      { icon: 'help-circle', value: 'Need help?' },
      {
        icon: 'log-out',
        value: 'Sign out',
        onClick: () => {
          logout(ROUTES.LOGIN);
        },
      },
    ],
  };

  useEffect(() => {
    if (isPrivate) auth();
  }, []);

  useEffect(() => {
    if (isPrivate && authQuery.isError) {
      console.log(location.pathname);
      logout(`${ROUTES.LOGIN}?redirectTo=${location.pathname}`);
    }
  }, [authQuery]);

  return (
    <TablerPage>
      <TablerPage.Main>
        <Site.Header
          href={ROUTES.HOME}
          alt="Let's Choose"
          imageURL={logo}
          navItems={
            !isAuthenticated && (
              <Button.List>
                {AUTH_BUTTONS.map(({ value, to, outline = false }) => (
                  <Link
                    to={to}
                    className={`btn btn-${outline ? 'outline-' : ''}primary`}
                  >
                    {value}
                  </Link>
                ))}
              </Button.List>
            )
          }
          accountDropdown={isAuthenticated ? accountDropdownProps : undefined}
          onMenuToggleClick={() => setNavCollapse((prevState) => !prevState)}
        />
        {isAuthenticated && (
          <Site.Nav collapse={navCollapse} tabbed itemsObjects={navBarItems} />
        )}
        {children}
      </TablerPage.Main>
      <Site.Footer />
    </TablerPage>
  );
};
export default Page;
