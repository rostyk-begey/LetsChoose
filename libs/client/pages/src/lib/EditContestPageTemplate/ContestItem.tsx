import { DndTypes } from '@lets-choose/client/utils';
import React, {
  CSSProperties,
  memo,
  useRef,
  useMemo,
  useState,
  useContext,
  ChangeEventHandler,
} from 'react';
import { FormTextInputProps } from '@lets-choose/client/components';
import { alpha } from '@mui/material';
import { styled } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import classNames from 'classnames';
import { DropTargetMonitor, useDrag, useDrop } from 'react-dnd';
import { ItemsStateContext } from './ContestItemsStateProvider';

const PREFIX = 'ContestItem';

export const classes = {
  icon: `${PREFIX}-icon`,
  tile: `${PREFIX}-tile`,
  hidden: `${PREFIX}-hidden`,
  transition: `${PREFIX}-transition`,
  tileImage: `${PREFIX}-tileImage`,
  titleBar: `${PREFIX}-titleBar`,
  checkboxLabel: `${PREFIX}-checkboxLabel`,
  checkbox: `${PREFIX}-checkbox`,
  titleBarTitle: `${PREFIX}-titleBarTitle`,
  titleBarTop: `${PREFIX}-titleBarTop`,
  titleBarBottom: `${PREFIX}-titleBarBottom`,
  inputContainer: `${PREFIX}-inputContainer`,
};

const tileBarActive: CSSProperties = {
  opacity: 1,
  visibility: 'visible',
  transform: 'none',
};

interface StyleProps {
  isSelected?: boolean;
  isDragging?: boolean;
}

export const Root = styled('div', {
  shouldForwardProp: (prop) =>
    !['isSelected', 'isDragging'].includes(prop as string),
})<StyleProps>(({ theme, isSelected, isDragging }) => ({
  display: 'flex',
  alignItems: 'center',
  aspectRatio: '4/3',
  position: 'relative',
  transition: 'all 0.3s ease',
  backgroundColor: alpha(theme.palette.common.white, 0.11),
  cursor: 'move',
  ...(isDragging && { opacity: 0 }),

  [`& .${classes.icon}`]: {
    color: alpha(theme.palette.common.white, 0.54),
  },

  [`& .${classes.hidden}`]: {
    opacity: 0,
  },

  [`& .${classes.transition}`]: {
    transition: 'opacity 0.3s ease',
  },

  [`& .${classes.tileImage}`]: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },

  [`& .${classes.titleBar}`]: {
    color: theme.palette.common.white,
    opacity: 0,
    visibility: 'hidden',
    transition: 'all 0.5s ease',
    ...(isSelected && !isDragging && tileBarActive),
  },

  [`&:hover .${classes.titleBar}`]: {
    ...(!isDragging && tileBarActive),
  },

  [`& .${classes.checkboxLabel}`]: {
    color: theme.palette.common.white,
  },

  [`& .${classes.checkbox}`]: {
    borderColor: theme.palette.common.white,
  },

  [`& .${classes.titleBarTitle}`]: {
    overflow: 'visible',
    color: theme.palette.common.white,
  },

  [`& .${classes.titleBarTop}`]: {
    display: 'flex',
    justifyContent: 'space-between',
    background: `
      linear-gradient(
        to top,
        ${alpha(theme.palette.common.black, 0.3)} 0%, 
        ${alpha(theme.palette.common.black, 0.7)} 70%,
        ${theme.palette.common.black} 100%)`,
  },

  [`& .${classes.titleBarBottom}`]: {
    background: `
      linear-gradient( 
        to bottom,
        ${alpha(theme.palette.common.black, 0.3)} 0%,
        ${alpha(theme.palette.common.black, 0.7)} 70%,
        ${theme.palette.common.black} 100%)`,
  },

  [`& .${classes.inputContainer}`]: {
    position: 'absolute',
    width: '100%',
    top: 0,
  },
}));

export interface ContestItemProps {
  img: string;
  title: string;
  index: number;
  id: number;
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

interface DragItem {
  index: number;
  id: number;
  type: string;
}

export const ContestItem: React.FC<ContestItemProps> = memo(
  ({ id, index, img: image, title }) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLDivElement>(null);
    const {
      swapIds,
      selectedItems,
      editedItem,
      resetEditedItem,
      toggleSelectItem,
      updateItem,
      deleteItem,
      toggleEditedItem,
    } = useContext(ItemsStateContext);
    const [isSkeletonEnabled, setIsSkeletonEnabled] = useState(true);
    const [imageLoaded, setImageLoaded] = useState(false);
    const isSelected = selectedItems.includes(id);
    const isEditing = editedItem === id;
    const [{ isDragging }, connectDrag] = useDrag(
      {
        type: DndTypes.ContestItem,
        item: { id, index },
        collect: (monitor) => ({
          handlerId: monitor.getHandlerId(),
          isDragging: monitor.isDragging(),
        }),
      },
      [id, index],
    );

    const [{ isOver }, connectDrop] = useDrop(
      {
        accept: DndTypes.ContestItem,
        canDrop(item: DragItem, monitor: DropTargetMonitor) {
          if (!rootRef.current) {
            return false;
          }
          const { index: dragIndex, id: dragId } = item;
          const hoverIndex = index;

          // Don't replace items with themselves
          if (dragIndex === hoverIndex) {
            return false;
          }

          // Determine rectangle on screen
          const hoverBoundingRect = rootRef.current?.getBoundingClientRect();
          // Get vertical middle
          const hoverMiddleY =
            (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

          // Get horizontal middle
          const hoverMiddleX =
            (hoverBoundingRect.right - hoverBoundingRect.left) / 2;

          // Determine mouse position
          const { x: clientX = 0, y: clientY = 0 } =
            monitor.getClientOffset() ?? {};

          // Get pixels to the top
          const hoverClientY = clientX - hoverBoundingRect.top;

          // Get pixels to the left
          const hoverClientX = clientY - hoverBoundingRect.left;

          const upwards = dragIndex > hoverIndex && hoverClientY > hoverMiddleY;
          const downwards =
            dragIndex < hoverIndex && hoverClientY < hoverMiddleY;
          const leftwards =
            dragIndex > hoverIndex && hoverClientX > hoverMiddleX;
          const rightwards =
            dragIndex < hoverIndex && hoverClientX < hoverMiddleX;

          if (upwards && (leftwards || rightwards)) {
            return false;
          }

          if (downwards && (leftwards || rightwards)) {
            return false;
          }

          return true;
        },
        drop(item: DragItem) {
          const { id: dragId } = item;
          const hoverIndex = index;

          // Time to actually perform the action
          swapIds(dragId, id);

          // Note: we're mutating the monitor item here!
          // Generally it's better to avoid mutations,
          // but it's good here for the sake of performance
          // to avoid expensive index searches.
          item.index = hoverIndex;
        },
        collect: (monitor) => ({
          isOver: monitor.isOver(),
        }),
      },
      [id, index],
    );

    connectDrag(connectDrop(rootRef));
    const containerStyle = useMemo(() => {
      let opacity = 1;

      if (isDragging) {
        opacity = 0.4;
      } else if (isOver) {
        opacity = 0.6;
      }

      return { opacity };
    }, [isDragging, isOver]);

    const handleSelect = () => toggleSelectItem(id);

    const handleTitleChange: ChangeEventHandler<HTMLInputElement> = ({
      target: { value },
    }) => {
      updateItem(id, value);
    };

    const handleDelete = () => deleteItem(id);

    const handleToggleEdit = () => {
      inputRef.current?.focus();
      toggleEditedItem(id);
    };

    return (
      <Root
        isSelected={isSelected}
        isDragging={isDragging}
        onBlur={resetEditedItem}
        onClick={(event) => event.stopPropagation()}
        onMouseDown={() => setIsSkeletonEnabled(false)}
        onDragEnd={() => setIsSkeletonEnabled(true)}
        ref={rootRef}
        style={containerStyle}
      >
        <Skeleton
          animation="wave"
          variant="rectangular"
          className={classes.tileImage}
          style={{
            display: !isSkeletonEnabled || isDragging ? 'none' : 'block',
            opacity: !isSkeletonEnabled || isDragging || imageLoaded ? 0 : 1,
          }}
        />
        <img
          src={image}
          alt={title}
          className={classes.tileImage}
          onLoad={() => setImageLoaded(true)}
          style={{
            opacity: !isEditing && imageLoaded ? 1 : 0,
          }}
        />
        {isEditing && !isDragging && (
          <Box
            mt={8}
            display="flex"
            justifyContent="center"
            className={classes.inputContainer}
          >
            <TextField
              size="small"
              defaultValue={title}
              ref={inputRef}
              onFocus={(event) => event.stopPropagation()}
              onChange={handleTitleChange}
              {...titleInput.fieldProps}
            />
          </Box>
        )}
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
                    onChange={handleSelect}
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
                onClick={handleDelete}
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
                onClick={handleToggleEdit}
                size="large"
              >
                {!isEditing ? <EditIcon /> : <HighlightOffIcon />}
              </IconButton>
            )
          }
        />
      </Root>
    );
  },
  (prevProps, nextProps) =>
    prevProps.id === nextProps.id &&
    prevProps.title === nextProps.title &&
    prevProps.img === nextProps.img,
);

ContestItem.displayName = 'ContestItem';
