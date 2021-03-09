import React from 'react';
import { GridListTile, GridListTileBar } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import makeStyles from '@material-ui/core/styles/makeStyles';
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import classNames from 'classnames';

import { FormTextInputProps } from '../../common/FormTextInput';

interface Props {
  isEditing: boolean;
  onDeleteClick: () => any;
  onEditChange: (title: string) => any;
  onToggleEdit: () => any;
  img: string;
  title: string;
}

const titleInput: FormTextInputProps = {
  name: 'title',
  validation: {
    required: 'Please enter a title',
  },
  fieldProps: {
    type: 'text',
    label: 'Contest title',
    variant: 'outlined',
  },
};

const useStyles = makeStyles(() => ({
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
  tile: {
    '&:hover $titleBar': {
      opacity: 1,
      visibility: 'visible',
      transform: 'none',
    },
  },
  hidden: {
    opacity: 0,
  },
  transition: {
    transition: 'opacity 0.3s ease',
  },
  titleBar: {
    opacity: 0,
    visibility: 'hidden',
    transition: 'all 0.3s ease',
  },
  titleBarTop: {
    transform: 'translateY(-100%)',
    background:
      'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
      'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
  titleBarBottom: {
    transform: 'translateY(100%)',
    background:
      'linear-gradient(to top, rgba(0,0,0,0.7) 0%, ' +
      'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
  inputContainer: {
    position: 'absolute',
    width: '100%',
    top: 0,
  },
}));

const ContestItem: React.FC<Props> = ({
  isEditing,
  onDeleteClick,
  onEditChange,
  onToggleEdit,
  img,
  title,
  ...props
}) => {
  const classes = useStyles();
  const hidden = (isHidden = false) => {
    return classNames(classes.transition, {
      [classes.hidden]: isHidden,
    });
  };

  return (
    <GridListTile cols={1} className={classes.tile} {...props}>
      <img src={img} alt={title} className={hidden(isEditing)} />
      <Box
        mt={8}
        display="flex"
        justifyContent="center"
        className={classNames(classes.inputContainer, hidden(!isEditing))}
      >
        <TextField
          size="small"
          defaultValue={title}
          onChange={({ target: { value } }) => onEditChange(value)}
          {...titleInput.fieldProps}
        />
      </Box>
      <GridListTileBar
        titlePosition="top"
        className={classNames(classes.titleBar, classes.titleBarTop)}
        actionIcon={
          <IconButton
            aria-label={`delete ${title}`}
            className={classes.icon}
            onClick={onDeleteClick}
          >
            <DeleteIcon />
          </IconButton>
        }
      />
      <GridListTileBar
        title={title}
        className={classNames(classes.titleBar, classes.titleBarBottom)}
        actionIcon={
          <IconButton
            aria-label={`edit ${title}`}
            className={classes.icon}
            onClick={onToggleEdit}
          >
            {!isEditing ? <EditIcon /> : <HighlightOffIcon />}
          </IconButton>
        }
      />
    </GridListTile>
  );
};

export default ContestItem;
