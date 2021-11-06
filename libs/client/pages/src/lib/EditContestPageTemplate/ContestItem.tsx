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
import { DropTargetMonitor, useDrag, useDrop, XYCoord } from 'react-dnd';
import { ItemsStateContext } from './ContestItemsStateProvider';

const PREFIX = 'ContestItem';

const classes = {
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

const Root = styled('div')<StyleProps>(({ theme, isSelected }) => ({
  paddingTop: '75%',
  position: 'relative',
  transition: 'all 0.3s ease',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  [`&:hover .${classes.titleBar}`]: tileBarActive,

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
    // opacity: isEditing ? 1 : 0,
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

interface StyleProps {
  isSelected: boolean;
  isEditing: boolean;
  image: string;
}

enum DndTypes {
  ContestItem = 'ContestItem',
}

interface DragItem {
  index: number;
  id: number;
  type: string;
}

export const ContestItem: React.FC<ContestItemProps> = memo(
  ({ id, index, img: image, title }) => {
    const inputRef = useRef<HTMLDivElement>(null);
    const {
      swapIds,
      selectedItems,
      editedItem,
      toggleSelectItem,
      updateItem,
      deleteItem,
      toggleEditedItem,
    } = useContext(ItemsStateContext);
    const [imageLoaded, setImageLoaded] = useState(false);
    const isSelected = selectedItems.includes(id);
    const isEditing = editedItem === id;
    const ref = useRef<HTMLDivElement>(null);
    const [{ isDragging, handlerId }, connectDrag, preview] = useDrag(
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

    const [, connectDrop] = useDrop(
      {
        accept: DndTypes.ContestItem,
        hover(item: DragItem, monitor: DropTargetMonitor) {
          if (!ref.current) {
            return;
          }
          const { index: dragIndex, id: dragId } = item;
          const hoverIndex = index;

          // Don't replace items with themselves
          if (dragIndex === hoverIndex) {
            return;
          }

          // Determine rectangle on screen
          const hoverBoundingRect = ref.current?.getBoundingClientRect();

          // Get vertical middle
          const hoverMiddleY =
            (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

          // Determine mouse position
          const clientOffset = monitor.getClientOffset();

          // Get pixels to the top
          const hoverClientY =
            (clientOffset as XYCoord).y - hoverBoundingRect.top;

          // Only perform the move when the mouse has crossed half of the items height
          // When dragging downwards, only move when the cursor is below 50%
          // When dragging upwards, only move when the cursor is above 50%

          // Dragging downwards
          if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
            return;
          }

          // Dragging upwards
          if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
            return;
          }

          // Time to actually perform the action
          moveCard(dragId, id);

          // Note: we're mutating the monitor item here!
          // Generally it's better to avoid mutations,
          // but it's good here for the sake of performance
          // to avoid expensive index searches.
          item.index = hoverIndex;
        },
      },
      [id, index],
    );

    connectDrag(connectDrop(ref));
    const opacity = isDragging ? 0.4 : 1;
    const containerStyle = useMemo(() => ({ opacity }), [opacity]);
    const moveCard = (id1: number, id2: number) => {
      swapIds(id1, id2);
    };

    const handleSelect = () => {
      toggleSelectItem(id);
    };

    const handleTitleChange: ChangeEventHandler<HTMLInputElement> = ({
      target: { value },
    }) => {
      updateItem(id, value);
    };

    const handleDelete = () => {
      deleteItem(id);
    };

    const handleToggleEdit = () => {
      ref.current?.focus();
      toggleEditedItem(id);
    };

    return (
      <Root
        isEditing={isEditing}
        isSelected={isSelected}
        image={image}
        onClick={(event) => event.stopPropagation()}
        style={containerStyle}
      >
        <Skeleton
          animation="wave"
          className={classes.tileImage}
          style={{
            display: isDragging ? 'none' : 'block',
            visibility: isDragging || imageLoaded ? 'hidden' : 'visible',
            opacity: isDragging || imageLoaded ? 0 : 1,
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
  (prevProps, nextProps) => {
    return (
      prevProps.id === nextProps.id &&
      prevProps.title === nextProps.title &&
      prevProps.img === nextProps.img
    );
  },
);

ContestItem.displayName = 'ContestItem';
