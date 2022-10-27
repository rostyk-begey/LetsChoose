import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { alpha, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { DropzoneState } from 'react-dropzone';

export interface DropzoneProps {
  dropzoneState: DropzoneState;
  previewImage?: string;
}

const PREFIX = 'Dropzone';

const classes = {
  uploadText: `${PREFIX}-uploadText`,
  previewBox: `${PREFIX}-previewBox`,
};

const Root = styled(Box)<{ withPreview?: boolean }>(
  ({ theme, withPreview }) => ({
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

    [`& > .${classes.previewBox}`]: {
      position: 'relative',
      aspectRatio: '4/3',
      // pt: '75%',
      // backgroundColor: theme.palette.grey[300],
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      transition: theme.transitions.create('all', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.shorter,
      }),
      zIndex: 1,
      opacity: withPreview ? 1 : 0,

      '&:hover': {
        opacity: 0.4,

        [`& + .${classes.uploadText}`]: {
          backgroundColor: theme.palette.grey[100],
        },
      },
    },

    [`& > .${classes.uploadText}`]: {
      position: 'absolute',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      transform: 'translate(-50%, -50%)',
      top: '50%',
      left: '50%',
      width: '100%',
      height: '100%',
      ...(!withPreview && {
        backgroundColor: theme.palette.grey[300],
      }),
      '&:hover': {
        backgroundColor: theme.palette.grey[100],
      },
      transition: theme.transitions.create('all', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.short,
      }),
    },
  }),
);

export const Dropzone = ({ dropzoneState, previewImage }: DropzoneProps) => (
  <Root {...dropzoneState.getRootProps()} withPreview={!!previewImage}>
    <input {...dropzoneState.getInputProps()} />
    <Box
      className={classes.previewBox}
      style={
        previewImage ? { backgroundImage: `url(${previewImage})` } : undefined
      }
    />
    <Box className={classes.uploadText}>
      <FileUploadOutlinedIcon />
      <Typography variant="h5" textAlign="center">
        Upload
      </Typography>
    </Box>
  </Root>
);
