import React, { useCallback, useEffect, useState } from 'react';
import {
  useContestDelete,
  useContestItemsInfinite,
  useContestReset,
  useCurrentUser,
  useGameStart,
} from '@lets-choose/client/hooks';
import { styled } from '@mui/material/styles';
import { cloudinaryUploadPath, ROUTES } from '@lets-choose/client/utils';
import { ContestDto, UserPublicDto } from '@lets-choose/common/dto';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MobileStepper from '@mui/material/MobileStepper';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
// import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import Skeleton from '@mui/material/Skeleton';
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
import SwipeableViews from 'react-swipeable-views';
import clip from 'text-clipper';

const PREFIX = 'ContestCard';

const classes = {
  media: `${PREFIX}-media`,
  cursorPointer: `${PREFIX}-cursorPointer`,
  title: `${PREFIX}-title`,
  actions: `${PREFIX}-actions`,
  playBtn: `${PREFIX}-playBtn`,
  cardHeader: `${PREFIX}-cardHeader`,
  cardContent: `${PREFIX}-cardContent`,
  sliderNavigation: `${PREFIX}-sliderNavigation`,
  actionBtn: `${PREFIX}-actionBtn`,
  settingsBtn: `${PREFIX}-settingsBtn`,
  headerAction: `${PREFIX}-headerAction`,
};

const StyledCard = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 345,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 8,
  overflow: 'visible',

  [`& .${classes.media}`]: {
    position: 'relative',
    height: 0,
    paddingTop: '75%',
  },

  [`& .${classes.cursorPointer}`]: {
    cursor: 'pointer',
  },

  [`& .${classes.title}`]: {
    textTransform: 'none',
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightMedium,
    '&:hover': {
      textDecoration: 'underline',
      color: theme.palette.text.primary,
    },
  },

  [`& .${classes.actions}`]: {
    marginTop: 'auto',
    padding: theme.spacing(0, 0.5, 0.5),
  },

  [`& .${classes.playBtn}`]: {
    marginLeft: 'auto',
  },

  [`& .${classes.cardHeader}`]: {
    padding: theme.spacing(1, 1.5),
  },

  [`& .${classes.cardContent}`]: {
    padding: theme.spacing(1, 1.5),
  },

  [`& .${classes.sliderNavigation}`]: {
    padding: theme.spacing(0.5, 0),
  },

  [`& .${classes.actionBtn}`]: {
    padding: theme.spacing(1),
  },

  [`& .${classes.settingsBtn}`]: {
    marginTop: theme.spacing(0.5),
  },

  [`& .${classes.headerAction}`]: {
    alignSelf: 'center',
  },
}));

export {};

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
  const shadowStyles = useOverShadowStyles();
  const router = useRouter();
  const [isLinkCopied, setIsLinkCopied] = useState(false);

  const { id, thumbnail, title, excerpt, author, games, createdAt } = contest;
  const username = (author as UserPublicDto).username;
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
    <StyledCard className={shadowStyles.root}>
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
              src={(author as UserPublicDto).avatar}
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
                size="large"
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
                variant="rectangular"
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
          <IconButton
            aria-label="share"
            className={classes.actionBtn}
            size="large"
          >
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
              size="large"
            >
              <PlayCircleFilledWhiteIcon color="secondary" />
            </IconButton>
          </Tooltip>
        </div>
      </CardActions>
    </StyledCard>
  );
};

export default ContestCard;
