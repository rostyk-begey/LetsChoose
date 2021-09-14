import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import TableCell from '@material-ui/core/TableCell';
import MuiTableRow from '@material-ui/core/TableRow';
import json2mq from 'json2mq';

import { useStyles, TableRowProps } from './TableRow';

export const TableRowSkeleton: React.FC<TableRowProps> = ({
  row: {
    index,
    cells: [rank, image, ...cells],
  },
}) => {
  const classes = useStyles({ index });
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
      {cells.map((cell, i) => (
        <TableCell {...cell.getCellProps()}>
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
