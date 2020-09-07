import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Site, Page as TablerPage, Button } from 'tabler-react';

import AuthContext from 'app/context/AuthContext';
import ROUTES from 'app/utils/routes';

import logo from '../../assets/images/logo.svg';

const newNavBarItem = (to, value, icon, useExact) => ({
  to,
  icon,
  value,
  useExact,
  LinkComponent: Link,
});

const NAV_BAR_ITEMS = [
  newNavBarItem(ROUTES.HOME, 'Feed', 'home', ROUTES.HOME),
  newNavBarItem(ROUTES.CONTESTS.NEW, 'New', 'plus', ROUTES.CONTESTS.NEW),
];

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

export const Page = ({ children }) => {
  const { logout, isAuthenticated, userId } = useContext(AuthContext);
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
        />
        {isAuthenticated && (
          <Site.Nav collapse={false} tabbed itemsObjects={NAV_BAR_ITEMS} />
        )}
        {children}
      </TablerPage.Main>
      <Site.Footer />
    </TablerPage>
  );
};

export default Page;
