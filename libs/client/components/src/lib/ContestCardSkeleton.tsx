import { Paper } from '@material-ui/core';
import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Skeleton from '@material-ui/lab/Skeleton';
import { useOverShadowStyles } from '@mui-treasury/styles/shadow/over';
import classNames from 'classnames';

import { useStyles } from './ContestCard';

export const ContestCardSkeleton = () => {
  const classes = useStyles();
  const shadowStyles = useOverShadowStyles();
  return (
    <Card className={classNames(classes.root, shadowStyles.root)}>
      <CardHeader
        className={classes.cardHeader}
        avatar={
          <Skeleton animation="wave" variant="circle" width={40} height={40} />
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={
          <Skeleton
            animation="wave"
            height={10}
            width="80%"
            style={{ marginBottom: 6 }}
          />
        }
        subheader={<Skeleton animation="wave" height={10} width="40%" />}
      />
      <Skeleton animation="wave" variant="rect" className={classes.media} />
      <Paper
        style={{ height: 40, backgroundColor: '#fafafa' }}
        elevation={0}
        square
      />
      <CardContent className={classes.cardContent}>
        <Skeleton animation="wave" height={16} style={{ margin: '6px 0' }} />
        <Skeleton
          animation="wave"
          height={14}
          style={{ margin: '3px 0' }}
          width="80%"
        />
        <Skeleton
          animation="wave"
          height={14}
          style={{ margin: '3px 0' }}
          width="90%"
        />
      </CardContent>
      <CardActions
        className={classes.actions}
        style={{ height: 44 }}
        disableSpacing
      >
        <Skeleton
          animation="wave"
          width={20}
          height={33.45}
          style={{ marginLeft: 12 }}
        />
        {/* TODO: add to favorites skeleton */}
        {/*<Skeleton*/}
        {/*  animation="wave"*/}
        {/*  width={20}*/}
        {/*  height={33.45}*/}
        {/*  style={{ marginLeft: 24 }}*/}
        {/*/>*/}
        <Skeleton
          animation="wave"
          width={20}
          height={33.45}
          style={{ margin: '12px 12px 12px auto' }}
        />
      </CardActions>
    </Card>
  );
};

export default ContestCardSkeleton;
