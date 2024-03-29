import CircularProgress, {
  CircularProgressProps,
} from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export interface CircularProgressWithLabelProps extends CircularProgressProps {
  value: number;
}

export const CircularProgressWithLabel = (
  props: CircularProgressWithLabelProps,
) => (
  <Box position="relative" display="inline-flex">
    <CircularProgress variant="determinate" {...props} />
    <Box
      top={0}
      left={0}
      bottom={0}
      right={0}
      position="absolute"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Typography
        variant="caption"
        component="div"
        color="textSecondary"
      >{`${Math.round(props.value)}%`}</Typography>
    </Box>
  </Box>
);
