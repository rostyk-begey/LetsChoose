import { useConfirm } from 'material-ui-confirm';
import { useSnackbar } from 'notistack';
import {
  DropdownButton,
  Page,
  Subheader,
} from '@lets-choose/client/components';
import { styled } from '@mui/material/styles';
import {
  contestApi,
  contestQueryKeys,
  useContestFind,
  useContestItemsInfinite,
  useCurrentUser,
  useGameApi,
} from '@lets-choose/client/hooks';
import {
  cloudinaryAspectRatio,
  cloudinaryBlurPreview,
  cloudinaryUploadPath,
  ROUTES,
} from '@lets-choose/client/utils';
import { ContestDto, ContestItemDto } from '@lets-choose/common/dto';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Fab from '@mui/material/Fab';
import Grid from '@mui/material/Grid';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import RecentActorsRoundedIcon from '@mui/icons-material/RecentActorsRounded';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import Skeleton from '@mui/material/Skeleton';
import { AxiosResponse } from 'axios';
import { NextSeo } from 'next-seo';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { useMutation, useQueryClient } from 'react-query';
import { Table } from './Table';

const PREFIX = 'ContestPage';

const classes = {
  headerTitle: `${PREFIX}-headerTitle`,
  subheader: `${PREFIX}-subheader`,
  container: `${PREFIX}-container`,
  playBtn: `${PREFIX}-playBtn`,
  actionButtonIcon: `${PREFIX}-actionButtonIcon`,
  thumbnailContainer: `${PREFIX}-thumbnailContainer`,
  thumbnail: `${PREFIX}-thumbnail`,
  divider: `${PREFIX}-divider`,
  subheaderText: `${PREFIX}-subheaderText`,
  subheaderStats: `${PREFIX}-subheaderStats`,
  contestContentCard: `${PREFIX}-contestContentCard`,
  contestContent: `${PREFIX}-contestContent`,
  contestContentText: `${PREFIX}-contestContentText`,
  contestContentTitle: `${PREFIX}-contestContentTitle`,
  contestContentExcerpt: `${PREFIX}-contestContentExcerpt`,
  contestActionsBar: `${PREFIX}-contestActionsBar`,
  chip: `${PREFIX}-chip`,
};

const StyledSubheader = styled(Subheader)(
  ({ theme: { breakpoints, ...theme } }) => ({
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.text.primary,
    [breakpoints.down('sm')]: {
      padding: theme.spacing(1, 1.5),
    },

    [`& .${classes.subheaderText}`]: {
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
    },

    [`& .${classes.headerTitle}`]: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      marginRight: theme.spacing(1),
      fontSize: '1.2rem',
      fontWeight: theme.typography.fontWeightMedium,
      [breakpoints.down('md')]: {
        fontSize: '1.1rem',
      },
    },

    [`& .${classes.subheaderStats}`]: {
      display: 'flex',
      alignItems: 'center',
      fontSize: '0.8rem',
      color: theme.palette.text.secondary,
      '& > span': {
        display: 'inline-flex',
        alignItems: 'center',
        marginRight: theme.spacing(0.5),
        '& > svg': {
          fontSize: '1.2rem',
          marginRight: 2,
        },
      },
    },

    [`& .${classes.playBtn}`]: {
      color: theme.palette.common.white,
      marginLeft: 'auto',
    },

    [`& .${classes.divider}`]: {
      width: 2,
      height: 32,
      margin: theme.spacing(0, 3),
    },
  }),
);

const StyledPage = styled(Page)(({ theme: { breakpoints, ...theme } }) => ({
  [`& .${classes.subheader}`]: {
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.text.primary,
    [breakpoints.down('sm')]: {
      padding: theme.spacing(1, 1.5),
    },
  },

  [`& .${classes.playBtn}`]: {
    color: theme.palette.common.white,
    marginLeft: 'auto',
  },

  [`& .${classes.container}`]: {
    [breakpoints.down('sm')]: {
      padding: theme.spacing(0, 1.5),
    },
  },

  [`& .${classes.actionButtonIcon}`]: {
    marginRight: theme.spacing(0.5),
  },

  [`& .${classes.thumbnailContainer}`]: {
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    paddingBottom: '75%',
    position: 'relative',
    overflow: 'hidden',
    margin: 0,
  },

  [`& .${classes.thumbnail}`]: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },

  [`& .${classes.contestContentCard}`]: {
    display: 'grid',
    gridTemplateColumns: '40% auto',
    '@media (max-width: 768px)': {
      display: 'block',
    },
  },

  [`& .${classes.contestContent}`]: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
    [breakpoints.down('sm')]: {
      padding: theme.spacing(1.5),
    },
    [breakpoints.down('xs')]: {
      padding: theme.spacing(2, 1, 1),
    },
  },

  [`& .${classes.contestContentText}`]: {
    padding: 0,
  },

  [`& .${classes.contestContentTitle}`]: {
    [breakpoints.down('md')]: {
      fontSize: '1.3rem',
      fontWeight: theme.typography.fontWeightMedium,
    },
    [breakpoints.down('sm')]: {
      fontSize: '1.1rem',
    },
  },

  [`& .${classes.contestContentExcerpt}`]: {
    [breakpoints.down('md')]: {
      fontSize: '1rem',
    },
    [breakpoints.down('sm')]: {
      fontSize: '0.9rem',
    },
  },

  [`& .${classes.contestActionsBar}`]: {
    paddingTop: theme.spacing(2),
    marginTop: 'auto',
    display: 'flex',
    alignItems: 'center',
  },

  [`& .${classes.chip}`]: {
    marginRight: theme.spacing(0.5),
  },
}));

const itemsPerPage = 10;

export interface ContestPageProps {
  initialContest: ContestDto;
}

export const ContestPage: React.FC<ContestPageProps> = ({ initialContest }) => {
  const { id: contestId } = initialContest;
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const {
    data: contestResponse,
    isLoading: contestIsLoading,
    remove: removeContest,
  } = useContestFind(contestId as string, {
    initialData: initialContest as never,
  });
  const { data: user } = useCurrentUser({});
  const contest = contestResponse || initialContest;
  const isCurrentUserAuthor = user?.id === contest.author;

  const { mutate: startGame } = useMutation(useGameApi.start, {
    onSuccess: ({ data: { gameId } }) => {
      router.push(`${ROUTES.GAMES.INDEX}/${gameId}`);
    },
  });
  const confirm = useConfirm();
  const onStartGame = async () => startGame(contestId as string);
  const {
    data: contestItemsData,
    fetchNextPage,
    hasNextPage,
    isLoading: contestItemsIsLoading,
  } = useContestItemsInfinite(
    contestId as string,
    { perPage: itemsPerPage },
    { enabled: !!contest },
  );
  const queryClient = useQueryClient();
  const isLoading = contestIsLoading || contestItemsIsLoading;
  const pages = contestItemsData?.pages || [];
  const { totalItems = 0 } = pages?.[0]?.data || {};
  const { mutate: resetContest } = useMutation(
    () => contestApi.reset(contest.id),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(contestQueryKeys.all({}));
        enqueueSnackbar('Contest successfully reset', {
          variant: 'success',
        });
      },
    },
  );
  const { mutate: deleteContest } = useMutation(
    () => contestApi.remove(contest.id),
    {
      onSuccess: () => {
        router.push(ROUTES.HOME);

        enqueueSnackbar('Contest successfully deleted', {
          variant: 'success',
        });
      },
    },
  );

  const thumbnail = cloudinaryAspectRatio(contest.thumbnail);
  const blurPreviewURL = cloudinaryBlurPreview(contest.thumbnail);

  const itemsChip = (
    <Chip
      icon={<RecentActorsRoundedIcon />}
      label={`${totalItems} Items`}
      className={classes.chip}
    />
  );
  const gamesChip = (
    <Chip
      icon={<PlayCircleOutlineIcon />}
      label={`${contest.games} Games`}
      className={classes.chip}
    />
  );
  const chipSkeleton = (
    <Skeleton
      animation="wave"
      width={100}
      height={24}
      className={classes.chip}
    />
  );

  return (
    <StyledPage
      subHeader={
        contest ? (
          <StyledSubheader>
            <div className={classes.subheaderText}>
              <Typography variant="h5" className={classes.headerTitle}>
                {contest.title}
              </Typography>
              <div className={classes.subheaderStats}>
                <span>
                  <RecentActorsRoundedIcon />
                  {totalItems} Items
                </span>
                <span>
                  <PlayCircleOutlineIcon />
                  {contest.games} Games
                </span>
              </div>
            </div>
            {isCurrentUserAuthor ? (
              <DropdownButton
                className={classes.playBtn}
                mainButtonProps={{
                  startIcon: <PlayCircleFilledWhiteIcon />,
                  children: 'Play',
                  onClick: onStartGame,
                }}
                items={[
                  {
                    content: (
                      <>
                        <ListItemIcon>
                          <EditIcon />
                        </ListItemIcon>
                        Edit
                      </>
                    ),
                    onClick: () => {
                      router.push(`${ROUTES.CONTESTS.INDEX}/${contestId}/edit`);
                    },
                  },
                  {
                    content: (
                      <>
                        <ListItemIcon>
                          <RotateLeftIcon />
                        </ListItemIcon>
                        Reset
                      </>
                    ),
                    onClick: async () => {
                      await confirm({
                        description:
                          'Are you sure you want to reset contest? All data will be reset to defaults.',
                      });
                      resetContest();
                    },
                  },
                  {
                    content: (
                      <>
                        <ListItemIcon>
                          <DeleteIcon />
                        </ListItemIcon>
                        Delete
                      </>
                    ),
                    onClick: async () => {
                      await confirm({
                        description: 'Are you sure you want to delete?',
                      });
                      deleteContest();
                    },
                  },
                ]}
              />
            ) : (
              <Button
                color="secondary"
                variant="contained"
                onClick={onStartGame}
                className={classes.playBtn}
                startIcon={<PlayCircleFilledWhiteIcon />}
              >
                Play
              </Button>
            )}
          </StyledSubheader>
        ) : (
          <StyledSubheader>
            <Skeleton animation="wave" width={200} height={32} />
            <div className={classes.subheaderStats}>
              <Divider orientation="vertical" className={classes.divider} />
              {chipSkeleton}
              {chipSkeleton}
            </div>
            <Skeleton
              animation="wave"
              width={100}
              height={60}
              className={classes.playBtn}
            />
          </StyledSubheader>
        )
      }
    >
      <NextSeo
        title={initialContest.title}
        description={initialContest.excerpt}
        openGraph={{
          title: initialContest.title,
          ...(initialContest.excerpt && {
            description: initialContest.excerpt,
          }),
          images: [
            {
              url: initialContest.thumbnail,
              alt: initialContest.title,
            },
          ],
        }}
      />
      <Container className={classes.container}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12}>
            <Card>
              <Grid container className={classes.contestContentCard}>
                <figure className={classes.thumbnailContainer}>
                  {contest ? (
                    <Image
                      src={cloudinaryUploadPath(thumbnail)}
                      className={classes.thumbnail}
                      alt={contest.title}
                      blurDataURL={blurPreviewURL}
                      placeholder="blur"
                      objectFit="cover"
                      layout="fill"
                    />
                  ) : (
                    <Skeleton
                      animation="wave"
                      width="100%"
                      height="100%"
                      variant="rectangular"
                      className={classes.thumbnail}
                    />
                  )}
                </figure>
                <div className={classes.contestContent}>
                  {contest ? (
                    <>
                      <CardContent className={classes.contestContentText}>
                        <Typography
                          variant="h4"
                          className={classes.contestContentTitle}
                          gutterBottom
                        >
                          {contest.title}
                        </Typography>
                        <Typography
                          variant="body1"
                          className={classes.contestContentExcerpt}
                        >
                          {contest.excerpt}
                        </Typography>
                      </CardContent>
                      <div className={classes.contestActionsBar}>
                        {itemsChip}
                        {gamesChip}
                        <Fab
                          color="secondary"
                          variant="extended"
                          size="small"
                          className={classes.playBtn}
                          onClick={onStartGame}
                        >
                          <PlayCircleFilledWhiteIcon
                            fontSize="small"
                            className={classes.actionButtonIcon}
                          />
                          Play
                        </Fab>
                      </div>
                    </>
                  ) : (
                    <>
                      <CardContent>
                        <Skeleton animation="wave" width="45%" height={56} />
                        <Skeleton animation="wave" width="20%" height={24} />
                      </CardContent>
                      <div className={classes.contestActionsBar}>
                        {chipSkeleton}
                        {chipSkeleton}
                        <Skeleton
                          animation="wave"
                          width={100}
                          height={24}
                          className={classes.playBtn}
                        />
                      </div>
                    </>
                  )}
                </div>
              </Grid>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <InfiniteScroll
                pageStart={0}
                loadMore={() => fetchNextPage()}
                hasMore={!!hasNextPage}
              >
                <Table
                  data={
                    isLoading
                      ? (Array.from({ length: 4 }).fill(0) as ContestItemDto[])
                      : pages.reduce(
                          (acc, { data: { items } }) => [...acc, ...items],
                          [] as ContestItemDto[],
                        )
                  }
                  skeleton={isLoading}
                />
              </InfiniteScroll>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </StyledPage>
  );
};
