import React, { useRef, useState } from 'react';
import ButtonGroup from '@mui/material/ButtonGroup';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SearchOutlined from '@mui/icons-material/SearchOutlined';
import throttle from 'lodash/throttle';

import { useQueryState } from '@lets-choose/client/hooks';

enum SORT_OPTIONS {
  POPULAR = 'POPULAR',
  NEWEST = 'NEWEST',
}

type InputCallback = (e: React.ChangeEvent<HTMLInputElement>) => void;

export const ContestNavigation: React.FC = () => {
  const [sortBy, setSortBy] = useQueryState('sortBy', 'POPULAR');
  const [searchQuery, setSearchQuery] = useQueryState('search', '');
  const [search, setSearch] = useState<string>();
  const { current: throttled } = useRef(
    throttle(setSearchQuery, 1000, { leading: false }),
  );
  const handleSearch: InputCallback = ({ target: { value } }) => {
    throttled(value);
    setSearch(value);
  };

  return (
    <>
      <ButtonGroup color="primary" disableElevation>
        <Button
          sx={{ width: 100 }}
          variant={sortBy === SORT_OPTIONS.POPULAR ? 'contained' : 'outlined'}
          onClick={() => setSortBy(SORT_OPTIONS.POPULAR)}
        >
          Popular
        </Button>
        <Button
          sx={{ width: 100 }}
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
        sx={{
          maxWidth: 300,
          width: '100%',
          m: 0,
          ml: 1,
        }}
        value={search ?? searchQuery}
        InputProps={{
          sx: {
            height: 36,
          },
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
