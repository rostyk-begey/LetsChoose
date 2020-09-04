import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useQuery } from 'react-query';
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
import { Link, Prompt, useParams } from 'react-router-dom';
import _ from 'lodash';

import Page from 'app/components/Page';
import ROUTES from 'app/utils/routes';
import { useContestFind } from 'app/hooks/api/contest';

import './index.scss';

const TABS = {
  GENERAL: 'GENERAL',
  STATISTIC: 'STATISTIC',
};

const ContestPage = () => {
  const baseClassName = 'contest-page';
  const { id } = useParams();
  const { data: { data: contest = {} } = {}, ...contestQuery } = useContestFind(
    id,
  );
  const {
    title,
    thumbnail,
    excerpt,
    tags = [],
    items,
    views = 0,
    likes = 0,
    dislikes = 0,
  } = contest;
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
  const counters = [
    {
      icon: 'eye',
      data: views,
    },
    {
      icon: 'thumbs-up',
      data: likes,
    },
    {
      icon: 'thumbs-down',
      data: dislikes,
    },
  ];
  const [isStarted, setIsStarted] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
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
    <Page>
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
                    <Grid.Col lg={6} key={i}>
                      <div className="media mb-3" onClick={onSelect}>
                        <img
                          className={`d-flex rounded w-100 ${baseClassName}__compare-item-image`}
                          src={image}
                          alt="Generic placeholder image"
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
                    <Button color="primary" onClick={() => setIsStarted(true)}>
                      Start
                    </Button>
                  </div>
                </Card.Header>
                {!_.isEmpty(contest) && (
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
                            className="d-flex rounded w-100"
                            src={thumbnail}
                            alt={title}
                          />
                        </Media>
                        <Grid.Row>
                          <Grid.Col className="col-6">
                            <div className="text-muted">22.04.2020</div>
                          </Grid.Col>
                          <Grid.Col className="col-6">
                            {counters.map(({ icon, data }) => (
                              <span
                                className="icon d-none d-md-inline-block ml-3"
                                key={icon}
                              >
                                <Icon name={icon} className="mr-1" />
                                {data}
                              </span>
                            ))}
                          </Grid.Col>
                        </Grid.Row>
                        <Tag.List className="mt-2">
                          {tags.map((tag) => (
                            <Link
                              key={tag}
                              to={ROUTES.HOME}
                              className="tag expanded tag-rounded"
                            >
                              #{tag}
                            </Link>
                          ))}
                        </Tag.List>
                        <Header.H2 className="mt-4">{title}</Header.H2>
                        <p>{excerpt}</p>
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
                            <Table.ColHeader>Win rate</Table.ColHeader>
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          {!!items.length &&
                            _.orderBy(
                              _.map(items, ({ score, compares, ...item }) => ({
                                ...item,
                                score: 0,
                                compares: 0,
                                winRate: 0, //compares && (100 * score) / compares,
                              })),
                              ['score', 'winRate'],
                              ['desc', 'desc'],
                            ).map(
                              ({ _id: id, image, title, score, winRate }) => (
                                <Table.Row key={id}>
                                  <Table.Col className="w-1">
                                    <Avatar
                                      // icon="users"
                                      imageURL={image}
                                      size="xxl"
                                      className="mr-3"
                                    />
                                  </Table.Col>
                                  <Table.Col className="w-1">{title}</Table.Col>
                                  <Table.Col>
                                    <div className="clearfix">
                                      <div className="float-left">
                                        <strong>
                                          {(
                                            totalScore &&
                                            (100 * score) / totalScore
                                          ).toFixed(2)}
                                        </strong>
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
                                        style={{
                                          width: `${
                                            totalScore &&
                                            (100 * score) / totalScore
                                          }%`,
                                        }}
                                        // aria-valuenow="42"
                                        // aria-valuemin="0"
                                        // aria-valuemax="100"
                                      />
                                    </div>
                                  </Table.Col>
                                  <Table.Col>
                                    <div className="clearfix">
                                      <div className="float-left">
                                        <strong>{winRate.toFixed(2)}</strong>
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
                                        style={{
                                          width: `${winRate}%`,
                                        }}
                                        // aria-valuenow="42"
                                        // aria-valuemin="0"
                                        // aria-valuemax="100"
                                      />
                                    </div>
                                  </Table.Col>
                                </Table.Row>
                              ),
                            )}
                        </Table.Body>
                      </Table>
                    )}
                  </Card.Body>
                )}
              </Card>
            </Grid.Col>
          )}
        </Grid.Row>
      </TablerPage.Content>
    </Page>
  );
};

export default ContestPage;
