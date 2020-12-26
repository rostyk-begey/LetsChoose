import React, { useEffect } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Header, Card, Grid, Page as TablerPage } from 'tabler-react';
import { Prompt, useParams, useHistory } from 'react-router-dom';

import Page from '../../components/Page';
import { useGameState, useGameChoose } from '../../hooks/api/game';
import { ContestItem } from '@lets-choose/common';

import './index.scss';

const GamePage: React.FC = () => {
  const baseClassName = 'game-page';
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
                  {pair.map(({ _id, title, image }: ContestItem) => (
                    <Grid.Col lg={6} key={_id}>
                      <div className="media mb-3" onClick={() => onChoose(_id)}>
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
