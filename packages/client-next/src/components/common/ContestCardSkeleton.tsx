import { makeStyles } from '@material-ui/core/styles';
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

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    maxWidth: 345,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 8,
  },
  media: {
    height: 0,
    paddingTop: '100%',
  },
  actions: {
    marginTop: 'auto',
  },
}));

const ContestCardSkeleton = () => {
  const classes = useStyles();
  const shadowStyles = useOverShadowStyles();
  return (
    <Card className={classNames(classes.root, shadowStyles.root)}>
      <CardHeader
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
      <CardContent>
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
      <CardActions className={classes.actions} disableSpacing>
        <Skeleton
          animation="wave"
          width={20}
          height={33.45}
          style={{ marginLeft: 20 }}
        />
        <Skeleton
          animation="wave"
          width={20}
          height={33.45}
          style={{ marginLeft: 20 }}
        />
        <Skeleton
          animation="wave"
          width={20}
          height={33.45}
          style={{ margin: '20px 20px 20px auto' }}
        />
      </CardActions>
    </Card>
  );
};

export default ContestCardSkeleton;
