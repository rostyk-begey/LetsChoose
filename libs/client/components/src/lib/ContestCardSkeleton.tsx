import React from 'react';
import { styled } from '@mui/material/styles';
import { Paper } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Skeleton from '@mui/material/Skeleton';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { useOverShadowStyles } from '@mui-treasury/styles/shadow/over';

const PREFIX = 'ContestCardSkeleton';

const classes = {
  media: `${PREFIX}-media`,
  title: `${PREFIX}-title`,
  actions: `${PREFIX}-actions`,
  cardHeader: `${PREFIX}-cardHeader`,
  cardContent: `${PREFIX}-cardContent`,
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

  [`& .${classes.cardHeader}`]: {
    padding: theme.spacing(1, 1.5),
  },

  [`& .${classes.cardContent}`]: {
    padding: theme.spacing(1, 1.5),
  },
}));

export const ContestCardSkeleton: React.FC = () => {
  const shadowStyles = useOverShadowStyles();

  return (
    <StyledCard className={shadowStyles.root}>
      <CardHeader
        className={classes.cardHeader}
        avatar={
          <Skeleton
            animation="wave"
            variant="circular"
            width={40}
            height={40}
          />
        }
        action={
          <IconButton aria-label="settings" size="large">
            <MoreVertIcon />
          </IconButton>
        }
        title={
          <Skeleton
            animation="wave"
            height={10}
            width="80%"
            sx={{ mb: '6px' }}
          />
        }
        subheader={<Skeleton animation="wave" height={10} width="40%" />}
      />
      <Skeleton
        animation="wave"
        variant="rectangular"
        className={classes.media}
      />
      <Paper
        sx={{ height: 40, backgroundColor: '#fafafa' }}
        elevation={0}
        square
      />
      <CardContent className={classes.cardContent}>
        <Skeleton animation="wave" height={16} sx={{ m: '6px 0' }} />
        <Skeleton
          animation="wave"
          height={14}
          sx={{ m: '3px 0' }}
          width="80%"
        />
        <Skeleton
          animation="wave"
          height={14}
          sx={{ m: '3px 0' }}
          width="90%"
        />
      </CardContent>
      <CardActions
        className={classes.actions}
        sx={{ height: 44 }}
        disableSpacing
      >
        <Skeleton
          animation="wave"
          width={20}
          height={33.45}
          sx={{ ml: '12px' }}
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
          sx={{ m: '12px', ml: 'auto' }}
        />
      </CardActions>
    </StyledCard>
  );
};
