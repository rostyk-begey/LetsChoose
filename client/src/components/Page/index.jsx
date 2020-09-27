import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Site, Page as TablerPage, Button } from 'tabler-react';

import AuthContext from 'app/context/AuthContext';
import UserProfileContext from 'app/context/UserProfileContext';
import ROUTES from 'app/utils/routes';
import NavBar from 'app/components/NavBar';

import './index.scss';

import logo from '../../assets/images/logo.svg';

const newNavBarItem = (pathname, to, value, icon, useExact) => ({
  to,
  icon,
  value,
  useExact,
  active: pathname === to,
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

export const Page = ({ children, navbarBefore }) => {
  const baseClassName = 'page-template';
  const { pathname } = useLocation();
  const { logout, isAuthenticated } = useContext(AuthContext);
  const { username, avatar } = useContext(UserProfileContext);
  const [navCollapse, setNavCollapse] = useState(true);
  const navBarItems = [
    newNavBarItem(pathname, ROUTES.HOME, 'Feed', 'home', ROUTES.HOME),
    isAuthenticated &&
      newNavBarItem(
        pathname,
        `${ROUTES.USERS}/${username}`,
        'My profile',
        'user',
        ROUTES.CONTESTS.NEW,
      ),
    newNavBarItem(
      pathname,
      ROUTES.CONTESTS.NEW,
      'New',
      'plus',
      ROUTES.CONTESTS.NEW,
    ),
  ].filter(Boolean);
  const accountDropdownProps = {
    avatarURL: avatar,
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
        <NavBar
          tabbed
          className={`${baseClassName}__navbar`}
          collapse={navCollapse}
          itemsObjects={navBarItems}
          before={navbarBefore}
        />
      </header>
      <TablerPage.Main className={`${baseClassName}__main`}>
        {children}
      </TablerPage.Main>
    </TablerPage>
  );
};
export default Page;
