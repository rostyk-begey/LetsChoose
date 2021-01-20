import React, { useRef } from 'react';
import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';
import Box from '@material-ui/core/Box';
import { useFloatNavigationMenuStyles } from '@mui-treasury/styles/navigationMenu/float';
import throttle from 'lodash/throttle';
import { ButtonGroup, InputAdornment, TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { SearchOutlined } from '@material-ui/icons';
import { NavMenu, NavItem } from '@mui-treasury/components/menu/navigation';
import { useCurrentUser } from '../../../hooks/api/user';

import useQueryState from '../../../hooks/getParams';
import ROUTES from '../../../utils/routes';

const useStyles = makeStyles((theme) => ({
  buttonGroup: {
    marginLeft: 'auto',
    height: '40px',
  },
  sortButton: {
    width: '100px',
  },
  marginLeft: {
    margin: theme.spacing(0, 0, 0, 1),
  },
}));

enum SORT_OPTIONS {
  POPULAR = 'POPULAR',
  NEWEST = 'NEWEST',
}

type InputCallback = (e: React.ChangeEvent<HTMLInputElement>) => void;

const NavLink: React.FC<{ active: boolean } & LinkProps> = ({
  active,
  children,
  ...props
}) => {
  return (
    <Link {...props}>
      <NavItem as="a" active={active}>
        {children}
      </NavItem>
    </Link>
  );
};

const Menu: React.FC = () => {
  const router = useRouter();
  const [sortBy, setSortBy] = useQueryState('sortBy', 'POPULAR');
  const [search, setSearch] = useQueryState('search', '');
  const { current: throttled } = useRef(
    throttle(setSearch, 1000, { leading: false }),
  );
  const handleSearch: InputCallback = ({ target: { value } }) => {
    throttled(value);
  };
  const classes = useStyles();
  const { data: { data: user } = {} } = useCurrentUser({});
  const { username = '' } = user || {};

  return (
    <>
      <Box height={40} display="flex" marginRight="auto">
        <NavMenu useStyles={useFloatNavigationMenuStyles}>
          <NavLink href={ROUTES.HOME} active={ROUTES.HOME === router.asPath}>
            Home
          </NavLink>
          {user && (
            <>
              <NavLink
                href={`${ROUTES.USERS}/${username}`}
                active={`${ROUTES.USERS}/${username}` === router.asPath}
              >
                My profile
              </NavLink>
              <NavLink
                href={ROUTES.CONTESTS.NEW}
                active={ROUTES.CONTESTS.NEW === router.asPath}
              >
                New Contest
              </NavLink>
            </>
          )}
        </NavMenu>
      </Box>
      <ButtonGroup color="primary" className={classes.buttonGroup}>
        <Button
          className={classes.sortButton}
          variant={sortBy === SORT_OPTIONS.POPULAR ? 'contained' : 'outlined'}
          onClick={() => setSortBy(SORT_OPTIONS.POPULAR)}
        >
          Popular
        </Button>
        <Button
          className={classes.sortButton}
          variant={sortBy === SORT_OPTIONS.NEWEST ? 'contained' : 'outlined'}
          onClick={() => setSortBy(SORT_OPTIONS.NEWEST)}
        >
          Newest
        </Button>
      </ButtonGroup>
      <TextField
        type="text"
        placeholder="Search"
        variant="outlined"
        size="small"
        className={classes.marginLeft}
        defaultValue={search}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchOutlined />
            </InputAdornment>
          ),
        }}
        onChange={handleSearch}
      />
    </>
  );
};

export default Menu;
