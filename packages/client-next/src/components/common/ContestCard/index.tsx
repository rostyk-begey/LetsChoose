import React from 'react';
import humanTime from 'human-time';
import clip from 'text-clipper';
import classNames from 'classnames';
import RouterLink from 'next/link';
import Link from '@material-ui/core/Link';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import PlayCircleFilledWhiteIcon from '@material-ui/icons/PlayCircleFilledWhite';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { useOverShadowStyles } from '@mui-treasury/styles/shadow/over';
import { Contest, UserDto } from '@lets-choose/common';

import ROUTES from '../../../utils/routes';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      maxWidth: 345,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    media: {
      height: 0,
      paddingTop: '100%',
      // paddingTop: '56.25%', // 16:9
    },
    avatar: {
      backgroundColor: red[500],
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
  }),
);

interface Props {
  contest: Contest;
}

const ContestCard: React.FC<Props> = ({
  contest: { id, thumbnail, title, excerpt, author, games, items, createdAt },
}) => {
  const classes = useStyles();
  const shadowStyles = useOverShadowStyles();
  const username = (author as UserDto).username;

  return (
    <Card className={classNames(classes.root, shadowStyles.root)}>
      <CardHeader
        avatar={
          <RouterLink href={`${ROUTES.USERS}/${username}`}>
            <Avatar
              aria-label="recipe"
              className={classNames(classes.avatar, classes.cursorPointer)}
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
        <IconButton className={classes.playBtn} aria-label="play">
          <PlayCircleFilledWhiteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default ContestCard;
