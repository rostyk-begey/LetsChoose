import React from 'react';
import { Avatar, Table } from 'tabler-react';

import _ from 'lodash';

const ContestPageInfoCardTabStatistics = ({ contest: { items } }) => {
  const totalScore = 0;
  const itemsWithData = _.orderBy(
    _.map(items, ({ score, compares, ...item }) => ({
      ...item,
      score: 0,
      compares: 0,
      winRate: 0, //compares && (100 * score) / compares,
    })),
    ['score', 'winRate'],
    ['desc', 'desc'],
  );

  return (
    <Table cards responsive highlightRowOnHover className="table-vcenter">
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
          itemsWithData.map(({ _id: id, image, title, score, winRate }) => (
            <Table.Row key={id}>
              <Table.Col className="w-1">
                <Avatar imageURL={image} size="xxl" className="mr-3" />
              </Table.Col>
              <Table.Col className="w-1">{title}</Table.Col>
              <Table.Col>
                <div className="clearfix">
                  <div className="float-left">
                    <strong>
                      {(totalScore && (100 * score) / totalScore).toFixed(2)}
                    </strong>
                  </div>
                  <div className="float-right">
                    <small className="text-muted">
                      Jun 11, 2015 - Jul 10, 2015
                    </small>
                  </div>
                </div>
                <div className="progress progress-xs">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  <div
                    className="progress-bar bg-yellow"
                    role="progressbar"
                    style={{
                      width: `${totalScore && (100 * score) / totalScore}%`,
                    }}
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
            </Table.Row>
          ))}
      </Table.Body>
    </Table>
  );
};

export default ContestPageInfoCardTabStatistics;
