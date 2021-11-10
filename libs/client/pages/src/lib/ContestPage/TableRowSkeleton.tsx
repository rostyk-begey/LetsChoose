import React from 'react';
import Skeleton from '@mui/material/Skeleton';
import useMediaQuery from '@mui/material/useMediaQuery';
import TableCell from '@mui/material/TableCell';
import json2mq from 'json2mq';

import { classes, TableRowProps, StyledRow } from './TableRow';

export const TableRowSkeleton: React.FC<TableRowProps> = ({
  row: {
    cells: [rank, image, ...cells],
  },
}) => {
  const matchesMaxWidth960 = useMediaQuery(
    json2mq({
      maxWidth: 960,
    }),
  );

  return (
    <StyledRow className={classes.root}>
      <TableCell align="center" width={50} className={classes.expandCell}>
        <Skeleton animation="wave" width={30} height={32} />
      </TableCell>
      <TableCell
        size="small"
        width={matchesMaxWidth960 ? 70 : 100}
        className={classes.rankingCell}
        {...rank.getCellProps()}
      >
        <Skeleton animation="wave" width={48} height={32} />
      </TableCell>
      <TableCell width={250} {...image.getCellProps()}>
        <Skeleton animation="wave" className={classes.image} />
      </TableCell>
      {cells.map((cell, i) => (
        // eslint-disable-next-line react/jsx-key
        <TableCell {...cell.getCellProps()}>
          {matchesMaxWidth960 ? (
            <Skeleton animation="wave" width={32} height={32} />
          ) : (
            <Skeleton animation="wave" width="100%" height={32} />
          )}
        </TableCell>
      ))}
    </StyledRow>
  );
};
