import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Site, Page as TablerPage, Button } from 'tabler-react';

import AuthContext from 'app/context/AuthContext';
import ROUTES from 'app/utils/routes';

const NAV_BAR_ITEMS = [
  {
    value: 'Feed',
    to: ROUTES.HOME,
    icon: 'home',
    LinkComponent: Link,
    useExact: true,
  },
  {
    value: 'Trends',
    icon: 'search',
    to: '/data-nodes',
    LinkComponent: Link,
  },
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
  const { logout, isAuthenticated } = useContext(AuthContext);
  const accountDropdownProps = {
    avatarURL: '/',
    name: 'Jane Pearson',
    description: 'Administrator',
    options: [
      { icon: 'user', value: 'Profile' },
      { icon: 'settings', value: 'Settings' },
      { icon: 'mail', value: 'Inbox', badge: '6' },
      { icon: 'send', value: 'Message' },
      { isDivider: true },
      { icon: 'help-circle', value: 'Need help?' },
      { icon: 'log-out', value: 'Sign out', onClick: logout },
    ],
  };

  return (
    <TablerPage>
      <TablerPage.Main>
        <Site.Header
          href={ROUTES.HOME}
          alt="Let's Choose"
          imageURL="/"
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
