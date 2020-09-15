import React, { useState } from 'react';
import { Header, Card, Grid, Page as TablerPage } from 'tabler-react';
import { Prompt, useParams } from 'react-router-dom';

import Page from 'app/components/Page';
import useAuth from 'app/hooks/auth';
import { useContestFind } from 'app/hooks/api/contest';
import ContestPageInfoCard from 'app/pages/Contest/ContestPageInfoCard';

import './index.scss';

const TABS = {
  GENERAL: 'GENERAL',
  STATISTIC: 'STATISTIC',
};

const ContestPage = () => {
  const baseClassName = 'contest-page';
  const { id } = useParams();
  const { userId } = useAuth();
  const { data: { data: contest = {} } = {}, ...contestQuery } = useContestFind(
    id,
  );
  const { author } = contest;
  const [activeTab, setActiveTab] = useState(TABS.GENERAL);
  const tabs = [
    {
      label: 'General',
      tab: TABS.GENERAL,
    },
    {
      label: 'Statistic',
      tab: TABS.STATISTIC,
    },
  ];
  const [isStarted, setIsStarted] = useState(false);
  const isCurrentUserAuthor = userId === author;
  // useEffect(() => {
  //   setTotalScore(_.sum(items.map(({ score }) => score)));
  // }, [items]);
  // const { currentPair, currentRound } = useContest(
  //   items,
  //   ({ scores, compares: totalCompares }) => {
  //     setItems(
  //       items.map(({ id, score, compares, ...item }) => ({
  //         id,
  //         ...item,
  //         score: score + scores.filter((el) => el === id).length,
  //         compares: compares + totalCompares.filter((el) => el === id).length,
  //       })),
  //     );
  //     setActiveTab(TABS.STATISTIC);
  //     setIsStarted(false);
  //   },
  // );
  const currentRound = 0;
  const currentPair = [];

  return (
    <Page isPrivate>
      <Prompt message="Are you sure you want to leave?" when={isStarted} />
      <TablerPage.Content>
        <Grid.Row justifyContent="center">
          {isStarted ? (
            <Card>
              <Card.Body>
                <Header.H2 className="text-center">
                  Round {currentRound}
                </Header.H2>
                <Grid.Row>
                  {currentPair.map(({ id, title, image, onSelect }, i) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <Grid.Col lg={6} key={i}>
                      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                      <div className="media mb-3" onClick={onSelect}>
                        <img
                          className={`d-flex rounded w-100 ${baseClassName}__compare-item-image`}
                          src={image}
                          alt="Generic placeholder"
                        />
                      </div>
                      <Header.H3>{title}</Header.H3>
                    </Grid.Col>
                  ))}
                </Grid.Row>
              </Card.Body>
            </Card>
          ) : (
            <Grid.Col lg={activeTab === TABS.GENERAL ? 8 : 12}>
              <ContestPageInfoCard
                tabs={tabs}
                contest={contest}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isCurrentUserAuthor={isCurrentUserAuthor}
                onStart={() => setIsStarted(true)}
              />
            </Grid.Col>
          )}
        </Grid.Row>
      </TablerPage.Content>
    </Page>
  );
};

export default ContestPage;
