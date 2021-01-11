import React, { forwardRef } from 'react';
import Button from '@material-ui/core/Button';
import makeStyles from '@material-ui/core/styles/makeStyles';
import classNames from 'classnames';

import { getKeyValue } from '../../utils/functions';

import buttonStyle from '../../assets/jss/material-kit-react/components/buttonStyle';

const makeComponentStyles = makeStyles(() => ({
  ...buttonStyle,
}));

const RegularButton = forwardRef((props: any, ref) => {
  const {
    color,
    round,
    children,
    fullWidth,
    disabled,
    simple,
    size,
    block,
    link,
    justIcon,
    className,
    ...rest
  } = props;

  const classes = makeComponentStyles();

  const btnClasses = classNames({
    [classes.button]: true,
    [getKeyValue(classes)(size)]: size,
    [getKeyValue(classes)(color)]: color,
    [classes.round]: round,
    [classes.fullWidth]: fullWidth,
    [classes.disabled]: disabled,
    [classes.simple]: simple,
    [classes.block]: block,
    [classes.link]: link,
    [classes.justIcon]: justIcon,
    [className]: className,
  });
  return (
    <Button {...rest} ref={ref} className={btnClasses}>
      {children}
    </Button>
  );
});

export default RegularButton;
