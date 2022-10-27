import { ReactNode } from 'react';
import Box from '@mui/material/Box';
import { Subheader as MuiSubheader } from '@mui-treasury/layout';
import classNames from 'classnames';

export interface SubheaderProps {
  animated?: boolean;
  className?: string;
  children: ReactNode | ReactNode[];
}

export const Subheader = ({
  className,
  children,
  animated,
}: SubheaderProps) => (
  <MuiSubheader
    sx={{
      backgroundColor: 'background.paper',
      flexShrink: 0,
    }}
    className={classNames({
      'animate__animated animate__fadeInDown': animated,
    })}
  >
    <Box
      sx={{
        py: 1,
        px: 2,
        height: '100%',
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
      }}
      className={className}
    >
      {children}
    </Box>
  </MuiSubheader>
);
