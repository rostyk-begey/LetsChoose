import React from 'react';
import Box from '@material-ui/core/Box';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { getSubheader } from '@mui-treasury/layout';
import classNames from 'classnames';
import styled from 'styled-components';

import { PRIMARY_SUBHEADER_ID } from '../../utils/constants';

interface Props {
  id?: string;
  animated?: boolean;
  height?: number;
  className?: string;
}

const MuiSubheader = getSubheader(styled);

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
  container: {
    height: '100%',
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}));

const Subheader: React.FC<Props> = ({
  id = PRIMARY_SUBHEADER_ID,
  className,
  children,
  height,
  animated,
}) => {
  const classes = useStyles();
  return (
    <MuiSubheader
      subheaderId={id}
      style={height ? { height } : undefined}
      className={classNames(classes.root, {
        ['animate__animated animate__fadeInDown']: animated,
      })}
    >
      <Box px={2} py={1} className={classNames(classes.container, className)}>
        {children}
      </Box>
    </MuiSubheader>
  );
};

export default Subheader;
