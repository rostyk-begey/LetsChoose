import React from 'react';
import { styled } from '@mui/material/styles';
import { ContestItemDto } from '@lets-choose/common/dto';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { useFourThreeCardMediaStyles } from '@mui-treasury/styles/cardMedia/fourThree';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { useOverShadowStyles } from '@mui-treasury/styles/shadow/over';
import Image from 'next/image';
import { cloudinaryUploadPath } from '@lets-choose/client/utils';

const PREFIX = 'GameCard';

const classes = {
  imageHolder: `${PREFIX}-imageHolder`,
};

const StyledCard = styled(Card)(() => ({
  cursor: 'pointer',
  width: '100%',

  [`& .${classes.imageHolder}`]: {
    position: 'relative',
  },
}));

export interface GameCardProps {
  item?: ContestItemDto;
  onClick?: () => any;
}

export const GameCard: React.FC<GameCardProps> = ({
  item,
  onClick = () => null,
}) => {
  const cardMediaStyles = useFourThreeCardMediaStyles();
  const shadowStyles = useOverShadowStyles();

  if (!item) {
    return null;
  }

  return (
    <StyledCard className={shadowStyles.root} onClick={onClick}>
      <CardMedia classes={cardMediaStyles} className={classes.imageHolder}>
        <Image
          src={cloudinaryUploadPath(item.image)}
          alt={item.title}
          objectFit="cover"
          layout="fill"
        />
      </CardMedia>
    </StyledCard>
  );
};
