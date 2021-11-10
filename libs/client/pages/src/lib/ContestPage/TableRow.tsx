import React, { useState } from 'react';
import { alpha } from '@mui/material';
import { ContestItemDto } from '@lets-choose/common/dto';
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Grid from '@mui/material/Grid';
import LinearProgress, {
  linearProgressClasses,
} from '@mui/material/LinearProgress';
import MuiTable from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import MuiTableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Chip from '@mui/material/Chip';
import json2mq from 'json2mq';
import { Row } from 'react-table';
import Image from 'next/image';

import {
  cloudinaryAspectRatio,
  cloudinaryBlurPreview,
  cloudinaryUploadPath,
  imageSize,
} from '@lets-choose/client/utils';
import { CircularProgressWithLabel } from '@lets-choose/client/components';
import { imageWidth, imageWidthMobile } from './constants';

export const PREFIX = 'TableRow';

export const classes = {
  root: `${PREFIX}-root`,
  image: `${PREFIX}-image`,
  imageBig: `${PREFIX}-imageBig`,
  figure: `${PREFIX}-figure`,
  previewImage: `${PREFIX}-previewImage`,
  chip: `${PREFIX}-chip`,
  expandCell: `${PREFIX}-expandCell`,
  rankingCell: `${PREFIX}-rankingCell`,
};

export const StyledFigure = styled('figure')(({ theme: { breakpoints } }) => ({
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  overflow: 'hidden',
  margin: 0,

  [`&.${classes.image}`]: {
    ...imageSize(imageWidth),
    [breakpoints.down('md')]: {
      ...imageSize(imageWidthMobile),
    },
  },

  [`& .${classes.previewImage}`]: {
    top: 0,
    left: 0,
    position: 'absolute',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },

  [`& .${classes.imageBig}`]: {
    top: 0,
    left: 0,
    position: 'absolute',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
}));

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 20,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
  },
}));

export const StyledRow = styled(MuiTableRow)(
  ({ theme: { breakpoints, ...theme } }) => ({
    '& > *': {
      borderBottom: 'unset',
    },

    [`& .${classes.expandCell}`]: {
      padding: `6px ${theme.spacing(1)}`,
    },

    [`& .${classes.rankingCell}`]: {
      padding: `6px ${theme.spacing(2)}`,
    },
  }),
);

export interface TableRowProps {
  row: Row<ContestItemDto>;
}

const StatisticRow: React.FC<{ title: string }> = ({ title, children }) => (
  <MuiTableRow>
    <TableCell component="th" variant="head" scope="row">
      {title}
    </TableCell>
    <TableCell>{children}</TableCell>
  </MuiTableRow>
);

export const TableRow: React.FC<TableRowProps> = ({ row }) => {
  const [open, setOpen] = useState(false);
  const {
    cells: [rank, image, ...cells],
    allCells,
    values,
  } = row;

  const matchesMaxWidth960 = useMediaQuery(
    json2mq({
      maxWidth: 960,
    }),
  );

  const imageSrc = cloudinaryAspectRatio(image.value);
  const blurPreviewURL = cloudinaryBlurPreview(image.value);

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen((prev) => !prev);
  };

  const handleRowClick = (e: React.MouseEvent) =>
    matchesMaxWidth960 && handleExpandClick(e);

  const chipColor =
    ['#ffd700', '#c0c0c0', '#cd7f32'][row.index] || 'transparent';

  return (
    <>
      <StyledRow hover onClick={handleRowClick}>
        <TableCell align="center" width={50} className={classes.expandCell}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={handleExpandClick}
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
            sx={{ backgroundColor: chipColor }}
            label={
              <Typography variant="h6" component="div">
                #{row.index + 1}
              </Typography>
            }
            variant={row.index < 3 ? 'filled' : 'outlined'}
          />
        </TableCell>
        <TableCell width={250} {...image.getCellProps()}>
          <StyledFigure className={classes.image}>
            <Image
              src={cloudinaryUploadPath(imageSrc)}
              className={classes.previewImage}
              layout="fill"
              blurDataURL={blurPreviewURL}
              objectFit="cover"
              placeholder="blur"
              alt={values.title}
            />
          </StyledFigure>
        </TableCell>
        {cells.map((cell, i) =>
          i === 0 ? (
            <TableCell
              style={matchesMaxWidth960 ? { width: '100%' } : undefined}
              {...cell.getCellProps()}
            >
              <Typography variant="h6" component="div">
                {cell.value}
              </Typography>
            </TableCell>
          ) : (
            <TableCell {...cell.getCellProps()}>
              {matchesMaxWidth960 ? (
                <CircularProgressWithLabel value={cell.value * 100} />
              ) : (
                <BorderLinearProgress
                  variant="determinate"
                  value={cell.value * 100}
                />
              )}
            </TableCell>
          ),
        )}
      </StyledRow>
      <MuiTableRow>
        <TableCell sx={{ py: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Grid container spacing={2}>
                <Grid item md={5} xs={8}>
                  <StyledFigure>
                    <Image
                      src={cloudinaryUploadPath(imageSrc)}
                      blurDataURL={blurPreviewURL}
                      placeholder="blur"
                      className={classes.imageBig}
                      alt={values.title}
                      layout="fill"
                    />
                  </StyledFigure>
                </Grid>
                <Grid item md={7} xs={12}>
                  <Typography variant="h6" gutterBottom component="div">
                    {values.title}
                  </Typography>
                  <MuiTable size="small" aria-label="item-info">
                    <TableBody>
                      <StatisticRow title="Ranking">
                        <Chip
                          sx={{ backgroundColor: chipColor }}
                          size="small"
                          label={`#${row.index + 1}`}
                          variant={row.index < 3 ? 'filled' : 'outlined'}
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
                          <StatisticRow
                            key={i}
                            title={cell.column.Header as string}
                          >
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
