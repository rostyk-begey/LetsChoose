import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
  Media,
  Header,
  Avatar,
  Card,
  Grid,
  Nav,
  Page as TablerPage,
  Table,
  Button,
  Icon,
  Tag,
} from 'tabler-react';
import { Link, Prompt } from 'react-router-dom';
import arrayShuffle from 'shuffle-array';

import ContestCard from 'app/components/ContestCard';
import Page from 'app/components/Page';
import ROUTES from 'app/utils/routes';

import cardImage from 'assets/images/card-1.jpg';

const TABS = {
  GENERAL: 'GENERAL',
  STATISTIC: 'STATISTIC',
};

const useContest = (items) => {
  const [isStarted, setIsStarted] = useState(false);
  const [currentLevelItems, setCurrentLevelItems] = useState([]);
  const [nextLevelItems, setNextLevelItems] = useState([]);
  const [currentPair, setCurrentPair] = useState([]);
  // const [contestProgress, setContestProgress] = useState({});

  // init
  useEffect(() => {
    setCurrentLevelItems(arrayShuffle(items.keys()));
  }, []);

  const onItemSelect = useCallback(
    (id) => () => setNextLevelItems([...nextLevelItems, id]),
    [nextLevelItems],
  );
  useEffect(() => {
    const shuffledItems = arrayShuffle(items.keys());
    setCurrentLevelItems(shuffledItems);
    setCurrentPair([
      {
        ...items[shuffledItems[0]],
        onSelect: onItemSelect(currentLevelItems[0]),
      },
      {
        ...items[shuffledItems[1]],
        onSelect: onItemSelect(currentLevelItems[1]),
      },
    ]);
  }, [currentLevelItems]);

  return {
    isStarted,
    currentPair,
    onStart: () => setIsStarted(true),
    onFinish: () => setIsStarted(false),
  };
};

const ContestPage = ({ router }) => {
  const [activeTab, setActiveTab] = useState(TABS.GENERAL);
  const [isLoading, setIsLoading] = useState(false);
  const [contestData, setContestData] = useState({});
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setContestData({
        items: Array(10).map((i) => ({
          id: `item-${i}`,
          title: `Item ${i}`,
          image: cardImage,
        })),
      });
      setIsLoading(false);
    }, 2000);
  }, []);
  const onStart = useCallback(() => {
    // setContestUnfinishedItems
  }, [contestData]);
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
  const COUNTERS = [
    {
      icon: 'eye',
      data: 10,
    },
    {
      icon: 'thumbs-up',
      data: 8,
    },
    {
      icon: 'thumbs-down',
      data: 2,
    },
  ];

  return (
    <Page>
      <Prompt
        when={isStarted}
        message={() =>
          'Are you sure you want to quit? Current progress would not be saved!'
        }
      />
      <TablerPage.Content>
        <Grid.Row justifyContent="center">
          <Grid.Col lg={8}>
            <Card>
              <Card.Header className="d-flex align-items-center justify-content-between">
                <div>
                  <Nav
                    tabbed
                    items={tabs.map(({ label, tab }) => (
                      <Nav.Item
                        key={tab}
                        value={label}
                        active={tab === activeTab}
                        onClick={() => setActiveTab(tab)}
                      />
                    ))}
                  />
                </div>
                <div>
                  <Button color="primary">Start</Button>
                </div>
              </Card.Header>
              <Card.Body>
                {activeTab === TABS.GENERAL && (
                  <>
                    <Media className="mb-3">
                      {/*<img*/}
                      {/*  className="d-flex rounded"*/}
                      {/*  src="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2264%22%20height%3D%2264%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_15ec911398e%20text%20%7B%20fill%3Argba(255%2C255%2C255%2C.75)%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A10pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_15ec911398e%22%3E%3Crect%20width%3D%2264%22%20height%3D%2264%22%20fill%3D%22%23777%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2213.84375%22%20y%3D%2236.65%22%3E64x64%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E"*/}
                      {/*  alt="Generic placeholder image"*/}
                      {/*/>*/}
                      <img
                        className="d-flex rounded"
                        src={cardImage}
                        alt="Generic placeholder"
                      />
                    </Media>
                    <Grid.Row>
                      <Grid.Col className="col-6">
                        <div className="text-muted">22.04.2020</div>
                      </Grid.Col>
                      <Grid.Col className="col-6">
                        {COUNTERS.map(({ icon, data }) => (
                          <span className="icon d-none d-md-inline-block ml-3">
                            <Icon name={icon} className="mr-1" />
                            {data}
                          </span>
                        ))}
                      </Grid.Col>
                    </Grid.Row>
                    <Tag.List className="mt-2">
                      {['music', 'movie', 'image', 'art'].map((tag) => (
                        <Link
                          key={tag}
                          to={ROUTES.HOME}
                          className="tag expanded tag-rounded"
                        >
                          #{tag}
                        </Link>
                      ))}
                    </Tag.List>
                    <Header.H2 className="mt-4">Top films</Header.H2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                      Consectetur dignissimos doloribus eum fugiat itaque
                      laboriosam maiores nisi nostrum perspiciatis vero.
                    </p>
                  </>
                )}
                {activeTab === TABS.STATISTIC && (
                  <Table
                    cards
                    responsive
                    highlightRowOnHover
                    className="table-vcenter"
                  >
                    <Table.Header>
                      <Table.Row>
                        <Table.ColHeader />
                        <Table.ColHeader>Title</Table.ColHeader>
                        <Table.ColHeader>Statistic</Table.ColHeader>
                        {/*<Table.ColHeader />*/}
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {[...Array(10).keys()].map((i) => (
                        <Table.Row key={i}>
                          <Table.Col className="w-1">
                            <Avatar icon="users" size="xxl" className="mr-3" />
                          </Table.Col>
                          <Table.Col className="w-1">test</Table.Col>
                          <Table.Col>
                            <div className="clearfix">
                              <div className="float-left">
                                <strong>42%</strong>
                              </div>
                              <div className="float-right">
                                <small className="text-muted">
                                  Jun 11, 2015 - Jul 10, 2015
                                </small>
                              </div>
                            </div>
                            <div className="progress progress-xs">
                              <div
                                className="progress-bar bg-yellow"
                                role="progressbar"
                                style={{ width: '42%' }}
                                ariaValuenow="42"
                                ariaValuemin="0"
                                ariaValuemax="100"
                              />
                            </div>
                          </Table.Col>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </Grid.Col>
        </Grid.Row>
      </TablerPage.Content>
    </Page>
  );
};

export default ContestPage;
