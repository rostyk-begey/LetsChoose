import makeStyles from '@material-ui/core/styles/makeStyles';
import React, { useRef } from 'react';
import { ButtonGroup, InputAdornment, TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { SearchOutlined } from '@material-ui/icons';
import throttle from 'lodash/throttle';

import useQueryState from '../../../hooks/getParams';

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

const ContestNavigation: React.FC = () => {
  const [sortBy, setSortBy] = useQueryState('sortBy', 'POPULAR');
  const [search, setSearch] = useQueryState('search', '');
  const { current: throttled } = useRef(
    throttle(setSearch, 1000, { leading: false }),
  );
  const handleSearch: InputCallback = ({ target: { value } }) => {
    throttled(value);
  };
  const classes = useStyles();

  return (
    <>
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

export default ContestNavigation;
