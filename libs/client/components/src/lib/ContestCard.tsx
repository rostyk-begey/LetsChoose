import {
  useContestDelete,
  useContestItemsInfinite,
  useContestReset,
  useCurrentUser,
  useGameStart,
} from '@lets-choose/client/hooks';
import { cloudinaryUploadPath, ROUTES } from '@lets-choose/client/utils';
import { ContestDto, UserDto } from '@lets-choose/common/dto';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MobileStepper from '@material-ui/core/MobileStepper';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PlayCircleFilledWhiteIcon from '@material-ui/icons/PlayCircleFilledWhite';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
// import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import Skeleton from '@material-ui/lab/Skeleton';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { useOverShadowStyles } from '@mui-treasury/styles/shadow/over';
import classNames from 'classnames';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import humanTime from 'human-time';
import Image from 'next/image';
import RouterLink from 'next/link';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React, { useCallback, useEffect, useState } from 'react';
import SwipeableViews from 'react-swipeable-views';
import clip from 'text-clipper';

export const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: 345,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 8,
      overflow: 'visible',
    },
    media: {
      position: 'relative',
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
      padding: theme.spacing(0, 0.5, 0.5),
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
    actionBtn: {
      padding: theme.spacing(1),
    },
    settingsBtn: {
      marginTop: theme.spacing(0.5),
    },
    headerAction: {
      alignSelf: 'center',
    },
  }),
);

export interface ContestCardProps {
  contest: ContestDto;
  onDelete?: () => void;
}

const itemsPerPage = 5;
const loadingOffset = 1;

const useContestItemsSlider = (contestId: string) => {
  const query = useContestItemsInfinite(contestId, {
    page: 2,
    perPage: itemsPerPage,
  });
  const { data, fetchNextPage, hasNextPage, isLoading } = query;
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

  const [activeStep, setActiveStep] = useState(0);

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
  }, [
    activeStep,
    totalItems,
    currentPage,
    fetchNextPage,
    hasNextPage,
    isLoading,
  ]);

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };

  useEffect(() => {
    if (activeStep > 0) {
      const timeout = setTimeout(() => setActiveStep(0), 3000);
      return () => {
        clearTimeout(timeout);
      };
    }

    return () => null;
  }, [activeStep]);

  return {
    query,
    pages,
    maxSteps,
    currentItemsLength,
    totalItems,
    activeStep,
    handleNext,
    handleBack,
    handleStepChange,
  };
};

const useMenu = () => {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  return { menuAnchor, handleMenuClick, handleMenuClose };
};

export const ContestCard: React.FC<ContestCardProps> = ({
  contest,
  onDelete,
}) => {
  const classes = useStyles();
  const shadowStyles = useOverShadowStyles();
  const router = useRouter();
  const [isLinkCopied, setIsLinkCopied] = useState(false);

  const { id, thumbnail, title, excerpt, author, games, createdAt } = contest;
  const username = (author as UserDto).username;
  const { data: { data: user } = {} } = useCurrentUser({});
  const { mutateAsync: startGame } = useGameStart();
  const handleStartGameClick = async () => {
    const { data: { gameId = null } = {} } = (await startGame(id)) || {};
    await router.push(`${ROUTES.GAMES.INDEX}/${gameId}`);
  };
  const {
    query: { isLoading: isSliderLoading },
    pages,
    maxSteps,
    currentItemsLength,
    totalItems,
    activeStep,
    handleNext,
    handleBack,
    handleStepChange,
  } = useContestItemsSlider(contest.id);
  const { menuAnchor, handleMenuClick, handleMenuClose } = useMenu();
  const { mutateAsync: deleteContest } = useContestDelete(id);
  const { mutateAsync: resetContest } = useContestReset(contest.id);
  const handleDeleteClick = async () => {
    if (
      window.confirm(
        'Are you sure you want to delete contest? All data will be lost.',
      )
    ) {
      await deleteContest();
      handleMenuClose();
      onDelete && onDelete();
    }
  };
  const handleEditClick = () => {
    router.push(`${ROUTES.CONTESTS.INDEX}/${contest.id}/edit`);
  };
  const handleResetClick = async () => {
    if (
      window.confirm(
        'Are you sure you want to reset contest? All data will be reset to defaults.',
      )
    ) {
      await resetContest();
      handleMenuClose();
      onDelete && onDelete();
    }
  };
  const { enqueueSnackbar } = useSnackbar();

  const handleShareClick = () => {
    const url = `${window.location.origin}${ROUTES.CONTESTS.INDEX}/${contest.id}`;
    if (navigator?.share) {
      navigator.share({ title, url });
    } else {
      navigator.clipboard
        .writeText(url)
        .then(() => {
          setIsLinkCopied(true);
        })
        .catch(() => {
          enqueueSnackbar('Failed to copy to clipboard', {
            variant: 'error',
            preventDuplicate: true,
          });
        });
    }
  };

  return (
    <Card className={classNames(classes.root, shadowStyles.root)}>
      <CardHeader
        classes={{
          root: classes.cardHeader,
          action: classes.headerAction,
        }}
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
              <IconButton
                aria-label="settings"
                className={classNames(classes.actionBtn, classes.settingsBtn)}
                onClick={handleMenuClick}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                keepMounted
                open={Boolean(menuAnchor)}
                onClose={handleMenuClose}
                anchorEl={menuAnchor}
              >
                <MenuItem>
                  <ListItemIcon onClick={handleEditClick}>
                    <EditIcon />
                  </ListItemIcon>
                  Edit
                </MenuItem>
                <MenuItem>
                  <ListItemIcon onClick={handleResetClick}>
                    <RotateLeftIcon />
                  </ListItemIcon>
                  Reset
                </MenuItem>
                <MenuItem>
                  <ListItemIcon onClick={handleDeleteClick}>
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
          >
            <Image
              src={cloudinaryUploadPath(thumbnail)}
              alt={title}
              title={title}
              objectFit="cover"
              layout="fill"
            />
          </CardMedia>
          {pages.map(({ data: { items } }) =>
            items.map(({ id, image, title }) => (
              <CardMedia
                key={id}
                className={classNames(classes.media, classes.cursorPointer)}
              >
                <Image
                  src={cloudinaryUploadPath(image)}
                  alt={title}
                  title={title}
                  objectFit="cover"
                  layout="fill"
                />
              </CardMedia>
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
            disabled={isSliderLoading || activeStep === maxSteps - 1}
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
        {/* TODO: add to favorites button */}
        {/*<IconButton aria-label="add to favorites">*/}
        {/*  <FavoriteIcon fontSize="small" />*/}
        {/*</IconButton>*/}
        <Tooltip
          title={isLinkCopied ? 'Copied!' : 'Copy link'}
          onClose={() => setIsLinkCopied(false)}
          placement="right"
          PopperProps={{ disablePortal: true }}
          arrow
        >
          <IconButton aria-label="share" className={classes.actionBtn}>
            <ShareIcon fontSize="small" onClick={handleShareClick} />
          </IconButton>
        </Tooltip>
        <div className={classes.playBtn}>
          {games}&nbsp;
          <Tooltip
            title="Play"
            placement="top"
            PopperProps={{ disablePortal: true }}
            arrow
          >
            <IconButton
              aria-label="play"
              className={classes.actionBtn}
              onClick={handleStartGameClick}
            >
              <PlayCircleFilledWhiteIcon color="secondary" />
            </IconButton>
          </Tooltip>
        </div>
      </CardActions>
    </Card>
  );
};

export default ContestCard;
