import dynamic from 'next/dynamic';
import React, { useCallback } from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { SORT_OPTIONS } from '@lets-choose/common';
import InfiniteScroll from 'react-infinite-scroller';
import json2mq from 'json2mq';

import { useContestAllInfinite } from '../../hooks/api/contest';
import useQueryState from '../../hooks/getParams';
import ContestCardSkeleton from './ContestCardSkeleton';

const ContestCard = dynamic(() => import('./ContestCard'), {
  ssr: false,
  loading: ContestCardSkeleton,
});

interface Props {
  author?: string;
}

const perPage = 6;

const ContestGrid: React.FC<Props> = ({ author }) => {
  const [sortBy] = useQueryState('sortBy', 'POPULAR');
  const [search] = useQueryState('search', '');
  const { data, isLoading, fetchNextPage, hasNextPage, refetch } =
    useContestAllInfinite({
      search: search as string,
      sortBy: sortBy as '' | keyof typeof SORT_OPTIONS,
      perPage,
      author,
    });
  const pages = data?.pages || [];
  const matchesMaxWidth960 = useMediaQuery(
    json2mq({
      maxWidth: 960,
    }),
  );
  const matchesMaxWidth600 = useMediaQuery(
    json2mq({
      maxWidth: 600,
    }),
  );

  const currentItemsLength = pages.reduce(
    (acc, { data: { items: contests } }) => acc + contests.length,
    0,
  );

  const getPerRowItemsLength = useCallback(() => {
    if (matchesMaxWidth960) return 2;
    if (matchesMaxWidth600) return 1;
    return 3;
  }, [matchesMaxWidth960, matchesMaxWidth600]);

  const calcSkeletonsLength = useCallback(() => {
    const itemsPerRow = getPerRowItemsLength();
    if (itemsPerRow === 1) return 1;

    return itemsPerRow - (currentItemsLength % itemsPerRow);
  }, [pages, getPerRowItemsLength]);

  const renderSkeletons = () => {
    const length = calcSkeletonsLength();

    return Array.from({ length }).map((_, i) => (
      <Grid item container justify="center" key={i} md={4} sm={6} xs={12}>
        <ContestCardSkeleton />
      </Grid>
    ));
  };

  return (
    <Container>
      <InfiniteScroll
        pageStart={0}
        loadMore={() => fetchNextPage()}
        hasMore={!!hasNextPage}
      >
        <Grid container spacing={3}>
          {pages.map(({ data: { items: contests = [] } }) =>
            contests.map((contest) => (
              <Grid
                item
                container
                justify="center"
                key={contest.id}
                md={4}
                sm={6}
                xs={12}
              >
                <ContestCard contest={contest} onDelete={refetch} />
              </Grid>
            )),
          )}
          {(isLoading || hasNextPage) && renderSkeletons()}
        </Grid>
      </InfiniteScroll>
    </Container>
  );
};

export default ContestGrid;
