import { Paper } from '@mui/material';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Skeleton from '@mui/material/Skeleton';
import { StyledCard, classes } from './ContestCard';

export const ContestCardSkeleton = () => (
  <StyledCard>
    <CardHeader
      className={classes.cardHeader}
      avatar={
        <Skeleton animation="wave" variant="circular" width={40} height={40} />
      }
      action={
        <IconButton aria-label="settings" size="large">
          <MoreVertIcon />
        </IconButton>
      }
      title={
        <Skeleton animation="wave" height={10} width="80%" sx={{ mb: '6px' }} />
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
      <Skeleton animation="wave" height={14} sx={{ m: '3px 0' }} width="80%" />
      <Skeleton animation="wave" height={14} sx={{ m: '3px 0' }} width="90%" />
    </CardContent>
    <CardActions className={classes.actions} sx={{ height: 44 }} disableSpacing>
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
