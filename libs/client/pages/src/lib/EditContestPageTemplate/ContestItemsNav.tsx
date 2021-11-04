import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { DropzoneDialog } from 'material-ui-dropzone';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Fab from '@mui/material/Fab';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import json2mq from 'json2mq';

import { Item } from './useItemsUpload';

const PREFIX = 'ContestItemsNav';

const classes = {
  itemsUploadHeader: `${PREFIX}-itemsUploadHeader`,
  buttonRow: `${PREFIX}-buttonRow`,
  selectAllButton: `${PREFIX}-selectAllButton`,
  selectAllButtonLabel: `${PREFIX}-selectAllButtonLabel`,
  divider: `${PREFIX}-divider`,
  actionButton: `${PREFIX}-actionButton`,
  actionButtonIcon: `${PREFIX}-actionButtonIcon`,
};

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1, 2),
  [theme.breakpoints.down('md')]: {
    order: 1,
  },

  [`& .${classes.itemsUploadHeader}`]: {
    [theme.breakpoints.down('lg')]: {
      fontSize: '1.2rem',
    },
  },

  [`& .${classes.buttonRow}`]: {
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1,
  },

  [`& .${classes.selectAllButton}`]: {
    marginRight: 'auto',
  },

  [`& .${classes.selectAllButtonLabel}`]: {
    color: theme.palette.text.primary,
  },

  [`& .${classes.divider}`]: {
    margin: theme.spacing(0, 2),
    height: '30px',
    width: 1.5,
    alignSelf: 'center',
  },

  [`& .${classes.actionButton}`]: {
    marginLeft: theme.spacing(2),
  },

  [`& .${classes.actionButtonIcon}`]: {
    marginRight: theme.spacing(0.5),
  },
}));

export interface ContestItemsNavProps {
  className?: string;
  items: Item[];
  onAddItems: (files: File[]) => void;
  selectedItems: number[];
  onSelectAllToggle: () => void;
  onDeleteSelectedItems: () => void;
}

export const ContestItemsNav: React.FC<ContestItemsNavProps> = ({
  items,
  className,
  onAddItems,
  selectedItems,
  onSelectAllToggle,
  onDeleteSelectedItems,
}) => {
  const [itemsDialogOpen, setItemsDialogOpen] = useState(false);
  const matchesMinWidth600 = useMediaQuery(
    json2mq({
      minWidth: 600,
    }),
  );

  return (
    <>
      <DropzoneDialog
        filesLimit={100}
        open={itemsDialogOpen}
        onSave={(files) => {
          onAddItems(files);
          setItemsDialogOpen(false);
        }}
        acceptedFiles={['image/jpeg', 'image/png', 'image/bmp']}
        maxFileSize={5000000}
        showAlerts={['error', 'info']}
        onClose={() => setItemsDialogOpen(false)}
        showPreviews
      />
      <StyledCard className={className}>
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
                onChange={onSelectAllToggle}
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
            onClick={onDeleteSelectedItems}
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
      </StyledCard>
    </>
  );
};
