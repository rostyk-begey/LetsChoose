import React from 'react';
import { useRouter } from 'next/router';
import humanTime from 'human-time';
import clip from 'text-clipper';
import classNames from 'classnames';
import RouterLink from 'next/link';
import { Skeleton } from '@material-ui/lab';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import PlayCircleFilledWhiteIcon from '@material-ui/icons/PlayCircleFilledWhite';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { useOverShadowStyles } from '@mui-treasury/styles/shadow/over';
import { Contest, UserDto } from '@lets-choose/common';

import { useGameStart } from '../../../hooks/api/game';
import ROUTES from '../../../utils/routes';

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
    // paddingTop: '56.25%', // 16:9
  },
  cursorPointer: {
    cursor: 'pointer',
  },
  actions: {
    marginTop: 'auto',
  },
  playBtn: {
    marginLeft: 'auto',
  },
}));

interface Props {
  contest?: Contest;
}

const ContestCard: React.FC<Props> = ({ contest }) => {
  const classes = useStyles();
  const shadowStyles = useOverShadowStyles();
  const router = useRouter();

  if (!contest) {
    return (
      <Card className={classNames(classes.root, shadowStyles.root)}>
        <CardHeader
          avatar={
            <Skeleton
              animation="wave"
              variant="circle"
              width={40}
              height={40}
            />
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
  }
  const {
    id,
    thumbnail,
    title,
    excerpt,
    author,
    games,
    items,
    createdAt,
  } = contest;
  const username = (author as UserDto).username;
  const [startGame] = useGameStart();
  const onStartGame = async () => {
    try {
      const { data: { gameId = null } = {} } = (await startGame(id)) || {};
      router.push(`${ROUTES.GAMES.INDEX}/${gameId}`);
    } catch (e) {
      // TODO handle error
      console.log(e);
    }
  };

  return (
    <Card className={classNames(classes.root, shadowStyles.root)}>
      <CardHeader
        avatar={
          <RouterLink href={`${ROUTES.USERS}/${username}`}>
            <Avatar
              aria-label="recipe"
              className={classes.cursorPointer}
              src={(author as UserDto).avatar}
            />
          </RouterLink>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={
          <Link
            component={RouterLink}
            href={`${ROUTES.USERS}/${username}`}
          >{`@${username}`}</Link>
        }
        subheader={humanTime(new Date(createdAt))}
      />
      <RouterLink href={`${ROUTES.CONTESTS.INDEX}/${id}`}>
        <CardMedia
          className={classNames(classes.media, classes.cursorPointer)}
          image={thumbnail}
          title={title}
        />
      </RouterLink>
      <CardContent>
        <Typography variant="subtitle1">{title}</Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {clip(excerpt, 150)}
        </Typography>
      </CardContent>
      <CardActions className={classes.actions} disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <IconButton
          className={classes.playBtn}
          aria-label="play"
          onClick={onStartGame}
        >
          {games}&nbsp;
          <PlayCircleFilledWhiteIcon color="primary" />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default ContestCard;
