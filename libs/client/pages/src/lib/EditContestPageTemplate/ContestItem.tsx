import React, {
  ChangeEventHandler,
  memo,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import { FormTextInputProps } from '@lets-choose/client/components';
import Box from '@material-ui/core/Box';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import makeStyles from '@material-ui/core/styles/makeStyles';
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import classNames from 'classnames';
import { DropTargetMonitor, useDrag, useDrop, XYCoord } from 'react-dnd';
import { ItemsStateContext } from './ContestItemsStateProvider';

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

const tileBarActive: any = {
  opacity: 1,
  visibility: 'visible',
  transform: 'none',
};

interface StyleProps {
  isSelected: boolean;
}

const useStyles = makeStyles((theme) => ({
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
  tile: {
    paddingTop: '75%',
    position: 'relative',
    '&:hover $titleBar': tileBarActive,
    overflow: 'hidden',
    cursor: 'move',
  },
  tileImage: () => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
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

enum DndTypes {
  ContestItem = 'ContestItem',
}

interface DragItem {
  index: number;
  id: number;
  type: string;
}

export const ContestItem: React.FC<ContestItemProps> = memo(
  ({ id, img: image, title, index }) => {
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
    const classes = useStyles({ isSelected });
    const hidden = (isHidden = false) => {
      return classNames(classes.transition, {
        [classes.hidden]: isHidden,
      });
    };
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
      toggleEditedItem(id);
    };

    return (
      <div ref={ref} className={classes.tile} style={containerStyle}>
        <Skeleton
          animation="wave"
          className={classes.tileImage}
          variant="rect"
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
            className={classNames(
              classes.inputContainer,
              hidden(!isEditing || isDragging),
            )}
          >
            <TextField
              size="small"
              defaultValue={title}
              onChange={handleTitleChange}
              {...titleInput.fieldProps}
            />
          </Box>
        )}
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
                    onChange={handleSelect}
                  />
                }
                label={!isSelected ? 'Select' : 'Unselect'}
              />
            )
          }
          className={classNames(
            classes.titleBar,
            classes.titleBarTop,
            hidden(isDragging),
          )}
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
              >
                <DeleteIcon />
              </IconButton>
            )
          }
        />
        <GridListTileBar
          title={title}
          className={classNames(
            classes.titleBar,
            classes.titleBarBottom,
            hidden(isDragging),
          )}
          actionIcon={
            !isSelected && (
              <IconButton
                aria-label={`edit ${title}`}
                className={classes.icon}
                onClick={handleToggleEdit}
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
      prevProps.id === nextProps.id &&
      prevProps.title === nextProps.title &&
      prevProps.img === nextProps.img
    );
  },
);

ContestItem.displayName = 'ContestItem';
