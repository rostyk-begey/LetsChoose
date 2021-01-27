import React from 'react';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { getSubheader } from '@mui-treasury/layout';
import styled from 'styled-components';
import classNames from 'classnames';

interface Props {
  className?: string;
}

export const subheaderId = 'subheader';

const MuiSubheader = getSubheader(styled);

const useStyles = makeStyles((theme) => ({
  subheader: {
    backgroundColor: theme.palette.background.default,
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  },
  container: {
    height: 'calc(100% - 1px)',
  },
}));

const Subheader: React.FC<Props> = ({ className, children }) => {
  const classes = useStyles();
  return (
    <MuiSubheader
      subheaderId={subheaderId}
      className={classNames(
        classes.subheader,
        'animate__animated animate__fadeInDown',
      )}
    >
      <Box px={2} py={1} className={classNames(classes.container, className)}>
        {children}
      </Box>
    </MuiSubheader>
  );
};

export default Subheader;
