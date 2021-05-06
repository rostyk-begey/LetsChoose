import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { ContestItem } from '@lets-choose/common';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import { useFourThreeCardMediaStyles } from '@mui-treasury/styles/cardMedia/fourThree';
import { useOverShadowStyles } from '@mui-treasury/styles/shadow/over';
import classNames from 'classnames';

const useStyles = makeStyles(() => ({
  image: {
    position: 'absolute',
    top: '50%',
    width: '100%',
    transform: 'translateY(-50%)',
  },
  imageHolder: {
    position: 'relative',
  },
  gameCard: {
    cursor: 'pointer',
    width: '100%',
  },
}));

interface Props {
  item?: ContestItem;
  onClick?: () => any;
}

const GameCard: React.FC<Props> = ({ item, onClick = () => null }) => {
  const classes = useStyles();
  const cardMediaStyles = useFourThreeCardMediaStyles();
  const shadowStyles = useOverShadowStyles();

  if (!item) {
    return null;
  }

  return (
    <Card
      className={classNames(classes.gameCard, shadowStyles.root)}
      onClick={onClick}
    >
      <CardMedia classes={cardMediaStyles} className={classes.imageHolder}>
        <img src={item.image} alt="" className={classes.image} />
      </CardMedia>
    </Card>
  );
};

export default GameCard;
