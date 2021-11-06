import React from 'react';
import Box from '@mui/material/Box';
import { alpha, styled } from '@mui/material/styles';
import { Alert } from '@mui/material';
import Card from '@mui/material/Card';
import { DropzoneState } from 'react-dropzone';

import { ContestItem } from './ContestItem';
import { Item } from './useItemsUpload';

const PREFIX = 'ContestItemsList';

const classes = {
  grid: `${PREFIX}-grid`,
  error: `${PREFIX}-error`,
  dndMessage: `${PREFIX}-dndMessage`,
};

const Root = styled('div')(({ theme }) => ({
  [`& .${classes.grid}`]: {
    display: 'grid',
    gridGap: theme.spacing(1),
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gridAutoRows: 'auto',
  },

  [`& .${classes.error}`]: {
    marginBottom: theme.spacing(3),
    [theme.breakpoints.down('lg')]: {
      marginBottom: theme.spacing(2),
    },
  },

  [`& .${classes.dndMessage}`]: {
    ...theme.typography.h5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 250,
    cursor: 'pointer',
    borderRadius: 4,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor:
      theme.palette.mode === 'light'
        ? alpha(theme.palette.common.black, 0.23)
        : alpha(theme.palette.common.white, 0.23),
    backgroundColor: theme.palette.grey[300],
    '&:hover': {
      borderColor: theme.palette.text.primary,
      backgroundColor: theme.palette.grey[100],
    },
    transition: theme.transitions.create('all', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.short,
    }),
  },
}));

export interface ContestItemListProps {
  dropzoneState: DropzoneState;
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
  dropzoneState,
}) => (
  <Root className={className}>
    {error && (
      <Alert severity="error" className={classes.error}>
        {error.message}
      </Alert>
    )}
    <Card sx={{ p: 1 }} {...dropzoneState.getRootProps()}>
      <input {...dropzoneState.getInputProps()} />
      {!items.length ? (
        <div className={classes.dndMessage}>
          Drag & Drop images here to upload
        </div>
      ) : (
        <Box
          className={classes.grid}
          sx={{ opacity: dropzoneState.isDragAccept ? 0.7 : 1 }}
        >
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
        </Box>
      )}
    </Card>
  </Root>
);
