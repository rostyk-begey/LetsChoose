import React from 'react';
import { Avatar, Table } from 'tabler-react';

import { orderBy, map } from 'lodash';

const ContestPageInfoCardTabStatistics = ({ contest: { items } }) => {
  const itemsWithData = orderBy(
    map(items, ({ wins, compares, games, finalWins, ...item }) => ({
      ...item,
      winRate: compares ? (100 * wins) / compares : 0,
      finalWinRate: games ? (100 * finalWins) / games : 0,
    })),
    ['finalWinRate', 'winRate'],
    ['desc', 'desc'],
  );

  return (
    <Table cards responsive highlightRowOnHover className="table-vcenter">
      <Table.Header>
        <Table.Row>
          <Table.ColHeader />
          <Table.ColHeader>Title</Table.ColHeader>
          <Table.ColHeader>1:1 Win rate</Table.ColHeader>
          <Table.ColHeader>Final Win rate</Table.ColHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {!!items.length &&
          itemsWithData.map(
            ({ _id: id, image, title, winRate, finalWinRate }) => (
              <Table.Row key={id}>
                <Table.Col className="w-1">
                  <Avatar imageURL={image} size="xxl" className="mr-3" />
                </Table.Col>
                <Table.Col className="w-1">{title}</Table.Col>
                <Table.Col>
                  <div className="clearfix">
                    <div className="float-left">
                      <strong>{winRate.toFixed(2)}</strong>
                    </div>
                    {/*<div className="float-right">*/}
                    {/*  <small className="text-muted">*/}
                    {/*    Jun 11, 2015 - Jul 10, 2015*/}
                    {/*  </small>*/}
                    {/*</div>*/}
                  </div>
                  <div className="progress progress-xs">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <div
                      className="progress-bar bg-yellow"
                      role="progressbar"
                      style={{
                        width: `${winRate}%`,
                      }}
                    />
                  </div>
                </Table.Col>
                <Table.Col>
                  <div className="clearfix">
                    <div className="float-left">
                      <strong>{finalWinRate.toFixed(2)}</strong>
                    </div>
                    {/*<div className="float-right">*/}
                    {/*  <small className="text-muted">*/}
                    {/*    Jun 11, 2015 - Jul 10, 2015*/}
                    {/*  </small>*/}
                    {/*</div>*/}
                  </div>
                  <div className="progress progress-xs">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <div
                      className="progress-bar bg-yellow"
                      role="progressbar"
                      style={{
                        width: `${finalWinRate}%`,
                      }}
                    />
                  </div>
                </Table.Col>
              </Table.Row>
            ),
          )}
      </Table.Body>
    </Table>
  );
};

export default ContestPageInfoCardTabStatistics;
