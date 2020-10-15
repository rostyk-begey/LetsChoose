import React, { useState, useContext } from 'react';
import { Grid, Page as TablerPage } from 'tabler-react';
import { useHistory, useParams } from 'react-router-dom';

import Page from 'app/components/Page';
import { useContestFind } from 'app/hooks/api/contest';
import ContestPageInfoCard from 'app/pages/Contest/ContestPageInfoCard';
import UserProfileContext from 'app/context/UserProfileContext';
import { useGameStart } from 'app/hooks/api/game';
import useGetParams from 'app/hooks/getParams';
import ROUTES from 'app/utils/routes';

const TABS = {
  GENERAL: 'GENERAL',
  RANKING: 'RANKING',
};

const ContestPage = () => {
  const { id } = useParams();
  const history = useHistory();
  const { _id: userId } = useContext(UserProfileContext);
  const { data: { data: contest = {} } = {}, ...contestQuery } = useContestFind(
    id,
  );
  const [startGame] = useGameStart();
  const { author } = contest;
  const { params, updateParam } = useGetParams(
    `${ROUTES.CONTESTS.INDEX}/${id}`,
    {
      activeTab: TABS.GENERAL,
    },
  );
  const setActiveTab = (tab) => updateParam('activeTab', tab);
  const tabs = [
    {
      label: 'General',
      tab: TABS.GENERAL,
    },
    {
      label: 'Ranking',
      tab: TABS.RANKING,
    },
  ];
  const onStart = () =>
    startGame(id).then(({ data: { gameId } }) =>
      history.push(`/games/${gameId}`),
    );
  const isCurrentUserAuthor = userId === author;

  return (
    <Page>
      <TablerPage.Content>
        <Grid.Row justifyContent="center">
          <Grid.Col lg={params.activeTab === TABS.GENERAL ? 8 : 12}>
            <ContestPageInfoCard
              tabs={tabs}
              contest={contest}
              activeTab={params.activeTab}
              setActiveTab={setActiveTab}
              isCurrentUserAuthor={isCurrentUserAuthor}
              onStart={onStart}
            />
          </Grid.Col>
        </Grid.Row>
      </TablerPage.Content>
    </Page>
  );
};

export default ContestPage;
