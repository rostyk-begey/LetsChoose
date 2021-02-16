import React from 'react';
import { UserDto } from '@lets-choose/common';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import { useFadedShadowStyles } from '@mui-treasury/styles/shadow/faded';
import { useGutterBorderedGridStyles } from '@mui-treasury/styles/grid/gutterBordered';

interface Props {
  user: UserDto;
}

const useStyles = makeStyles(({ palette }) => ({
  card: {
    borderRadius: 8,
    minWidth: 256,
    textAlign: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    margin: 'auto',
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: '0.5px',
    marginTop: 8,
    marginBottom: 0,
  },
  subheader: {
    fontSize: 14,
    color: palette.grey[500],
    marginBottom: '0.875em',
  },
  statLabel: {
    fontSize: 12,
    color: palette.grey[500],
    fontWeight: 500,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    margin: 0,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    letterSpacing: '1px',
  },
}));

const ProfileCard: React.FC<Props> = ({ user: { username, avatar } }) => {
  const classes = useStyles();
  const shadowStyles = useFadedShadowStyles();
  const borderedGridStyles = useGutterBorderedGridStyles({
    borderColor: 'rgba(0, 0, 0, 0.08)',
    height: '50%',
  });
  return (
    <Card className={classNames(classes.card, shadowStyles.root)}>
      <CardContent>
        <Avatar className={classes.avatar} src={avatar} />
        <h3 className={classes.heading}>@{username}</h3>
        {/*TODO: update*/}
        <span className={classes.subheader}>Poland</span>
      </CardContent>
      <Divider light />
      <Box display={'flex'}>
        <Box p={2} flex={'auto'} className={borderedGridStyles.item}>
          <p className={classes.statLabel}>Followers</p>
          <p className={classes.statValue}>6941</p>
        </Box>
        <Box p={2} flex={'auto'} className={borderedGridStyles.item}>
          <p className={classes.statLabel}>Following</p>
          <p className={classes.statValue}>12</p>
        </Box>
      </Box>
    </Card>
  );
};

export default ProfileCard;
