import { useMediaQuery } from '@material-ui/core';
import React, { useEffect, useMemo } from 'react';
import MuiTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import MuiTableRow from '@material-ui/core/TableRow';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useTable, Column } from 'react-table';
import json2mq from 'json2mq';

import TableRow from './TableRow';
import TableRowSkeleton from './TableRowSkeleton';

interface Props {
  data: any;
  skeleton?: boolean;
}

const useStyles = makeStyles({
  image: {
    width: 100,
  },
});

const Table: React.FC<Props> = ({ data, skeleton }) => {
  const classes = useStyles();
  const columns: Array<Column<any>> = useMemo(
    () => [
      {
        Header: 'Rank',
        accessor: 'rankScore',
      },
      {
        Header: 'Image',
        accessor: 'image',
        width: 250,
        minWidth: 220,
      },
      {
        Header: 'Title',
        accessor: 'title',
      },
      {
        Header: '1 to 1 Win Rate',
        accessor: 'winRate',
        width: 100,
      },
      {
        Header: 'Final Win Rate',
        accessor: 'finalWinRate',
        minWidth: 100,
      },
      {
        accessor: 'compares',
      },
      {
        accessor: 'wins',
      },
      {
        accessor: 'finalWins',
      },
      {
        accessor: 'games',
      },
    ],
    [],
  );
  const matchesMaxWidth760 = useMediaQuery(
    json2mq({
      maxWidth: 700,
    }),
  );

  const defaultHiddenColumns = ['compares', 'wins', 'finalWins', 'games'];
  const mobileHiddenColumns = [
    'finalWinRate',
    'winRate',
    ...defaultHiddenColumns,
  ];

  // Use the useTable Hook to send the columns and data to build the table
  const {
    getTableProps, // table props from react-table
    getTableBodyProps, // table body props from react-table
    headerGroups, // headerGroups, if your table has groupings
    rows, // rows for the table based on the data passed
    prepareRow, // Prepare the row (this function needs to be called for each row before getting the row props)
    setHiddenColumns,
  } = useTable({
    columns,
    data,
    initialState: {
      hiddenColumns: defaultHiddenColumns,
    },
  });

  useEffect(() => {
    if (matchesMaxWidth760) {
      setHiddenColumns(mobileHiddenColumns);
    } else {
      setHiddenColumns(defaultHiddenColumns);
    }
  }, [matchesMaxWidth760]);

  /*
    Render the UI for your table
    - react-table doesn't have UI, it's headless. We just need to put the react-table props from the Hooks, and it will do its magic automatically
  */
  return (
    <>
      <TableContainer>
        <MuiTable size="small" stickyHeader {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup, i) => (
              <MuiTableRow key={i} {...headerGroup.getHeaderGroupProps()}>
                <TableCell />
                {headerGroup.headers.map((column, j) => (
                  <TableCell key={j} {...column.getHeaderProps()}>
                    {column.render('Header')}
                  </TableCell>
                ))}
              </MuiTableRow>
            ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row);
              if (skeleton) {
                return <TableRowSkeleton key={`row-${i}`} row={row} />;
              }
              return <TableRow key={`row-${i}`} row={row} />;
            })}
          </TableBody>
        </MuiTable>
      </TableContainer>
    </>
  );
};

export default Table;
