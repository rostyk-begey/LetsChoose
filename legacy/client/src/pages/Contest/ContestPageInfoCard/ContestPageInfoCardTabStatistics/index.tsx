import React, { useRef, useState } from 'react';
// @ts-ignore
import { Avatar, Loader, Table } from 'tabler-react';
import InfiniteScroll from 'react-infinite-scroller';
// @ts-ignore
import { throttle } from 'lodash';

import { useContestItemsInfinite } from '../../../../hooks/api/contest';
import { Contest } from '../../../../../../server/models/Contest';

const ItemRow: React.FC<any> = ({
  id,
  rank,
  image,
  title,
  winRate,
  finalWinRate,
}) => (
  <Table.Row key={id}>
    {/*<Table.Col className="w-1">#{rank}</Table.Col>*/}
    <Table.Col className="w-1">
      <Avatar imageURL={image} size="xxl" className="mr-3" />
    </Table.Col>
    <Table.Col className="w-1">{title}</Table.Col>
    <Table.Col>
      <div className="clearfix">
        <div className="float-left">
          <strong>{(winRate * 100).toFixed(2)}</strong>
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
            width: `${winRate * 100}%`,
          }}
        />
      </div>
    </Table.Col>
    <Table.Col>
      <div className="clearfix">
        <div className="float-left">
          <strong>{(finalWinRate * 100).toFixed(2)}</strong>
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
            width: `${finalWinRate * 100}%`,
          }}
        />
      </div>
    </Table.Col>
  </Table.Row>
);

const ContestPageInfoCardTabStatistics: React.FC<{
  contest: Contest;
}> = ({ contest: { _id: contestId } }) => {
  const [search, setSearch] = useState('');
  const {
    data,
    fetchMore,
    canFetchMore,
    isSuccess,
  } = useContestItemsInfinite(contestId, { search });

  const { current: throttled } = useRef(
    throttle(setSearch, 1000, { leading: false }),
  );
  const handleSearch = ({ target: { value } }: any) => throttled(value);

  return (
    <InfiniteScroll
      pageStart={0}
      loadMore={() => fetchMore()}
      hasMore={canFetchMore}
      loader={
        <div className="d-flex justify-content-center">
          <Loader />
        </div>
      }
    >
      <div className="input-icon">
        <input
          name="search"
          className="form-control"
          type="text"
          placeholder="Search for..."
          onChange={handleSearch}
        />
        <span className="input-icon-addon">
          <i className="fe fe-search" />
        </span>
      </div>
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
          {isSuccess &&
            data?.map(({ data: { items } }) =>
              items.map(
                ({ _id: id, title, image, winRate, finalWinRate }: any) => (
                  <ItemRow
                    id={id}
                    title={title}
                    image={image}
                    winRate={winRate}
                    finalWinRate={finalWinRate}
                  />
                ),
              ),
            )}
        </Table.Body>
      </Table>
    </InfiniteScroll>
  );
};

export default ContestPageInfoCardTabStatistics;
