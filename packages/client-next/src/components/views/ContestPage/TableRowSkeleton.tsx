import React from 'react';
import { Skeleton } from '@material-ui/lab';
import { useMediaQuery } from '@material-ui/core';
import TableCell from '@material-ui/core/TableCell';
import MuiTableRow from '@material-ui/core/TableRow';
import json2mq from 'json2mq';

import { useStyles, Props } from './TableRow';

const TableRowSkeleton: React.FC<Props> = ({ row }) => {
  const {
    cells: [rank, image, title, ...cells],
  } = row;
  const classes = useStyles({ index: row.index });
  const matchesMaxWidth960 = useMediaQuery(
    json2mq({
      maxWidth: 960,
    }),
  );

  return (
    <MuiTableRow className={classes.root}>
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
      <TableCell
        style={matchesMaxWidth960 ? { width: '100%' } : undefined}
        {...title.getCellProps()}
      >
        <Skeleton animation="wave" width="70%" height={32} />
      </TableCell>
      {cells.map((cell, i) => (
        <TableCell key={i} {...cell.getCellProps()}>
          {matchesMaxWidth960 ? (
            <Skeleton animation="wave" width={32} height={32} />
          ) : (
            <Skeleton animation="wave" width="100%" height={32} />
          )}
        </TableCell>
      ))}
    </MuiTableRow>
  );
};

export default TableRowSkeleton;
