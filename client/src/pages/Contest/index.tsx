import React, { useContext } from 'react';
// @ts-ignore
import { Grid, Page as TablerPage } from 'tabler-react';
import { useHistory, useParams } from 'react-router-dom';

import Page from '../../components/Page';
import { useContestFind } from '../../hooks/api/contest';
import ContestPageInfoCard from '../../pages/Contest/ContestPageInfoCard';
import UserProfileContext from '../../context/UserProfileContext';
import { useGameStart } from '../../hooks/api/game';
import useGetParams from '../../hooks/getParams';
import ROUTES from '../../utils/routes';

enum TABS {
  GENERAL = 'GENERAL',
  RANKING = 'RANKING',
}

const ContestPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const { _id: userId } = useContext(UserProfileContext) || {};
  const { data: { data: contest = {} } = {} } = useContestFind(id);
  const [startGame] = useGameStart();
  // @ts-ignore
  const { author } = contest;
  const { params, updateParam } = useGetParams(
    `${ROUTES.CONTESTS.INDEX}/${id}`,
    {
      activeTab: TABS.GENERAL,
    },
  );
  const setActiveTab = (tab: TABS) => updateParam('activeTab', tab);
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
  const onStart = () => {
    // @ts-ignore
    startGame(id).then(({ data: { gameId } }) =>
      history.push(`/games/${gameId}`),
    );
  };
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
