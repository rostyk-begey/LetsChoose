import React, { useState } from 'react';
import { Page as TablerPage, Grid, Form } from 'tabler-react';

import Page from 'app/components/Page';
import ContestCard from 'app/components/ContestCard';

import './index.scss';

import cardImage from 'assets/images/card-1.jpg';

const FILTERS = {
  POPULAR: 'POPULAR',
  NEWEST: 'NEWEST',
};

const HomePage = () => {
  const [filter, setFilter] = useState(FILTERS.POPULAR);
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
          {[...Array(10).keys()].map((idx) => (
            <Grid.Col sm={6} lg={4} key={idx}>
              <ContestCard
                id={idx}
                views={Math.floor(Math.random() * 1000)}
                likes={Math.floor(Math.random() * 1000)}
                dislikes={Math.floor(Math.random() * 1000)}
                thumbnail={cardImage}
                title="Card Title"
                excerpt="I am a very simple card. I am good at containing small bits of
            information. I am convenient because I require little markup to
            use effectively."
                tags={['music', 'movie', 'image', 'art']}
              />
            </Grid.Col>
          ))}
        </Grid.Row>
      </TablerPage.Content>
    </Page>
  );
};

export default HomePage;
