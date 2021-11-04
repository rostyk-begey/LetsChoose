import React from 'react';
import { Theme } from '@mui/material';
import { SxProps } from '@mui/system';
import Box from '@mui/material/Box';
import { Subheader as MuiSubheader } from '@mui-treasury/layout';
import classNames from 'classnames';

export interface SubheaderProps {
  animated?: boolean;
  className?: string;
  sx?: SxProps<Theme>;
}

export const Subheader: React.FC<SubheaderProps> = ({
  className,
  children,
  animated,
  sx,
}) => (
  <MuiSubheader
    sx={{
      backgroundColor: 'background.paper',
      flexShrink: 0,
      ...sx,
    }}
    className={classNames({
      'animate__animated animate__fadeInDown': animated,
    })}
  >
    <Box
      sx={{
        py: 1,
        px: 0,
        height: '100%',
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
      }}
      className={className}
    >
      {children}
    </Box>
  </MuiSubheader>
);
