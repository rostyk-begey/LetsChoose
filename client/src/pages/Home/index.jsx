import React, { useState } from 'react';
import { Page as TablerPage, Grid, Form } from 'tabler-react';
import { useScrollPosition } from '@n8tb1t/use-scroll-position';

import Page from 'app/components/Page';
import ContestCard from 'app/components/ContestCard';
import { useContestAll } from 'app/hooks/api/contest';
import useGetParams from 'app/hooks/getParams';
import ROUTES from 'app/utils/routes';

const SORT_OPTIONS = {
  POPULAR: 'POPULAR',
  NEWEST: 'NEWEST',
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
