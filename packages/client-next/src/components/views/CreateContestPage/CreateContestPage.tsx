import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import jsonToFormData from 'json-form-data';
import { GridList, GridListTile, ListSubheader } from '@material-ui/core';
import CardContent from '@material-ui/core/CardContent';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import { DropzoneArea, DropzoneDialog } from 'material-ui-dropzone';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { useForm, FormProvider } from 'react-hook-form';

import ROUTES from '../../../utils/routes';
import FormTextInput, { FormTextInputProps } from '../../common/FormTextInput';
import Page from '../../common/Page';
import Subheader from '../../common/Subheader';
import { useContestCreate } from '../../../hooks/api/contest';
import ContestItem from './ContestItem';

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

interface Item {
  title: string;
  image: File;
}

const CreateContestPage: React.FC = () => {
  const classes = useStyles();
  const router = useRouter();
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
        const { data: contest } = await createContest(
          jsonToFormData({
            ...contestData,
            thumbnail,
            items,
          } as any) as any,
        );
        await router.push(`${ROUTES.CONTESTS.INDEX}/${contest.id}`);
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
                  <GridList cellHeight={180} cols={3}>
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
