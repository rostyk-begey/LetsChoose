import React from 'react';
import { styled } from '@mui/material/styles';
import { Alert } from '@mui/material';
import Card from '@mui/material/Card';

import { ContestItem } from './ContestItem';
import { Item } from './useItemsUpload';

const PREFIX = 'ContestItemsList';

const classes = {
  grid: `${PREFIX}-grid`,
  error: `${PREFIX}-error`,
};

const Root = styled('div')(({ theme }) => ({
  [`& .${classes.grid}`]: {
    display: 'grid',
    gridGap: theme.spacing(1),
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gridAutoRows: 'auto',
    padding: theme.spacing(1),
  },

  [`& .${classes.error}`]: {
    marginBottom: theme.spacing(3),
    [theme.breakpoints.down('lg')]: {
      marginBottom: theme.spacing(2),
    },
  },
}));

export interface ContestItemListProps {
  className?: string;
  items: Item[];
  error?: { message: string };
  editedItem: number;
  selectedItems: number[];
  onToggleSelectItem: (i: number) => void;
  onDeleteItem: (i: number) => void;
  onToggleItemEdit: (i: number) => void;
  onItemChange: (i: number, title: string) => void;
}

export const ContestItemsList: React.FC<ContestItemListProps> = ({
  items,
  error,
  className,
  editedItem,
  selectedItems,
  onToggleSelectItem,
  onDeleteItem,
  onToggleItemEdit,
  onItemChange,
}) => (
  <Root className={className}>
    {error && (
      <Alert severity="error" className={classes.error}>
        {error.message}
      </Alert>
    )}
    {!!items.length && (
      <Card className={classes.grid}>
        {items.map(({ id, title, image }, i) => (
          <ContestItem
            key={id}
            idx={i + ''}
            isEditing={editedItem === i && !selectedItems.includes(i)}
            isSelected={selectedItems.includes(i)}
            onChange={(title) => onItemChange(i, title)}
            onToggleEdit={() => onToggleItemEdit(i)}
            onSelect={() => onToggleSelectItem(i)}
            onDeleteClick={() => onDeleteItem(i)}
            img={URL.createObjectURL(image)}
            title={title}
          />
        ))}
      </Card>
    )}
  </Root>
);

ContestItemsList.displayName = 'ContestItemsList';
