import React, { useState } from 'react';
import { Theme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import IconButton from '@material-ui/core/IconButton';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import MuiTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import MuiTableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Chip from '@material-ui/core/Chip';
import json2mq from 'json2mq';
import { Row } from 'react-table';
import classNames from 'classnames';

import { imageSize } from '../../../utils/functions';
import CircularProgressWithLabel from '../../common/CircularProgressWithLabel';
import { imageWidth, imageWidthMobile } from './constants';

export interface Props {
  row: Row;
}

interface ClassesProps {
  index: number;
}

export const useStyles = makeStyles(({ breakpoints, ...theme }: Theme) => ({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
  image: {
    ...imageSize(imageWidth),
    [breakpoints.down('md')]: {
      ...imageSize(imageWidthMobile),
    },
  },
  imageBig: {
    top: 0,
    left: 0,
    position: 'absolute',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  figure: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    paddingBottom: '75%',
    margin: 0,
  },
  previewImage: {
    top: 0,
    left: 0,
    position: 'absolute',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  chip: ({ index }: ClassesProps) => ({
    backgroundColor: ['#ffd700', '#c0c0c0', '#cd7f32'][index] || 'transparent',
  }),
  expandCell: {
    padding: `6px ${theme.spacing(1)}px`,
  },
  rankingCell: {
    padding: `6px ${theme.spacing(2)}px`,
  },
}));

const StatisticRow: React.FC<{ title: string }> = ({ title, children }) => (
  <MuiTableRow>
    <TableCell component="th" variant="head" scope="row">
      {title}
    </TableCell>
    <TableCell>{children}</TableCell>
  </MuiTableRow>
);

const TableRow: React.FC<Props> = ({ row }) => {
  const [open, setOpen] = useState(false);
  const {
    cells: [rank, image, title, ...cells],
    allCells,
  } = row;
  const classes = useStyles({ index: row.index });
  const matchesMaxWidth960 = useMediaQuery(
    json2mq({
      maxWidth: 960,
    }),
  );
  const imageSrc = image.value.replace(
    'image/upload',
    'image/upload/c_fill,ar_4:3',
  );

  return (
    <>
      <MuiTableRow className={classes.root}>
        <TableCell align="center" width={50} className={classes.expandCell}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell
          size="small"
          width={matchesMaxWidth960 ? 70 : 100}
          className={classes.rankingCell}
          {...rank.getCellProps()}
        >
          <Chip
            className={classes.chip}
            label={
              <Typography variant="h6" component="div">
                #{row.index + 1}
              </Typography>
            }
            variant={row.index < 3 ? 'default' : 'outlined'}
          />
        </TableCell>
        <TableCell width={250} {...image.getCellProps()}>
          <figure className={classNames(classes.figure, classes.image)}>
            <img src={imageSrc} className={classes.previewImage} alt="" />
          </figure>
        </TableCell>
        <TableCell
          style={matchesMaxWidth960 ? { width: '100%' } : undefined}
          {...title.getCellProps()}
        >
          <Typography variant="h6" component="div">
            {title.value}
          </Typography>
        </TableCell>
        {cells.map((cell, i) => (
          <TableCell key={i} {...cell.getCellProps()}>
            {matchesMaxWidth960 ? (
              <CircularProgressWithLabel value={cell.value * 100} />
            ) : (
              <LinearProgress variant="determinate" value={cell.value * 100} />
            )}
          </TableCell>
        ))}
      </MuiTableRow>
      <MuiTableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Grid container spacing={2}>
                <Grid item md={5} xs={8}>
                  <figure className={classes.figure}>
                    <img src={imageSrc} className={classes.imageBig} alt="" />
                  </figure>
                </Grid>
                <Grid item md={7} xs={12}>
                  <Typography variant="h6" gutterBottom component="div">
                    {title.value}
                  </Typography>
                  <MuiTable size="small" aria-label="item-info">
                    <TableBody>
                      <StatisticRow title="Ranking">
                        <Chip
                          className={classes.chip}
                          size="small"
                          label={`#${row.index + 1}`}
                          variant={row.index < 3 ? 'default' : 'outlined'}
                        />
                      </StatisticRow>
                      <StatisticRow title="Compares">
                        {row.values.compares}
                      </StatisticRow>
                      <StatisticRow title="Games">
                        {row.values.games}
                      </StatisticRow>
                      <StatisticRow title="Wins">
                        {row.values.wins}
                      </StatisticRow>
                      <StatisticRow title="Final wins">
                        {row.values.finalWins}
                      </StatisticRow>
                      {allCells
                        .filter(({ column: { id } }) =>
                          ['winRate', 'finalWinRate'].includes(id),
                        )
                        .map((cell, i) => (
                          <StatisticRow key={i} title={cell.column.Header}>
                            <CircularProgressWithLabel
                              value={cell.value * 100}
                            />
                          </StatisticRow>
                        ))}
                    </TableBody>
                  </MuiTable>
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </MuiTableRow>
    </>
  );
};

export default TableRow;
