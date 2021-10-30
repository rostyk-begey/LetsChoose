import React, { useEffect, useMemo } from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import MuiTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import MuiTableRow from '@material-ui/core/TableRow';
import { useTable, Column } from 'react-table';
import json2mq from 'json2mq';

import { TableRow } from './TableRow';
import { TableRowSkeleton } from './TableRowSkeleton';

export interface TableProps {
  data: any;
  skeleton?: boolean;
}

export const Table: React.FC<TableProps> = ({ data, skeleton }) => {
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
  const matchesMaxWidth700 = useMediaQuery(
    json2mq({
      maxWidth: 700,
    }),
  );

  const defaultHiddenColumns = ['compares', 'wins', 'finalWins', 'games'];
  const mobileHiddenColumns = [
    'title',
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
    if (matchesMaxWidth700) {
      setHiddenColumns(mobileHiddenColumns);
    } else {
      setHiddenColumns(defaultHiddenColumns);
    }
  }, [matchesMaxWidth700, setHiddenColumns]);

  /*
    Render the UI for your table
    - react-table doesn't have UI, it's headless. We just need to put the react-table props from the Hooks, and it will do its magic automatically
  */
  return (
    <TableContainer>
      <MuiTable size="small" stickyHeader {...getTableProps()}>
        <TableHead>
          {headerGroups.map((headerGroup) => (
            // eslint-disable-next-line react/jsx-key
            <MuiTableRow {...headerGroup.getHeaderGroupProps()}>
              <TableCell />
              {headerGroup.headers.map((column) => (
                // eslint-disable-next-line react/jsx-key
                <TableCell {...column.getHeaderProps()}>
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
  );
};
