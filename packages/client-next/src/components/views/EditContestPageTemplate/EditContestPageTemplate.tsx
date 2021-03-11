import Divider from '@material-ui/core/Divider';
import React, { useCallback, useState } from 'react';
import Button from '@material-ui/core/Button';
import { Theme } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import ClearIcon from '@material-ui/icons/Clear';
import Alert from '@material-ui/lab/Alert';
import jsonToFormData from 'json-form-data';
import Checkbox from '@material-ui/core/Checkbox';
import Fab from '@material-ui/core/Fab';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CardContent from '@material-ui/core/CardContent';
import Card from '@material-ui/core/Card';
import { DropzoneArea, DropzoneDialog } from 'material-ui-dropzone';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { useForm, FormProvider } from 'react-hook-form';
import { DefaultValues } from 'react-hook-form/dist/types/form';
import SaveIcon from '@material-ui/icons/Save';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import classNames from 'classnames';

import FormTextInput, { FormTextInputProps } from '../../common/FormTextInput';
import Page from '../../common/Page';
import Subheader from '../../common/Subheader';
import ContestItem from './ContestItem';

const useStyles = makeStyles<Theme>((theme) => ({
  root: {
    display: 'flex',
  },
  content: {
    margin: 'auto',
  },
  subheader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    margin: '0 auto',
    color: theme.palette.text.primary,
  },
  buttonRow: {
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1,
  },
  divider: {
    margin: theme.spacing(0, 2),
    height: '30px',
    width: 1.5,
  },
  grid: {
    display: 'grid',
    alignItems: 'start',
    gridGap: theme.spacing(3),
    gridTemplateColumns: 'minmax(350px, 4fr) 8fr',
    gridTemplateAreas: `
      "thumbnailCard itemsCard"
      "thumbnailCard itemsCardActions"
      "titleCard     itemsCardActions"
      "excerptCard   itemsCardActions"
      "alert         itemsCardActions"
      ".             itemsCardActions"
    `,
    gridAutoRows: 'auto',
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: '5fr 7fr',
      gridTemplateAreas: `
        "thumbnailCard    titleCard"
        "thumbnailCard    excerptCard"
        "thumbnailCard    alert"
        "itemsCard        itemsCard"
        "itemsCardActions itemsCardActions"
      `,
    },
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr',
      gridTemplateAreas: `
        "thumbnailCard"
        "titleCard"
        "excerptCard"
        "alert"
        "itemsCard"
        "itemsCardActions"
      `,
    },
  },
  itemsGrid: {
    display: 'grid',
    gridGap: theme.spacing(1),
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gridAutoRows: 'auto',
  },
  equalPaddingCard: {
    padding: theme.spacing(2),
  },
  contestThumbnailCard: {
    gridArea: 'thumbnailCard',
  },
  contestTitleCard: {
    gridArea: 'titleCard',
  },
  contestExcerptCard: {
    gridArea: 'excerptCard',
  },
  contestItemsCardActions: {
    gridArea: 'itemsCardActions',
  },
  contestItemsCard: {
    gridArea: 'itemsCard',
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1, 2),
  },
  alert: {
    width: '100%',
    gridArea: 'alert',
  },
  selectAllButton: {
    marginRight: 'auto',
  },
  selectAllButtonLabel: {
    color: theme.palette.text.primary,
  },
  thumbnailActionButton: {
    position: 'absolute',
    right: theme.spacing(3),
    bottom: theme.spacing(3),
  },
  actionButton: {
    marginLeft: theme.spacing(2),
  },
  actionButtonIcon: {
    marginRight: theme.spacing(0.5),
  },
  defaultThumbnailHolder: {
    overflow: 'hidden',
    borderRadius: 4,
    border: `4px dashed ${theme.palette.divider}`,
  },
  defaultThumbnail: ({ defaultThumbnail }: { defaultThumbnail?: string }) => ({
    width: '100%',
    paddingTop: '75%',
    backgroundImage: `url(${defaultThumbnail})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }),
  dropzoneHolder: {
    position: 'relative',
  },
  dropzoneRoot: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropzoneTextContainer: {
    position: 'absolute',
    padding: theme.spacing(0, 1),
  },
  dropzoneItemImage: {
    '& > img': {
      width: '100%',
      height: 'auto',
    },
  },
  titleInput: {
    width: '100%',
    ['&:not(:last-child)']: {
      marginBottom: theme.spacing(2),
    },
  },
}));

const inputs: Record<string, FormTextInputProps> = {
  title: {
    name: 'title',
    validation: {
      required: 'Please enter a title',
    },
    fieldProps: {
      type: 'text',
      label: 'Contest title',
      variant: 'outlined',
    },
  },
  excerpt: {
    name: 'excerpt',
    validation: {},
    fieldProps: {
      multiline: true,
      rowsMax: 5,
      rows: 3,
      type: 'text',
      label: 'Contest excerpt',
      variant: 'outlined',
    },
  },
};

interface FieldValues {
  title: string;
  excerpt: string;
}

interface Item {
  title: string;
  image: File;
}

interface Props {
  title: string;
  submitButtonText: string;
  onSubmit: (data: any) => any;
  inputsDefaultValues: DefaultValues<FieldValues>;
  defaultThumbnail?: string;
}

const EditContestPageTemplate: React.FC<Props> = ({
  title,
  defaultThumbnail,
  submitButtonText,
  onSubmit,
  inputsDefaultValues,
}) => {
  const classes = useStyles({ defaultThumbnail });
  const [itemsDialogOpen, setItemsDialogOpen] = useState(false);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [editedItem, setEditedItem] = useState<number>(-1);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isThumbnailEditing, setIsThumbnailEditing] = useState<boolean>(
    !defaultThumbnail,
  );

  const form = useForm<FieldValues>({
    defaultValues: inputsDefaultValues,
  });
  const addFiles = (files) => {
    setItems((prevFiles) => [
      ...prevFiles,
      ...files.map((file) => ({
        title: file.name,
        image: file,
      })),
    ]);
    setItemsDialogOpen(false);
  };
  const deleteItem = (index: number) => () => {
    setItems((files) => {
      files.splice(index, 1);
      return [...files];
    });
  };
  const deleteSelectedItems = useCallback(() => {
    setItems(items.filter((_, i) => !selectedItems.includes(i)));
    setSelectedItems([]);
  }, [items, selectedItems]);
  const toggleSelectItem = (index: number) => () => {
    setSelectedItems((items) => {
      const set = new Set(items);
      if (set.has(index)) {
        set.delete(index);
      } else {
        set.add(index);
      }
      return [...set];
    });
  };
  const onSelectAllToggle = useCallback(() => {
    if (selectedItems.length === 0) {
      setSelectedItems(items.map((_, i) => i));
    } else {
      setSelectedItems([]);
    }
  }, [items, selectedItems]);
  const saveContest = useCallback(
    (contestData) => {
      onSubmit(
        jsonToFormData({
          ...contestData,
          thumbnail,
          items,
        } as any),
      );
    },
    [thumbnail, items],
  );

  return (
    <Page
      className={classes.root}
      subHeader={
        <Subheader className={classes.subheader}>
          <Typography variant="h4" className={classes.title}>
            {title}
          </Typography>
          <Button
            color="primary"
            variant="contained"
            onClick={form.handleSubmit(saveContest)}
            startIcon={<SaveIcon />}
          >
            {submitButtonText}
          </Button>
        </Subheader>
      }
    >
      <FormProvider {...form}>
        <Container className={classes.content}>
          <DropzoneDialog
            filesLimit={100}
            open={itemsDialogOpen}
            onSave={addFiles}
            acceptedFiles={['image/jpeg', 'image/png', 'image/bmp']}
            showPreviews
            maxFileSize={5000000}
            showAlerts={['error', 'info']}
            onClose={() => setItemsDialogOpen(false)}
          />
          <div className={classes.grid}>
            <Card
              className={classNames(
                classes.contestThumbnailCard,
                classes.dropzoneHolder,
                classes.equalPaddingCard,
              )}
            >
              {!isThumbnailEditing && (
                <div className={classes.defaultThumbnailHolder}>
                  <div className={classes.defaultThumbnail} />
                  <Fab
                    color="primary"
                    size="small"
                    aria-label="edit"
                    className={classes.thumbnailActionButton}
                    onClick={() => setIsThumbnailEditing(true)}
                  >
                    <EditIcon />
                  </Fab>
                </div>
              )}
              {isThumbnailEditing && (
                <DropzoneArea
                  classes={{
                    root: classes.dropzoneRoot,
                    textContainer: classes.dropzoneTextContainer,
                  }}
                  filesLimit={1}
                  previewChipProps={{
                    style: {
                      display: 'none',
                    },
                  }}
                  previewGridProps={{
                    item: {
                      xs: 12,
                    },
                  }}
                  previewGridClasses={{
                    item: classes.dropzoneItemImage,
                  }}
                  showPreviewsInDropzone
                  showAlerts={['error', 'info']}
                  useChipsForPreview={false}
                  onChange={([thumbnail]) => setThumbnail(thumbnail)}
                />
              )}
              {defaultThumbnail && isThumbnailEditing && (
                <Fab
                  color="primary"
                  size="small"
                  aria-label="cancel-edit"
                  className={classes.thumbnailActionButton}
                  onClick={() => {
                    setIsThumbnailEditing(false);
                    setThumbnail(null);
                  }}
                >
                  <ClearIcon />
                </Fab>
              )}
            </Card>
            <Card
              className={classNames(
                classes.contestTitleCard,
                classes.equalPaddingCard,
              )}
            >
              <FormTextInput
                {...inputs.title}
                fieldProps={{
                  ...inputs.title.fieldProps,
                  className: classes.titleInput,
                }}
              />
            </Card>
            <Card
              className={classNames(
                classes.contestExcerptCard,
                classes.equalPaddingCard,
              )}
            >
              <FormTextInput
                {...inputs.excerpt}
                fieldProps={{
                  ...inputs.excerpt.fieldProps,
                  className: classes.titleInput,
                }}
              />
            </Card>
            <Card className={classes.contestItemsCard}>
              <Typography variant="h5">Items</Typography>
              <Divider
                flexItem
                orientation="vertical"
                className={classes.divider}
              />
              <div className={classes.buttonRow}>
                <FormControlLabel
                  className={classes.selectAllButton}
                  classes={{
                    label: classes.selectAllButtonLabel,
                  }}
                  disabled={items.length === 0}
                  control={
                    <Checkbox
                      checked={selectedItems.length > 0}
                      onChange={onSelectAllToggle}
                      color="primary"
                      indeterminate={
                        !!selectedItems.length &&
                        selectedItems.length < items.length
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
                  Add items
                </Fab>
              </div>
            </Card>
            {!!items.length && (
              <Card
                className={classNames(
                  classes.contestItemsCardActions,
                  classes.equalPaddingCard,
                  classes.itemsGrid,
                )}
              >
                {items.map(({ title, image }, i) => (
                  <ContestItem
                    key={i + title}
                    isEditing={editedItem === i && !selectedItems.includes(i)}
                    isSelected={selectedItems.includes(i)}
                    onEditChange={(title) =>
                      setItems((prevFiles) => {
                        prevFiles[i].title = title;
                        return [...prevFiles];
                      })
                    }
                    onToggleEdit={() =>
                      setEditedItem((active) => (active === i ? -1 : i))
                    }
                    onSelect={toggleSelectItem(i)}
                    onDeleteClick={deleteItem(i)}
                    img={URL.createObjectURL(image)}
                    title={title}
                  />
                ))}
              </Card>
            )}
            <Alert severity="info" className={classes.alert}>
              This is an info alert — check it out!
            </Alert>
          </div>
        </Container>
      </FormProvider>
    </Page>
  );
};

export default EditContestPageTemplate;
