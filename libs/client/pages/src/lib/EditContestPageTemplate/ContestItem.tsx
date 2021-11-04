import React, { memo } from 'react';
import { alpha } from '@mui/material';
import { styled } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import classNames from 'classnames';

import { FormTextInputProps } from '@lets-choose/client/components';

const PREFIX = 'ContestItem';

const classes = {
  icon: `${PREFIX}-icon`,
  tile: `${PREFIX}-tile`,
  hidden: `${PREFIX}-hidden`,
  transition: `${PREFIX}-transition`,
  titleBar: `${PREFIX}-titleBar`,
  checkboxLabel: `${PREFIX}-checkboxLabel`,
  checkbox: `${PREFIX}-checkbox`,
  titleBarTitle: `${PREFIX}-titleBarTitle`,
  titleBarTop: `${PREFIX}-titleBarTop`,
  titleBarBottom: `${PREFIX}-titleBarBottom`,
  inputContainer: `${PREFIX}-inputContainer`,
};

const Root = styled('div')<StyleProps>(
  ({ theme, image, isEditing, isSelected }) => ({
    paddingTop: '75%',
    position: 'relative',
    '&:hover $titleBar': tileBarActive,
    transition: 'all 0.3s ease',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    ...(!isEditing && { backgroundImage: `url(${image})` }),

    [`& .${classes.icon}`]: {
      color: alpha(theme.palette.common.white, 0.54),
    },

    [`& .${classes.hidden}`]: {
      opacity: 0,
    },

    [`& .${classes.transition}`]: {
      transition: 'opacity 0.3s ease',
    },

    [`& .${classes.titleBar}`]: {
      color: 'white',
      opacity: 0,
      visibility: 'hidden',
      transition: 'all 0.5s ease',
      ...(isSelected && tileBarActive),
    },

    [`& .${classes.checkboxLabel}`]: {
      color: 'white',
    },

    [`& .${classes.checkbox}`]: {
      borderColor: 'white',
    },

    [`& .${classes.titleBarTitle}`]: {
      overflow: 'visible',
      color: 'white',
    },

    [`& .${classes.titleBarTop}`]: {
      display: 'flex',
      justifyContent: 'space-between',
      background: `
        linear-gradient(
          to bottom,
          ${alpha(theme.palette.common.black, 0.7)} 0%, 
          ${alpha(theme.palette.common.black, 0.3)} 80%,
          ${theme.palette.common.black} 100%)`,
    },

    [`& .${classes.titleBarBottom}`]: {
      background: `
        linear-gradient(
          to top,
          ${alpha(theme.palette.common.black, 0.7)} 0%,
          ${alpha(theme.palette.common.black, 0.3)} 70%,
          ${theme.palette.common.black} 100%)`,
    },

    [`& .${classes.inputContainer}`]: {
      position: 'absolute',
      width: '100%',
      top: 0,
      opacity: isEditing ? 1 : 0,
    },
  }),
);

export interface ContestItemProps {
  isEditing: boolean;
  isSelected: boolean;
  onDeleteClick: () => void;
  onChange: (title: string) => void;
  onToggleEdit: () => void;
  onSelect: () => void;
  img: string;
  title: string;
  idx: string;
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

const tileBarActive: any = {
  opacity: 1,
  visibility: 'visible',
  transform: 'none',
};

interface StyleProps {
  isSelected: boolean;
  isEditing: boolean;
  image: string;
}

export const ContestItem: React.FC<ContestItemProps> = memo(
  ({
    isEditing,
    isSelected,
    onDeleteClick,
    onChange,
    onToggleEdit,
    onSelect,
    img: image,
    title,
    idx,
    ...props
  }) => (
    <Root
      isEditing={isEditing}
      isSelected={isSelected}
      image={image}
      {...props}
    >
      <Box
        mt={8}
        display="flex"
        justifyContent="center"
        className={classes.inputContainer}
      >
        <TextField
          size="small"
          defaultValue={title}
          onChange={({ target: { value } }) => onChange(value)}
          {...titleInput.fieldProps}
        />
      </Box>
      <ImageListItemBar
        position="top"
        title={
          !isEditing && (
            <FormControlLabel
              className={classes.checkboxLabel}
              control={
                <Checkbox
                  color="primary"
                  className={classes.checkbox}
                  checked={isSelected}
                  onChange={onSelect}
                />
              }
              label={!isSelected ? 'Select' : 'Unselect'}
            />
          )
        }
        className={classNames(classes.titleBar, classes.titleBarTop)}
        classes={{
          title: classes.titleBarTitle,
          titleWrap: classes.titleBarTitle,
        }}
        actionIcon={
          !isSelected && (
            <IconButton
              aria-label={`delete ${title}`}
              className={classes.icon}
              onClick={onDeleteClick}
              size="large"
            >
              <DeleteIcon />
            </IconButton>
          )
        }
      />
      <ImageListItemBar
        title={title}
        className={classNames(classes.titleBar, classes.titleBarBottom)}
        actionIcon={
          !isSelected && (
            <IconButton
              aria-label={`edit ${title}`}
              className={classes.icon}
              onClick={onToggleEdit}
              size="large"
            >
              {!isEditing ? <EditIcon /> : <HighlightOffIcon />}
            </IconButton>
          )
        }
      />
    </Root>
  ),
  (prevProps, nextProps) => {
    return (
      prevProps.title === nextProps.title &&
      prevProps.isEditing === nextProps.isEditing &&
      prevProps.isSelected === nextProps.isSelected
    );
  },
);

ContestItem.displayName = 'ContestItem';
