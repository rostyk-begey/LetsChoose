import React, { useCallback, useMemo, useState } from 'react';
import { alpha, styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import ClearIcon from '@mui/icons-material/Clear';
import jsonToFormData from 'json-form-data';
import Fab from '@mui/material/Fab';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { useDropzone } from 'react-dropzone';
import { DefaultValues, useForm, FormProvider } from 'react-hook-form';
import SaveIcon from '@mui/icons-material/Save';
import { useCustomErrors } from '@lets-choose/client/hooks';
import classNames from 'classnames';
import {
  FormTextInput,
  FormTextInputProps,
  Page,
  Subheader,
  Dropzone,
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
  thumbnailError: `${PREFIX}-thumbnailError`,
  contestTitleCard: `${PREFIX}-contestTitleCard`,
  contestExcerptCard: `${PREFIX}-contestExcerptCard`,
  contestItemsCardActions: `${PREFIX}-contestItemsCardActions`,
  contestItemsCard: `${PREFIX}-contestItemsCard`,
  thumbnailActionButton: `${PREFIX}-thumbnailActionButton`,
  defaultThumbnail: `${PREFIX}-defaultThumbnail`,
  dropzoneHolder: `${PREFIX}-dropzoneHolder`,
  dropzoneRoot: `${PREFIX}-dropzoneRoot`,
  dropzoneTextContainer: `${PREFIX}-dropzoneTextContainer`,
  dropzoneItemImage: `${PREFIX}-dropzoneItemImage`,
  titleInput: `${PREFIX}-titleInput`,
  uploadText: `${PREFIX}-uploadText`,
};

const StyledSubheader = styled(Subheader)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
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
  padding: theme.spacing(3),

  [`& .${classes.grid}`]: {
    maxWidth: 1200,
    margin: '0 auto',
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
      gridTemplateAreas: 'none!important',

      '& > *': {
        gridColumn: '1/-1!important',
        gridRow: 'auto!important',
      },
    },
  },

  [`& .${classes.equalPaddingCard}`]: {
    padding: theme.spacing(1),
  },

  [`& .${classes.contestThumbnailCard}`]: {
    gridArea: 'thumbnailCard',
    position: 'relative',
  },

  // [`& .${classes.contestThumbnailCardInner}`]: {
  //   position: 'relative',
  // },

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

  [`& .${classes.defaultThumbnail}`]: {
    aspectRatio: '4/3',
    cursor: 'pointer',
    position: 'relative',
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
    const { errors, setError, clearError } = useCustomErrors<
      'thumbnail' | 'items'
    >();
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const thumbnailDropzone = useDropzone({
      onDropAccepted: ([file]) => {
        setThumbnail(file);
        clearError('items');
      },
    });
    const itemsDropzone = useDropzone({
      onDropAccepted: addFiles,
    });
    const thumbnailPreview = useMemo(() => {
      return thumbnail ? URL.createObjectURL(thumbnail) : defaultThumbnail;
    }, [thumbnail, defaultThumbnail]);

    const form = useForm<FieldValues>({
      defaultValues: inputsDefaultValues,
    });

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

    const shouldRenderCancelThumbnailButton = defaultThumbnail && thumbnail;

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
        <FormProvider {...form}>
          <div className={classes.grid}>
            <Card
              className={classNames(
                classes.contestThumbnailCard,
                classes.dropzoneHolder,
                classes.equalPaddingCard,
              )}
            >
              <Dropzone
                dropzoneState={thumbnailDropzone}
                previewImage={thumbnailPreview}
              />
              {shouldRenderCancelThumbnailButton && (
                <Fab
                  color="primary"
                  size="small"
                  aria-label="cancel-edit"
                  sx={{
                    position: 'absolute',
                    right: (theme) => theme.spacing(3),
                    bottom: (theme) => theme.spacing(3),
                    zIndex: 1,
                  }}
                  onClick={() => {
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
                  onAddItemsClick={() => itemsDropzone.open()}
                  selectedItems={selectedItems}
                  onDeleteSelectedItems={deleteSelectedItems}
                />
                <ContestItemsList
                  dropzoneState={itemsDropzone}
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
        </FormProvider>
      </StyledPage>
    );
  };
