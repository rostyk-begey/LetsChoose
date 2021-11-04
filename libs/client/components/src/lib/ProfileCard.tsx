import React from 'react';
import { alpha, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { UserPublicDto } from '@lets-choose/common/dto';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { useFadedShadowStyles } from '@mui-treasury/styles/shadow/faded';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { useGutterBorderedGridStyles } from '@mui-treasury/styles/grid/gutterBordered';

const PREFIX = 'ProfileCard';

const classes = {
  avatar: `${PREFIX}-avatar`,
  heading: `${PREFIX}-heading`,
  subheader: `${PREFIX}-subheader`,
  statLabel: `${PREFIX}-statLabel`,
  statValue: `${PREFIX}-statValue`,
};

const StyledCard = styled(Card)(({ theme: { palette, ...theme } }) => ({
  borderRadius: 8,
  minWidth: 256,
  textAlign: 'center',

  [`& .${classes.avatar}`]: {
    width: 60,
    height: 60,
    margin: 'auto',
  },

  [`& .${classes.heading}`]: {
    fontSize: 18,
    fontWeight: theme.typography.fontWeightBold,
    letterSpacing: '0.5px',
    marginTop: 8,
    marginBottom: 0,
  },

  [`& .${classes.subheader}`]: {
    fontSize: 14,
    color: palette.grey[500],
    marginBottom: '0.875em',
  },

  [`& .${classes.statLabel}`]: {
    fontSize: 12,
    color: palette.grey[500],
    fontWeight: 500,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    margin: 0,
  },

  [`& .${classes.statValue}`]: {
    fontSize: 20,
    fontWeight: theme.typography.fontWeightBold,
    marginBottom: 4,
    letterSpacing: '1px',
  },
}));

export interface ProfileCardProps {
  user: UserPublicDto;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  user: { username, avatar },
}) => {
  const shadowStyles = useFadedShadowStyles();
  const theme = useTheme();
  const borderedGridStyles = useGutterBorderedGridStyles({
    borderColor: alpha(theme.palette.common.black, 0.08),
    height: '50%',
  });

  return (
    <StyledCard className={shadowStyles.root}>
      <CardContent>
        <Avatar className={classes.avatar} src={avatar} />
        <h3 className={classes.heading}>@{username}</h3>
        {/*TODO: update*/}
        <span className={classes.subheader}>Poland</span>
      </CardContent>
      <Divider light />
      <Box display={'flex'}>
        <Box p={2} flex="auto" className={borderedGridStyles.item}>
          <p className={classes.statLabel}>Followers</p>
          <p className={classes.statValue}>6941</p>
        </Box>
        <Box p={2} flex="auto" className={borderedGridStyles.item}>
          <p className={classes.statLabel}>Following</p>
          <p className={classes.statValue}>12</p>
        </Box>
      </Box>
    </StyledCard>
  );
};
