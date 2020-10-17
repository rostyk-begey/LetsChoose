import React, { useEffect } from 'react';
// @ts-ignore
import { Header, Card, Grid, Page as TablerPage } from 'tabler-react';
import { Prompt, useParams, useHistory } from 'react-router-dom';

import Page from '../../components/Page';
import { useGameState, useGameChoose } from '../../hooks/api/game';
import { ContestItem } from '../../../../server/models/ContestItem';

import './index.scss';

const GamePage: React.FC = () => {
  const baseClassName = 'game-page';
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const {
    // @ts-ignore
    data: { data: { finished, pair, round, contestId } = {} } = {},
    ...gameStateQuery
  } = useGameState(id);
  const [choose] = useGameChoose(id);
  const onChoose = async (winnerId: string) => {
    await choose(winnerId);
    await gameStateQuery.refetch();
  };
  useEffect(() => {
    if (finished) history.push(`/contests/${contestId}?activeTab=RANKING`);
  }, [finished]);

  return (
    <Page>
      <Prompt message="Are you sure you want to leave?" when={!finished} />
      <TablerPage.Content>
        <Grid.Row justifyContent="center">
          <Card>
            {gameStateQuery.isSuccess && (
              <Card.Body>
                <Header.H2 className="text-center">Round {round + 1}</Header.H2>
                {finished && (
                  <Header.H3 className="text-center">Game over</Header.H3>
                )}
                <Grid.Row>
                  {pair.map(({ id, title, image }: ContestItem) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <Grid.Col lg={6} key={id}>
                      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                      <div className="media mb-3" onClick={() => onChoose(id)}>
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
            )}
          </Card>
        </Grid.Row>
      </TablerPage.Content>
    </Page>
  );
};

export default GamePage;
