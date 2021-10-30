import React, { useContext, useState } from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import classNames from 'classnames';
import { DropzoneDialog } from 'material-ui-dropzone';
import Card from '@material-ui/core/Card';
import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';
import Fab from '@material-ui/core/Fab';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import json2mq from 'json2mq';

import { ItemsStateContext } from './ContestItemsStateProvider';

export interface ContestItemsNavProps {
  className?: string;
  // items: Item[];
  onAddItems: (files: File[]) => void;
  // selectedItems: number[];
  // onSelectAllToggle: () => void;
  // onDeleteSelectedItems: () => void;
}

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(1, 2),
      [theme.breakpoints.down('sm')]: {
        order: 1,
      },
    },
    itemsUploadHeader: {
      [theme.breakpoints.down('md')]: {
        fontSize: '1.2rem',
      },
    },
    buttonRow: {
      display: 'flex',
      alignItems: 'center',
      flexGrow: 1,
    },
    selectAllButton: {
      marginRight: 'auto',
    },
    selectAllButtonLabel: {
      color: theme.palette.text.primary,
    },
    divider: {
      margin: theme.spacing(0, 2),
      height: '30px',
      width: 1.5,
      alignSelf: 'center',
    },
    actionButton: {
      marginLeft: theme.spacing(2),
    },
    actionButtonIcon: {
      marginRight: theme.spacing(0.5),
    },
  }),
);

export const ContestItemsNav: React.FC<ContestItemsNavProps> = ({
  className,
  onAddItems,
  // selectedItems,
  // onSelectAllToggle,
  // onDeleteSelectedItems,
}) => {
  const classes = useStyles();
  const [itemsDialogOpen, setItemsDialogOpen] = useState(false);
  const matchesMinWidth600 = useMediaQuery(
    json2mq({
      minWidth: 600,
    }),
  );
  const {
    items,
    selectedItems,
    addFiles,
    toggleSelectAll,
    deleteSelectedItems,
  } = useContext(ItemsStateContext);

  return (
    <>
      <DropzoneDialog
        filesLimit={100}
        open={itemsDialogOpen}
        onSave={(files) => {
          addFiles(files);
          onAddItems(files);
          setItemsDialogOpen(false);
        }}
        acceptedFiles={['image/jpeg', 'image/png', 'image/bmp']}
        maxFileSize={5000000}
        showAlerts={['error', 'info']}
        onClose={() => setItemsDialogOpen(false)}
        showPreviews
      />
      <Card className={classNames(classes.root, className)}>
        <Typography variant="h5" className={classes.itemsUploadHeader}>
          Items
        </Typography>
        <Divider flexItem orientation="vertical" className={classes.divider} />
        <div className={classes.buttonRow}>
          <FormControlLabel
            classes={{
              root: classes.selectAllButton,
              label: classes.selectAllButtonLabel,
            }}
            disabled={items.length === 0}
            control={
              <Checkbox
                checked={selectedItems.length > 0}
                onChange={toggleSelectAll}
                color="primary"
                indeterminate={
                  !!selectedItems.length && selectedItems.length < items.length
                }
              />
            }
            label={selectedItems.length === 0 ? 'Select All' : 'Unselect'}
          />
          <Fab
            color="primary"
            variant="extended"
            size="small"
            className={classes.actionButton}
            disabled={selectedItems.length === 0}
            onClick={deleteSelectedItems}
          >
            <DeleteForeverIcon fontSize="small" />
          </Fab>
          <Fab
            color="primary"
            variant="extended"
            size="small"
            className={classes.actionButton}
            onClick={() => setItemsDialogOpen(true)}
          >
            <AddCircleIcon
              fontSize="small"
              className={classes.actionButtonIcon}
            />
            Add {matchesMinWidth600 && 'items'}
          </Fab>
        </div>
      </Card>
    </>
  );
};
