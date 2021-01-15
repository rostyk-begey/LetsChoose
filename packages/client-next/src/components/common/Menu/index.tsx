import React, { useRef } from 'react';
import throttle from 'lodash/throttle';
import { ButtonGroup, TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';

import useQueryState from '../../../hooks/getParams';

interface Props {}

enum SORT_OPTIONS {
  POPULAR = 'POPULAR',
  NEWEST = 'NEWEST',
}

type InputCallback = (e: React.ChangeEvent<HTMLInputElement>) => void;

const Menu: React.FC<Props> = () => {
  const [sortBy, setSortBy] = useQueryState('sortBy', 'POPULAR');
  const [search, setSearch] = useQueryState('search', '');
  const { current: throttled } = useRef(
    throttle(setSearch, 1000, { leading: false }),
  );
  const handleSearch: InputCallback = ({ target: { value } }) => {
    throttled(value);
  };

  return (
    <>
      <ButtonGroup color="primary">
        <Button
          variant={sortBy === SORT_OPTIONS.POPULAR ? 'contained' : 'outlined'}
          onClick={() => setSortBy(SORT_OPTIONS.POPULAR)}
        >
          Popular
        </Button>
        <Button
          size="small"
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
        defaultValue={search}
        onChange={handleSearch}
      />
    </>
  );
};

export default Menu;
