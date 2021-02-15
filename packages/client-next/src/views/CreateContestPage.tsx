import React, { useCallback, useState } from 'react';
import jsonToFormData from 'json-form-data';
import TextField from '@material-ui/core/TextField';
import {
  GridList,
  GridListTile,
  GridListTileBar,
  ListSubheader,
} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import DeleteIcon from '@material-ui/icons/Delete';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import { DropzoneArea, DropzoneDialog } from 'material-ui-dropzone';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { useRouter } from 'next/router';
import { useForm, FormProvider } from 'react-hook-form';
import classNames from 'classnames';

import FormTextInput, {
  FormTextInputProps,
} from '../components/common/FormTextInput';
import Page from '../components/common/Page';
import Subheader from '../components/common/Subheader';
import { useContestCreate } from '../hooks/api/contest';

const useStyles = makeStyles((theme) => ({
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
  },
  gridList: {
    // width: 500,
    // height: 450,
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
  },
}));

const useStyles1 = makeStyles(() => ({
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
  content: {
    width: '100%',
  },
  hidden: {
    opacity: 0,
    // visibility: 'hidden',
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
    validation: {
      required: 'Please enter an excerpt',
    },
    fieldProps: {
      type: 'text',
      label: 'Contest excerpt',
      variant: 'outlined',
    },
  },
};

interface Props {
  isEditing: boolean;
  onDeleteClick: () => any;
  onEditChange: (title: string) => any;
  onToggleEdit: () => any;
  img: string;
  title: string;
}

interface Item {
  title: string;
  image: File;
}

const ContestItem: React.FC<Props> = ({
  isEditing,
  onDeleteClick,
  onEditChange,
  onToggleEdit,
  img,
  title,
  ...props
}) => {
  const classes = useStyles1();
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
        {/*<FormTextInput {...inputs.title} />*/}
        <TextField
          size="small"
          // name={name}
          defaultValue={title}
          onChange={({ target: { value } }) => onEditChange(value)}
          {...inputs.title.fieldProps}
          // helperText={error?.message || fieldProps?.helperText}
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

const CreateContestPage: React.FC = () => {
  const classes = useStyles();
  const { mutateAsync: createContest } = useContestCreate();
  const [itemsDialogOpen, setItemsDialogOpen] = useState(false);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [editedItem, setEditedItem] = useState<number>(-1);

  const form = useForm({
    defaultValues: {
      title: '',
      excerpt: '',
    },
  });
  const router = useRouter();
  // useWarnIfUnsavedChanges(!isLoading && !!game && !game.finished);
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
  const saveContest = useCallback(
    async (contestData) => {
      try {
        await createContest(
          jsonToFormData({
            ...contestData,
            thumbnail,
            items,
          } as any) as any,
        );
        // history.push(ROUTES.HOME);
      } catch (e) {
        console.log(e);
      }
    },
    [thumbnail, items],
  );

  return (
    <Page
      className={classes.root}
      subHeader={
        <Subheader className={classes.subheader}>
          <Typography variant="h3" className={classes.title}>
            Create contest
          </Typography>
          <Button
            color="primary"
            variant="contained"
            onClick={form.handleSubmit(saveContest)}
          >
            Create
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
            onClose={() => setItemsDialogOpen(false)}
          />
          <Grid container spacing={5}>
            <Grid item md={4} xs={12}>
              <Card>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
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
                        useChipsForPreview={false}
                        onChange={([thumbnail]) => setThumbnail(thumbnail)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormTextInput
                        {...inputs.title}
                        fieldProps={{
                          ...inputs.title.fieldProps,
                          className: classes.titleInput,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormTextInput
                        {...inputs.excerpt}
                        fieldProps={{
                          ...inputs.excerpt.fieldProps,
                          className: classes.titleInput,
                        }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid item md={8} xs={12}>
              <Card>
                <CardContent>
                  <GridList
                    cellHeight={180}
                    cols={3}
                    className={classes.gridList}
                  >
                    <GridListTile
                      key="Subheader"
                      cols={3}
                      style={{ height: 'auto' }}
                    >
                      <ListSubheader component="div">Items</ListSubheader>
                      <Button
                        color="primary"
                        variant="contained"
                        onClick={() => setItemsDialogOpen(true)}
                      >
                        Add items
                      </Button>
                    </GridListTile>

                    {items.map(({ title, image }, i) => (
                      <ContestItem
                        key={i}
                        isEditing={editedItem === i}
                        onEditChange={(title) =>
                          setItems((prevFiles) => {
                            prevFiles[i].title = title;
                            return [...prevFiles];
                          })
                        }
                        onToggleEdit={() =>
                          setEditedItem((active) => (active === i ? -1 : i))
                        }
                        onDeleteClick={deleteItem(i)}
                        img={URL.createObjectURL(image)}
                        title={title}
                      />
                    ))}
                  </GridList>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </FormProvider>
    </Page>
  );
};

export default CreateContestPage;
