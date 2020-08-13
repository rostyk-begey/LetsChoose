import React, { useContext, useState, useEffect } from 'react';
import { Page as TablerPage, Grid, Form } from 'tabler-react';

import Page from 'app/components/Page';
import ContestCard from 'app/components/ContestCard';
import { useContestAll } from 'app/hooks/api/contest';
import AuthContext from 'app/context/AuthContext';

import './index.scss';

const FILTERS = {
  POPULAR: 'POPULAR',
  NEWEST: 'NEWEST',
};

const HomePage = () => {
  const auth = useContext(AuthContext);
  const [filter, setFilter] = useState(FILTERS.POPULAR);
  const {
    data: { data: contests = [] } = {},
    ...contestsQuery
  } = useContestAll();
  useEffect(() => {
    if (contestsQuery.error && contestsQuery.error.response.status === 401) {
      auth.logout();
    }
  }, [contestsQuery.error]);
  return (
    <Page>
      <TablerPage.Content
        title="Popular Contests"
        subTitle="1 - 12 of 1713 photos"
        options={
          <>
            <Form.SelectGroup className="mr-2" canSelectMultiple={false}>
              <Form.SelectGroupItem
                className="mb-0"
                type="radio"
                label="Popular"
                checked={filter === FILTERS.POPULAR}
                onChange={() => setFilter(FILTERS.POPULAR)}
              />
              <Form.SelectGroupItem
                className="mb-0"
                type="radio"
                label="Newest"
                checked={filter === FILTERS.NEWEST}
                onChange={() => setFilter(FILTERS.NEWEST)}
              />
            </Form.SelectGroup>
            <Form.Input
              icon="search"
              placeholder="Search for..."
              position="append"
            />
          </>
        }
      >
        <Grid.Row>
          {contestsQuery.isSuccess &&
            contests.map((contest) => (
              <Grid.Col sm={6} lg={4} key={contest._id}>
                <ContestCard data={contest} />
              </Grid.Col>
            ))}
        </Grid.Row>
      </TablerPage.Content>
    </Page>
  );
};

export default HomePage;
