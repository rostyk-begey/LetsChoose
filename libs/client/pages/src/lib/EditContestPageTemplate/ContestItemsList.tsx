import React, { useContext } from 'react';
import { Alert } from '@material-ui/lab';
import Card from '@material-ui/core/Card';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

import { ContestItem } from './ContestItem';
import { ItemsStateContext } from './ContestItemsStateProvider';

export interface ContestItemListProps {
  className?: string;
  // items: Item[];
  error?: { message: string };
  // editedItem: null | number;
  // selectedItems: number[];
  // onToggleSelectItem: (i: number) => void;
  // onDeleteItem: (i: number) => void;
  // onToggleItemEdit: (i: number) => void;
  // onItemChange: (i: number, title: string) => void;
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

export const ContestItemsList: React.FC<ContestItemListProps> = ({
  // items,
  error,
  className,
  // editedItem,
  // selectedItems,
  // onToggleSelectItem,
  // onDeleteItem,
  // onToggleItemEdit,
  // onItemChange,
}) => {
  const classes = useStyles();
  const { items } = useContext(ItemsStateContext);

  return (
    <DndProvider backend={HTML5Backend}>
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
                id={id}
                index={i}
                // isEditing={editedItem === i && !selectedItems.includes(id)}
                // isSelected={selectedItems.includes(id)}
                // onChange={(title) => onItemChange(id, title)}
                // onToggleEdit={() => onToggleItemEdit(i)}
                // onSelect={() => onToggleSelectItem(i)}
                // onDeleteClick={() => onDeleteItem(i)}
                img={URL.createObjectURL(image)}
                title={title}
              />
            ))}
          </Card>
        )}
      </div>
    </DndProvider>
  );
};

ContestItemsList.displayName = 'ContestItemsList';
