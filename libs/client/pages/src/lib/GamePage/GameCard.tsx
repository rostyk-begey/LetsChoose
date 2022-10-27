import { styled } from '@mui/material/styles';
import { ContestItemDto } from '@lets-choose/common/dto';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Image from 'next/image';
import {
  cloudinaryBlurPreview,
  cloudinaryUploadPath,
} from '@lets-choose/client/utils';

const PREFIX = 'GameCard';

const classes = {
  imageHolder: `${PREFIX}-imageHolder`,
};

const StyledCard = styled(Card)(({ theme }) => ({
  cursor: 'pointer',
  width: '100%',
  boxShadow: theme.shadows[16],

  '&:hover': {
    boxShadow: theme.shadows[20],
  },

  [`& .${classes.imageHolder}`]: {
    position: 'relative',
    aspectRatio: '4/3',
  },
}));

export interface GameCardProps {
  item?: ContestItemDto;
  onClick?: () => void;
}

export const GameCard = ({ item, onClick = () => null }: GameCardProps) => {
  if (!item) {
    return null;
  }

  return (
    <StyledCard onClick={onClick}>
      <CardMedia className={classes.imageHolder}>
        <Image
          src={cloudinaryUploadPath(item.image)}
          alt={item.title}
          blurDataURL={cloudinaryBlurPreview(item.image)}
          placeholder="blur"
          objectFit="cover"
          layout="fill"
          priority
        />
      </CardMedia>
    </StyledCard>
  );
};
