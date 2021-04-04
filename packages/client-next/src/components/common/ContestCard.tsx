import React, { useCallback, useEffect, useState } from 'react';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import { useRouter } from 'next/router';
import humanTime from 'human-time';
import clip from 'text-clipper';
import classNames from 'classnames';
import RouterLink from 'next/link';
import Skeleton from '@material-ui/lab/Skeleton';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
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
import SwipeableViews from 'react-swipeable-views';

import {
  useContestDelete,
  useContestItemsInfinite,
} from '../../hooks/api/contest';
import { useGameStart } from '../../hooks/api/game';
import { useCurrentUser } from '../../hooks/api/user';
import ROUTES from '../../utils/routes';

export const useStyles = makeStyles((theme) => ({
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
    paddingTop: '75%',
  },
  cursorPointer: {
    cursor: 'pointer',
  },
  title: {
    textTransform: 'none',
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightMedium,
    '&:hover': {
      textDecoration: 'underline',
      color: theme.palette.text.primary,
    },
  },
  actions: {
    marginTop: 'auto',
    padding: theme.spacing(0),
  },
  playBtn: {
    marginLeft: 'auto',
  },
  cardHeader: {
    padding: theme.spacing(1, 1.5),
  },
  cardContent: {
    padding: theme.spacing(1, 1.5),
  },
  sliderNavigation: {
    padding: theme.spacing(0.5, 0),
  },
}));

interface Props {
  contest: Contest;
  onDelete?: () => any;
}

const itemsPerPage = 5;
const loadingOffset = 1;

const ContestCard: React.FC<Props> = ({ contest, onDelete }) => {
  const classes = useStyles();
  const shadowStyles = useOverShadowStyles();
  const router = useRouter();

  const { id, thumbnail, title, excerpt, author, games, createdAt } = contest;
  const username = (author as UserDto).username;
  const { data: { data: user } = {} } = useCurrentUser({});
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useContestItemsInfinite(contest.id, { page: 2, perPage: itemsPerPage });
  const pages = data?.pages || [];
  const { totalItems = 0 } = pages?.[0]?.data || {};
  const currentItemsLength = pages.reduce(
    (acc, { data: { items } }) => acc + items.length,
    0,
  );
  let currentPage = 0;
  if (data) {
    ({ currentPage = 0 } = pages[pages.length - 1].data);
  }
  const maxSteps = totalItems + 1;
  const { mutateAsync: startGame } = useGameStart();
  const onStartGame = async () => {
    const { data: { gameId = null } = {} } = (await startGame(id)) || {};
    router.push(`${ROUTES.GAMES.INDEX}/${gameId}`);
  };
  const [activeStep, setActiveStep] = useState(0);
  useEffect(() => {
    if (activeStep > 0) {
      const timeout = setTimeout(() => setActiveStep(0), 3000);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [activeStep]);
  const handleNext = useCallback(async () => {
    const itemsUpToCurrentPage = currentPage * itemsPerPage;
    const shouldFetchMore = activeStep > 0 && activeStep % itemsPerPage === 0;
    const canProceed = activeStep - loadingOffset < itemsUpToCurrentPage;
    if (shouldFetchMore && hasNextPage) {
      fetchNextPage();
    }

    if (!isLoading && canProceed && activeStep < totalItems) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  }, [activeStep, totalItems, currentPage]);

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const { mutateAsync: deleteContest } = useContestDelete(id);
  const onDeleteClick = async () => {
    await deleteContest();
    handleMenuClose();
    onDelete && onDelete();
  };

  return (
    <Card className={classNames(classes.root, shadowStyles.root)}>
      <CardHeader
        className={classes.cardHeader}
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
          user?.username === username && (
            <>
              <IconButton aria-label="settings" onClick={handleMenuClick}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                keepMounted
                open={Boolean(menuAnchor)}
                onClose={handleMenuClose}
                anchorEl={menuAnchor}
              >
                <MenuItem>
                  <ListItemIcon onClick={onDeleteClick}>
                    <DeleteIcon />
                  </ListItemIcon>
                  Delete
                </MenuItem>
              </Menu>
            </>
          )
        }
        title={
          <RouterLink href={`${ROUTES.USERS}/${username}`} passHref>
            <Link>@{username}</Link>
          </RouterLink>
        }
        subheader={humanTime(new Date(createdAt))}
      />
      <RouterLink href={`${ROUTES.CONTESTS.INDEX}/${id}`}>
        <SwipeableViews
          index={activeStep}
          onChangeIndex={handleStepChange}
          enableMouseEvents
        >
          <CardMedia
            className={classNames(classes.media, classes.cursorPointer)}
            image={thumbnail}
          />
          {pages.map(({ data: { items } }) =>
            items.map(({ id, image, title }) => (
              <CardMedia
                key={id}
                className={classNames(classes.media, classes.cursorPointer)}
                image={image}
                title={title}
              />
            )),
          )}
          {Array.from({ length: totalItems - currentItemsLength }).map(
            (_, i) => (
              <Skeleton
                key={i}
                animation="wave"
                variant="rect"
                className={classes.media}
              />
            ),
          )}
        </SwipeableViews>
      </RouterLink>
      <MobileStepper
        steps={maxSteps}
        position="static"
        variant="text"
        activeStep={activeStep}
        className={classes.sliderNavigation}
        nextButton={
          <Button
            size="small"
            onClick={handleNext}
            disabled={isLoading && activeStep === maxSteps - 1}
          >
            Next
            <KeyboardArrowRight />
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            <KeyboardArrowLeft />
            Back
          </Button>
        }
      />
      <CardContent className={classes.cardContent}>
        <RouterLink href={`${ROUTES.CONTESTS.INDEX}/${contest.id}`} passHref>
          <Typography
            component="a"
            variant="subtitle1"
            className={classes.title}
          >
            {title}
          </Typography>
        </RouterLink>
        <Typography variant="body2" color="textSecondary" component="p">
          {clip(excerpt, 150)}
        </Typography>
      </CardContent>
      <CardActions className={classes.actions} disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon fontSize="small" />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon fontSize="small" />
        </IconButton>
        <div className={classes.playBtn}>
          {games}&nbsp;
          <IconButton aria-label="play" onClick={onStartGame}>
            <PlayCircleFilledWhiteIcon fontSize="small" color="primary" />
          </IconButton>
        </div>
      </CardActions>
    </Card>
  );
};

export default ContestCard;
