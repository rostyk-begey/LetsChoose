import React, { CSSProperties } from 'react';
import Box from '@material-ui/core/Box';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { getSubheader } from '@mui-treasury/layout';
import classNames from 'classnames';
import styled from 'styled-components';

import { PRIMARY_SUBHEADER_ID } from './Layout/constants';

interface Props {
  id?: string;
  animated?: boolean;
  height?: number;
  className?: string;
  classes?: { root?: string; container?: string };
  style?: CSSProperties;
}

const MuiSubheader = getSubheader(styled);

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: '100%',
    flexShrink: 0,
  },
  container: {
    height: '100%',
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}));

const Subheader: React.FC<Props> = ({
  id = PRIMARY_SUBHEADER_ID,
  classes: { root: rootClassName, container: containerClassName } = {},
  className,
  children,
  height,
  animated,
  style = undefined,
}) => {
  const classes = useStyles();
  return (
    <MuiSubheader
      subheaderId={id}
      style={height ? { ...style, height } : style}
      className={classNames(classes.root, rootClassName, {
        ['animate__animated animate__fadeInDown']: animated,
      })}
    >
      <Box
        px={2}
        py={1}
        className={classNames(classes.container, className, containerClassName)}
      >
        {children}
      </Box>
    </MuiSubheader>
  );
};

export default Subheader;
