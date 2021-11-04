import React, { useCallback, useState } from 'react';
import { styled } from '@mui/material/styles';
import { alpha, Backdrop, CircularProgress } from '@mui/material';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';
import jsonToFormData from 'json-form-data';
import Fab from '@mui/material/Fab';
import Card from '@mui/material/Card';
import { DropzoneArea } from 'material-ui-dropzone';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { DefaultValues, useForm, FormProvider } from 'react-hook-form';
import SaveIcon from '@mui/icons-material/Save';
import classNames from 'classnames';

import {
  FormTextInput,
  FormTextInputProps,
  Page,
  Subheader,
} from '@lets-choose/client/components';
import { ContestItemsList } from './ContestItemsList';
import { ContestItemsNav } from './ContestItemsNav';
import useItemsUpload from './useItemsUpload';

const PREFIX = 'EditContestPageTemplate';

const classes = {
  content: `${PREFIX}-content`,
  subheader: `${PREFIX}-subheader`,
  title: `${PREFIX}-title`,
  submitButton: `${PREFIX}-submitButton`,
  grid: `${PREFIX}-grid`,
  equalPaddingCard: `${PREFIX}-equalPaddingCard`,
  contestThumbnailCard: `${PREFIX}-contestThumbnailCard`,
  contestThumbnailCardInner: `${PREFIX}-contestThumbnailCardInner`,
  thumbnailError: `${PREFIX}-thumbnailError`,
  contestTitleCard: `${PREFIX}-contestTitleCard`,
  contestExcerptCard: `${PREFIX}-contestExcerptCard`,
  contestItemsCardActions: `${PREFIX}-contestItemsCardActions`,
  contestItemsCard: `${PREFIX}-contestItemsCard`,
  thumbnailActionButton: `${PREFIX}-thumbnailActionButton`,
  defaultThumbnailHolder: `${PREFIX}-defaultThumbnailHolder`,
  defaultThumbnail: `${PREFIX}-defaultThumbnail`,
  dropzoneHolder: `${PREFIX}-dropzoneHolder`,
  dropzoneRoot: `${PREFIX}-dropzoneRoot`,
  dropzoneTextContainer: `${PREFIX}-dropzoneTextContainer`,
  dropzoneItemImage: `${PREFIX}-dropzoneItemImage`,
  titleInput: `${PREFIX}-titleInput`,
  backdrop: `${PREFIX}-backdrop`,
};

const StyledSubheader = styled(Subheader)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(1),
    alignItems: 'flex-start',
  },

  [`& .${classes.title}`]: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    marginRight: theme.spacing(2),
    marginLeft: 'auto',
    color: theme.palette.text.primary,
    [theme.breakpoints.down('lg')]: {
      fontSize: '1.3rem',
      whiteSpace: 'normal',
    },
    [theme.breakpoints.down('md')]: {
      fontSize: '1rem',
      padding: theme.spacing(0.5),
      marginLeft: 0,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.9rem',
    },
  },

  [`& .${classes.submitButton}`]: {
    marginLeft: 'auto',
  },
}));

const StyledPage = styled(Page)(({ theme }) => ({
  display: 'flex',

  [`& .${classes.content}`]: {
    margin: '0 auto',
  },

  [`& .${classes.grid}`]: {
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
    [theme.breakpoints.down('lg')]: {
      gridGap: theme.spacing(2),
      gridTemplateColumns: '5fr 7fr',
      gridTemplateAreas: `
        "thumbnailCard    titleCard"
        "thumbnailCard    excerptCard"
        "thumbnailCard    ."
        "itemsCard        itemsCard"
        "itemsCardActions itemsCardActions"
      `,
    },
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr',
      '& > *': {
        gridColumn: '1/-1!important',
        gridRow: 'auto!important',
      },
      gridTemplateAreas: 'none!important',
    },
  },

  [`& .${classes.equalPaddingCard}`]: {
    padding: theme.spacing(1),
  },

  [`& .${classes.contestThumbnailCard}`]: {
    gridArea: 'thumbnailCard',
  },

  [`& .${classes.contestThumbnailCardInner}`]: {
    position: 'relative',
  },

  [`& .${classes.thumbnailError}`]: {
    display: 'inline-block',
    margin: `${theme.spacing(0.5)} 14px 0`,
  },

  [`& .${classes.contestTitleCard}`]: {
    gridArea: 'titleCard',
  },

  [`& .${classes.contestExcerptCard}`]: {
    gridArea: 'excerptCard',
  },

  [`& .${classes.contestItemsCardActions}`]: {
    gridArea: 'itemsCardActions',
    [theme.breakpoints.down('md')]: {
      order: 2,
    },
  },

  [`& .${classes.contestItemsCard}`]: {
    gridArea: 'itemsCard',
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1, 2),
    [theme.breakpoints.down('md')]: {
      order: 1,
    },
  },

  [`& .${classes.thumbnailActionButton}`]: {
    position: 'absolute',
    right: theme.spacing(3),
    bottom: theme.spacing(3),
  },

  [`& .${classes.defaultThumbnailHolder}`]: {
    overflow: 'hidden',
    borderRadius: 4,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor:
      theme.palette.mode === 'light'
        ? alpha(theme.palette.common.black, 0.23)
        : alpha(theme.palette.common.white, 0.23),
    '&:hover': {
      borderColor: theme.palette.text.primary,
    },
  },

  [`& .${classes.defaultThumbnail}`]: {
    width: '100%',
    paddingTop: '75%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },

  [`& .${classes.dropzoneHolder}`]: {
    position: 'relative',
  },

  [`& .${classes.dropzoneRoot}`]: {
    position: 'absolute',
    display: 'flex',
    top: 0,
    width: '100%',
    height: '100%',
    minHeight: 'unset',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor:
      theme.palette.mode === 'light'
        ? alpha(theme.palette.common.black, 0.23)
        : alpha(theme.palette.common.white, 0.23),
    '&:hover': {
      borderColor: theme.palette.text.primary,
    },
  },

  [`& .${classes.dropzoneTextContainer}`]: {
    position: 'absolute',
    padding: theme.spacing(0, 1),
  },

  [`& .${classes.dropzoneItemImage}`]: {
    paddingTop: '75%',
    display: 'flex',
    alignItems: 'center',
    '& > img': {
      position: 'absolute',
      display: 'block',
      objectFit: 'cover',
      objectPosition: 'center',
      width: '100%',
      height: 'auto',
    },
  },

  [`& .${classes.titleInput}`]: {
    width: '100%',
    '&:not(:last-child)': {
      marginBottom: theme.spacing(2),
    },
  },

  [`& .${classes.backdrop}`]: {
    zIndex: theme.zIndex.drawer + 100,
    color: theme.palette.common.white,
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
      maxRows: 5,
      minRows: 3,
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

export interface EditContestPageTemplateProps {
  title: string;
  isLoading?: boolean;
  submitButtonText: string;
  onSubmit: (data: any) => any;
  inputsDefaultValues: DefaultValues<FieldValues>;
  defaultThumbnail?: string;
  withItemsUpload?: boolean;
}

const useCustomErrors = <T extends string>() => {
  const [errors, setErrors] = useState<Partial<Record<T, { message: string }>>>(
    {},
  );

  const setError = (name: T, error: { message: string }) => {
    setErrors((errors) => ({
      ...errors,
      [name]: error,
    }));
  };

  const clearError = (name: T) => {
    setErrors((errors) => ({
      ...errors,
      [name]: null,
    }));
  };

  const resetErrors = () => {
    setErrors({});
  };

  return {
    errors,
    setError,
    clearError,
    resetErrors,
  };
};

export const EditContestPageTemplate: React.FC<EditContestPageTemplateProps> =
  ({
    title,
    isLoading = false,
    defaultThumbnail = '',
    submitButtonText,
    onSubmit,
    inputsDefaultValues,
    withItemsUpload,
  }) => {
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [thumbnailSrc, setThumbnailSrc] = useState<string>(defaultThumbnail);

    const [isThumbnailEditing, setIsThumbnailEditing] = useState<boolean>(
      !defaultThumbnail,
    );

    const form = useForm<FieldValues>({
      defaultValues: inputsDefaultValues,
    });
    const { errors, setError, clearError } = useCustomErrors<
      'thumbnail' | 'items'
    >();

    const {
      items,
      editedItem,
      selectedItems,
      addFiles,
      deleteItem,
      deleteSelectedItems,
      toggleSelectItem,
      toggleEditItem,
      updateItem,
      toggleSelectAll,
    } = useItemsUpload();

    const handleSubmit = useCallback(
      (contestData) => {
        if (isLoading) return;

        if (!thumbnail && !defaultThumbnail) {
          setError('thumbnail', { message: 'Please add thumbnail' });
          return;
        }
        if (withItemsUpload && items.length < 2) {
          setError('items', { message: 'Please add at least 2 items' });
          return;
        }

        onSubmit(
          jsonToFormData({
            ...contestData,
            thumbnail,
            items,
          } as any),
        );
      },
      [
        isLoading,
        thumbnail,
        defaultThumbnail,
        withItemsUpload,
        items,
        onSubmit,
        setError,
      ],
    );

    return (
      <StyledPage
        subHeader={
          <StyledSubheader>
            <Typography variant="h4" className={classes.title}>
              {title}
            </Typography>
            <Button
              color="primary"
              variant="contained"
              onClick={form.handleSubmit(handleSubmit)}
              disabled={isLoading}
              className={classes.submitButton}
              startIcon={<SaveIcon />}
            >
              {submitButtonText}
            </Button>
          </StyledSubheader>
        }
      >
        <Backdrop open={isLoading} className={classes.backdrop}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <FormProvider {...form}>
          <Container className={classes.content}>
            <div className={classes.grid}>
              <Card
                className={classNames(
                  classes.contestThumbnailCard,
                  classes.dropzoneHolder,
                  classes.equalPaddingCard,
                )}
              >
                <div className={classes.contestThumbnailCardInner}>
                  <div className={classes.defaultThumbnailHolder}>
                    <div
                      className={classes.defaultThumbnail}
                      style={{ backgroundImage: `url(${defaultThumbnail})` }}
                    />
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
                      onChange={([thumbnail]) => {
                        setThumbnail(thumbnail);
                        thumbnail &&
                          setThumbnailSrc(URL.createObjectURL(thumbnail));
                        clearError('thumbnail');
                      }}
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
                  {errors?.thumbnail && (
                    <Typography
                      variant="caption"
                      color="error"
                      className={classes.thumbnailError}
                    >
                      {errors?.thumbnail?.message}
                    </Typography>
                  )}
                </div>
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
              {withItemsUpload && (
                <>
                  <ContestItemsNav
                    className={classes.contestItemsCard}
                    onSelectAllToggle={toggleSelectAll}
                    items={items}
                    onAddItems={(files) => {
                      addFiles(files);
                      clearError('items');
                    }}
                    selectedItems={selectedItems}
                    onDeleteSelectedItems={deleteSelectedItems}
                  />
                  <ContestItemsList
                    className={classes.contestItemsCardActions}
                    error={errors?.items}
                    items={items}
                    editedItem={editedItem}
                    selectedItems={selectedItems}
                    onItemChange={updateItem}
                    onToggleItemEdit={toggleEditItem}
                    onToggleSelectItem={toggleSelectItem}
                    onDeleteItem={deleteItem}
                  />
                </>
              )}
            </div>
          </Container>
        </FormProvider>
      </StyledPage>
    );
  };
