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
  container: {
    height: 'calc(100% - 1px)',
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
    backgroundColor: theme.palette.background.default,
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
      className={classNames({
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
