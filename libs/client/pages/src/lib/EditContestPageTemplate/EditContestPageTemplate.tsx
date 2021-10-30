import React, { useCallback, useState } from 'react';
import { Backdrop, CircularProgress } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { Theme } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import ClearIcon from '@material-ui/icons/Clear';
import jsonToFormData from 'json-form-data';
import Fab from '@material-ui/core/Fab';
import Card from '@material-ui/core/Card';
import { DropzoneArea } from 'material-ui-dropzone';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { DefaultValues, useForm, FormProvider } from 'react-hook-form';
import SaveIcon from '@material-ui/icons/Save';
import classNames from 'classnames';

import {
  FormTextInput,
  FormTextInputProps,
  Page,
  Subheader,
} from '@lets-choose/client/components';
import { ContestItemsList } from './ContestItemsList';
import { ContestItemsNav } from './ContestItemsNav';
import { ItemsStateContext, useItemsState } from './ContestItemsStateProvider';

const useStyles = makeStyles<Theme>((theme) => ({
  root: {
    display: 'flex',
  },
  content: {
    margin: '0 auto',
  },
  subheader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1),
      alignItems: 'flex-start',
    },
  },
  title: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    marginRight: theme.spacing(2),
    marginLeft: 'auto',
    color: theme.palette.text.primary,
    [theme.breakpoints.down('md')]: {
      fontSize: '1.3rem',
      whiteSpace: 'normal',
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '1rem',
      padding: theme.spacing(0.5),
      marginLeft: 0,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '0.9rem',
    },
  },
  submitButton: {
    marginLeft: 'auto',
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
    [theme.breakpoints.down('xs')]: {
      gridTemplateColumns: '1fr',
      '& > *': {
        gridColumn: '1/-1!important',
        gridRow: 'auto!important',
      },
      gridTemplateAreas: 'none!important',
    },
  },
  equalPaddingCard: {
    padding: theme.spacing(1),
  },
  contestThumbnailCard: {
    gridArea: 'thumbnailCard',
  },
  contestThumbnailCardInner: {
    position: 'relative',
  },
  thumbnailError: {
    display: 'inline-block',
    margin: `${theme.spacing(0.5)}px 14px 0`,
  },
  contestTitleCard: {
    gridArea: 'titleCard',
  },
  contestExcerptCard: {
    gridArea: 'excerptCard',
  },
  contestItemsCardActions: {
    gridArea: 'itemsCardActions',
    [theme.breakpoints.down('sm')]: {
      order: 2,
    },
  },
  contestItemsCard: {
    gridArea: 'itemsCard',
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1, 2),
    [theme.breakpoints.down('sm')]: {
      order: 1,
    },
  },
  thumbnailActionButton: {
    position: 'absolute',
    right: theme.spacing(3),
    bottom: theme.spacing(3),
  },
  defaultThumbnailHolder: {
    overflow: 'hidden',
    borderRadius: 4,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor:
      theme.palette.type === 'light'
        ? 'rgba(0, 0, 0, 0.23)'
        : 'rgba(255, 255, 255, 0.23)',
    '&:hover': {
      borderColor: theme.palette.text.primary,
    },
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
      theme.palette.type === 'light'
        ? 'rgba(0, 0, 0, 0.23)'
        : 'rgba(255, 255, 255, 0.23)',
    '&:hover': {
      borderColor: theme.palette.text.primary,
    },
  },
  dropzoneTextContainer: {
    position: 'absolute',
    padding: theme.spacing(0, 1),
  },
  dropzoneItemImage: {
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
  titleInput: {
    width: '100%',
    '&:not(:last-child)': {
      marginBottom: theme.spacing(2),
    },
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 100,
    color: '#fff',
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
    const classes = useStyles({ defaultThumbnail: thumbnailSrc });
    const [isThumbnailEditing, setIsThumbnailEditing] = useState<boolean>(
      !defaultThumbnail,
    );

    const form = useForm<FieldValues>({
      defaultValues: inputsDefaultValues,
    });
    const { errors, setError, clearError } = useCustomErrors<
      'thumbnail' | 'items'
    >();

    const itemsState = useItemsState();
    const { items } = itemsState;

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
              onClick={form.handleSubmit(handleSubmit)}
              disabled={isLoading}
              className={classes.submitButton}
              startIcon={<SaveIcon />}
            >
              {submitButtonText}
            </Button>
          </Subheader>
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
              <ItemsStateContext.Provider value={itemsState}>
                {withItemsUpload && (
                  <>
                    <ContestItemsNav
                      className={classes.contestItemsCard}
                      onAddItems={(files) => {
                        clearError('items');
                      }}
                    />
                    <ContestItemsList
                      className={classes.contestItemsCardActions}
                      error={errors?.items}
                    />
                  </>
                )}
              </ItemsStateContext.Provider>
            </div>
          </Container>
        </FormProvider>
      </Page>
    );
  };
