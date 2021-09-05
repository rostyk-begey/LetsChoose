import { Alert } from '@material-ui/lab';
import React, { memo } from 'react';
import Card from '@material-ui/core/Card';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

import ContestItem from './ContestItem';
import { Item } from './useItemsUpload';

interface Props {
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

const useStyles = makeStyles((theme) =>
  createStyles({
    grid: {
      display: 'grid',
      gridGap: theme.spacing(1),
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gridAutoRows: 'auto',
      padding: theme.spacing(1),
    },
    error: {
      marginBottom: theme.spacing(3),
      [theme.breakpoints.down('md')]: {
        marginBottom: theme.spacing(2),
      },
    },
  }),
);

const ContestItemsList: React.FC<Props> = ({
  items,
  error,
  className,
  editedItem,
  selectedItems,
  onToggleSelectItem,
  onDeleteItem,
  onToggleItemEdit,
  onItemChange,
}) => {
  const classes = useStyles();
  return (
    <div className={classNames(className)}>
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
    </div>
  );
};

ContestItemsList.displayName = 'ContestItemsList';

export default ContestItemsList;
