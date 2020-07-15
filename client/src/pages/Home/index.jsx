import React from 'react';
import Page from 'app/components/Page';
import QuizCard from 'app/components/QuizCard';
import { Icon, TextInput } from 'react-materialize';

import './index.scss';

import cardImage from 'assets/images/card-1.jpg';

const HomePage = () => {
  const baseClassName = 'home-page';

  return (
    <Page className={baseClassName}>
      <h1 className={`${baseClassName}__title`}>Popular Quizzes</h1>
      <TextInput
        noLayout
        search
        label="Search"
        name="search"
        icon={<Icon>search</Icon>}
      />
      <div className={`${baseClassName}__cards-container`}>
        {[...Array(10).keys()].map((idx) => (
          <QuizCard
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
        ))}
      </div>
    </Page>
  );
};

export default HomePage;
