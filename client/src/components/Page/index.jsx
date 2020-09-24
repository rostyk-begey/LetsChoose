import React, { useState, useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Site, Page as TablerPage, Button } from 'tabler-react';
import useInterval from 'use-interval';

import AuthContext from 'app/context/AuthContext';
import UserProfileContext from 'app/context/UserProfileContext';
import ROUTES from 'app/utils/routes';
import { useApiAuth } from 'app/hooks/api/auth';
import NavBar from 'app/components/NavBar';

import './index.scss';

import logo from '../../assets/images/logo.svg';

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

export const Page = ({ isPrivate = false, children, navbarBefore }) => {
  const baseClassName = 'page-template';
  const { logout, isAuthenticated } = useContext(AuthContext);
  const { user: { username = '' } = {} } = useContext(UserProfileContext);
  const location = useLocation();
  const [auth, authQuery] = useApiAuth();
  const [navCollapse, setNavCollapse] = useState(true);
  const navBarItems = [
    newNavBarItem(ROUTES.HOME, 'Feed', 'home', ROUTES.HOME),
    newNavBarItem(
      `${ROUTES.USERS}/${username}`,
      'My profile',
      'user',
      ROUTES.CONTESTS.NEW,
    ),
    newNavBarItem(ROUTES.CONTESTS.NEW, 'New', 'plus', ROUTES.CONTESTS.NEW),
  ];
  const accountDropdownProps = {
    avatarURL: '/',
    name: `@${username}`,
    // description: 'Administrator',
    options: [
      {
        icon: 'user',
        value: 'Profile',
        to: `${ROUTES.USERS}/${username}`,
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

  // useInterval(
  //   () => {
  //     if (isPrivate) auth();
  //   },
  //   isPrivate ? 5 * 1000 : null,
  //   true,
  // );
  //
  // useEffect(() => {
  //   if (isPrivate && authQuery.isError) {
  //     logout(`${ROUTES.LOGIN}?redirectTo=${location.pathname}`);
  //   }
  // }, [authQuery]);

  return (
    <TablerPage className={baseClassName}>
      <header className={`${baseClassName}__header`}>
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
          <NavBar
            tabbed
            className={`${baseClassName}__navbar`}
            collapse={navCollapse}
            itemsObjects={navBarItems}
            before={navbarBefore}
          />
        )}
      </header>
      <TablerPage.Main className={`${baseClassName}__main`}>
        {children}
      </TablerPage.Main>
    </TablerPage>
  );
};
export default Page;
