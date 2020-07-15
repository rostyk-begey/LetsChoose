import React, { useContext } from 'react';
import cn from 'classnames';
import { Navbar, Icon, Footer, Container } from 'react-materialize';
import { Link } from 'react-router-dom';

import AuthContext from 'app/context/AuthContext';
import ROUTES from 'app/utils/routes';

import './index.scss';

const NAV_ITEMS = [
  {
    route: ROUTES.LOGIN,
    label: 'Login',
  },
  {
    route: ROUTES.REGISTER,
    label: 'Register',
  },
];

const Page = ({ className, children, containerClassName }) => {
  const baseClassName = 'page';
  const { logout, isAuthenticated } = useContext(AuthContext);

  return (
    <div className={cn(baseClassName, className)}>
      <Navbar
        className="teal lighten-3"
        alignLinks="right"
        brand={
          <Link to={ROUTES.HOME} className="brand-logo">
            Let's Choose
          </Link>
        }
        centerChildren
        menuIcon={<Icon>menu</Icon>}
        options={{
          edge: 'left',
          inDuration: 250,
          outDuration: 200,
          preventScrolling: true,
        }}
      >
        {!isAuthenticated &&
          NAV_ITEMS.map(({ route, label }) => (
            <Link key={label} to={route}>
              {label}
            </Link>
          ))}
        {isAuthenticated && (
          <button
            type="button"
            onClick={logout}
            className={`${baseClassName}__logout-btn`}
          >
            Logout
          </button>
        )}
      </Navbar>
      <Container
        className={`${baseClassName}__page-wrapper ${containerClassName}`}
      >
        {children}
      </Container>
      <footer className={`teal lighten-3 ${baseClassName}__page-footer`}>
        <div className="footer-copyright">
          <div className="container">© 2015 Copyright Text</div>
        </div>
      </footer>
    </div>
  );
};

export default Page;
