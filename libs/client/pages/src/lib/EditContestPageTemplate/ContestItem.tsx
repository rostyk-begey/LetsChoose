import React, { memo } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import makeStyles from '@material-ui/core/styles/makeStyles';
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import classNames from 'classnames';

import { FormTextInputProps } from '../../common/FormTextInput';
import ContestItemsList from './ContestItemsList';

interface Props {
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

const useStyles = makeStyles(() => ({
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
  tile: {
    paddingTop: '75%',
    position: 'relative',
    '&:hover $titleBar': tileBarActive,
    transition: 'all 0.3s ease',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  },
  tileImage: ({ image, isEditing }: StyleProps) => ({
    ...(!isEditing && { backgroundImage: `url(${image})` }),
  }),
  hidden: {
    opacity: 0,
  },
  transition: {
    transition: 'opacity 0.3s ease',
  },
  titleBar: ({ isSelected }: StyleProps) => ({
    color: 'white',
    opacity: 0,
    visibility: 'hidden',
    transition: 'all 0.5s ease',
    ...(isSelected && tileBarActive),
  }),
  checkboxLabel: {
    color: 'white',
  },
  checkbox: {
    borderColor: 'white',
  },
  titleBarTitle: {
    overflow: 'visible',
    color: 'white',
  },
  titleBarTop: {
    display: 'flex',
    justifyContent: 'space-between',
    background:
      'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
      'rgba(0,0,0,0.3) 80%, rgba(0,0,0,0) 100%)',
  },
  titleBarBottom: {
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

const ContestItem: React.FC<Props> = memo(
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
  }) => {
    const classes = useStyles({ isSelected, isEditing, image });
    const hidden = (isHidden = false) => {
      return classNames(classes.transition, {
        [classes.hidden]: isHidden,
      });
    };

    return (
      <div className={classNames(classes.tile, classes.tileImage)} {...props}>
        <Box
          mt={8}
          display="flex"
          justifyContent="center"
          className={classNames(classes.inputContainer, hidden(!isEditing))}
        >
          <TextField
            size="small"
            defaultValue={title}
            onChange={({ target: { value } }) => onChange(value)}
            {...titleInput.fieldProps}
          />
        </Box>
        <GridListTileBar
          titlePosition="top"
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
              >
                <DeleteIcon />
              </IconButton>
            )
          }
        />
        <GridListTileBar
          title={title}
          className={classNames(classes.titleBar, classes.titleBarBottom)}
          actionIcon={
            !isSelected && (
              <IconButton
                aria-label={`edit ${title}`}
                className={classes.icon}
                onClick={onToggleEdit}
              >
                {!isEditing ? <EditIcon /> : <HighlightOffIcon />}
              </IconButton>
            )
          }
        />
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.title === nextProps.title &&
      prevProps.isEditing === nextProps.isEditing &&
      prevProps.isSelected === nextProps.isSelected
    );
  },
);

export default ContestItem;
