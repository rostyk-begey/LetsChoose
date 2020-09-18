import React, { useEffect, useContext } from 'react';
import { Grid, Card, Page as TablerPage, Form } from 'tabler-react';
import { useParams } from 'react-router-dom';

import Page from 'app/components/Page';
import ContestCard from 'app/components/ContestCard';
import { useContestAll } from 'app/hooks/api/contest';
import useGetParams from 'app/hooks/getParams';
import ROUTES from 'app/utils/routes';

const SORT_OPTIONS = {
  POPULAR: 'POPULAR',
  NEWEST: 'NEWEST',
};

const UserPage = () => {
  const { username } = useParams();
  const { params, handleSearch, onInputChange } = useGetParams(
    `${ROUTES.USERS}/${username}`,
    {
      search: '',
      sortBy: SORT_OPTIONS.POPULAR,
    },
  );
  const {
    data: { data: { contests = [], totalPages, currentPage } = {} } = {},
  } = useContestAll({ author: username, ...params });

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
      <TablerPage.Content>
        <Grid.Row>
          <Grid.Col lg={4} width={12}>
            <Card className="card-profile">
              <Card.Header backgroundURL="https://preview.tabler.io/demo/photos/eberhard-grossgasteiger-311213-500.jpg" />
              <Card.Body className="text-center">
                <img
                  alt=""
                  className="card-profile-img"
                  src="https://preview.tabler.io/demo/faces/male/16.jpg"
                />
                <h3 className="mb-3">Peter Richards</h3>
                <p className="mb-4">
                  Big belly rude boy, million dollar hustler. Unemployed.
                </p>
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
                >
                  <span className="fa fa-twitter" /> Follow
                </button>
              </Card.Body>
            </Card>
          </Grid.Col>
          <Grid.Col lg={8} width={12}>
            <Grid.Row>
              {!!contests?.length &&
                contests.map((contest) => (
                  <Grid.Col width={12} md={6} lg={6} key={contest._id}>
                    <ContestCard data={contest} />
                  </Grid.Col>
                ))}
            </Grid.Row>
          </Grid.Col>
        </Grid.Row>
      </TablerPage.Content>
    </Page>
  );
};

export default UserPage;
