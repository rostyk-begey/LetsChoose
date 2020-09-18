import React, { useRef, useCallback, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Page as TablerPage, Grid, Form, Container } from 'tabler-react';
import { throttle } from 'lodash';
import { useScrollPosition } from '@n8tb1t/use-scroll-position';

import Page from 'app/components/Page';
import ContestCard from 'app/components/ContestCard';
import { useContestAll } from 'app/hooks/api/contest';
import useURLSearchParams from 'app/hooks/URLSearchParams';
import ROUTES from 'app/utils/routes';

const SORT_OPTIONS = {
  POPULAR: 'POPULAR',
  NEWEST: 'NEWEST',
};

const useGetParams = (baseUrl, defaultParams) => {
  const history = useHistory();
  const query = useURLSearchParams();
  const [params, setParams] = useState(defaultParams);

  // Restore params from URL
  useEffect(() => {
    const newPrams = Object.keys(defaultParams).reduce((acc, key) => {
      const param = query.get(key);
      if (param) acc[key] = param;
      return acc;
    }, {});
    setParams((prevState) => ({
      ...prevState,
      ...newPrams,
    }));
  }, []);

  const updateParam = useCallback(
    (name, value) => {
      const newParams = {
        ...params,
        [name]: value,
      };
      setParams(newParams);
      const urlParams = Object.entries(newParams).reduce((acc, [key, val]) => {
        if (val) acc.append(key, val);
        return acc;
      }, new URLSearchParams());
      history.push(`${baseUrl}?${urlParams}`);
    },
    [params],
  );
  const onInputChange = ({ target: { name, value } }) =>
    updateParam(name, value);

  const { current: throttled } = useRef(
    throttle(updateParam, 1000, { leading: false }),
  );
  const handleSearch = ({ target: { name, value } }) => throttled(name, value);

  return { params, handleSearch, onInputChange };
};

const HomePage = () => {
  const baseClassName = 'home-page';
  const { params, handleSearch, onInputChange } = useGetParams(ROUTES.HOME, {
    search: '',
    sortBy: SORT_OPTIONS.POPULAR,
  });
  const { data = {}, ...contestsQuery } = useContestAll({
    ...params,
    perPage: 10,
    page: 1,
  });
  const { data: { contests = [], currentPage, totalPages } = {} } = data;

  const [isScrolled, setIsScrolled] = useState(false);
  useScrollPosition(
    ({ currPos }) => {
      const isShow = currPos.y < 0;
      if (isShow !== isScrolled) setIsScrolled(isShow);
    },
    [isScrolled],
  );

  return (
    <Page
      isPrivate
      navbarBefore={
        <Grid.Col lg={5} className="ml-auto mt-4 mt-lg-0" ignoreCol>
          <div className="page-options d-flex">
            <Form.SelectGroup className="mr-2" canSelectMultiple={false}>
              <Form.SelectGroupItem
                className="mb-0"
                type="radio"
                label="Popular"
                value={SORT_OPTIONS.POPULAR}
                checked={params.sortBy === SORT_OPTIONS.POPULAR}
                onChange={onInputChange}
                name="sortBy"
              />
              <Form.SelectGroupItem
                className="mb-0"
                type="radio"
                label="Newest"
                value={SORT_OPTIONS.NEWEST}
                checked={params.sortBy === SORT_OPTIONS.NEWEST}
                onChange={onInputChange}
                name="sortBy"
              />
            </Form.SelectGroup>
            <div className="input-icon">
              <input
                name="search"
                className="form-control"
                type="text"
                placeholder="Search for..."
                defaultValue={params.search}
                onChange={handleSearch}
              />
              <span className="input-icon-addon">
                <i className="fe fe-search" />
              </span>
            </div>
          </div>
        </Grid.Col>
      }
    >
      <TablerPage.Content className={`${baseClassName}__content`}>
        <Grid.Row>
          {contestsQuery.isSuccess &&
            contests.map((contest) => (
              <Grid.Col width={12} md={6} lg={4} key={contest._id}>
                <ContestCard data={contest} />
              </Grid.Col>
            ))}
        </Grid.Row>
      </TablerPage.Content>
    </Page>
  );
};

export default HomePage;
