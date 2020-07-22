import React from 'react';
import { Grid, Card, Page as TablerPage } from 'tabler-react';

import Page from 'app/components/Page';
import ContestCard from 'app/components/ContestCard';

import cardImage from 'assets/images/card-1.jpg';

const UserPage = () => (
  <Page>
    <TablerPage.Content>
      <Grid.Row>
        <Grid.Col lg={4}>
          <Card className="card-profile">
            <Card.Header backgroundURL="https://preview.tabler.io/demo/photos/eberhard-grossgasteiger-311213-500.jpg" />
            <Card.Body className="text-center">
              <img
                className="card-profile-img"
                src="https://preview.tabler.io/demo/faces/male/16.jpg"
              />
              <h3 className="mb-3">Peter Richards</h3>
              <p className="mb-4">
                Big belly rude boy, million dollar hustler. Unemployed.
              </p>
              <button className="btn btn-outline-primary btn-sm">
                <span className="fa fa-twitter" /> Follow
              </button>
            </Card.Body>
          </Card>
        </Grid.Col>
        <Grid.Col lg={8}>
          <Grid.Row>
            {[...Array(10).keys()].map((idx) => (
              <Grid.Col sm={12} lg={6}>
                <ContestCard
                  id={idx}
                  key={idx}
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
        </Grid.Col>
      </Grid.Row>
    </TablerPage.Content>
  </Page>
);

export default UserPage;
