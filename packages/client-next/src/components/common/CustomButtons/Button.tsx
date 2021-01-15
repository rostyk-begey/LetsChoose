import React from 'react';
import RouterLink from 'next/link';
import Button, { ButtonProps } from '@material-ui/core/Button';
import makeStyles from '@material-ui/core/styles/makeStyles';
import classNames from 'classnames';

import { getKeyValue } from '../../../utils/functions';

import buttonStyle from '../../../assets/jss/material-kit-react/components/buttonStyle';

interface Props extends Omit<ButtonProps, 'color'> {
  color?:
    | 'transparent'
    | 'disabled'
    | 'simple'
    | 'facebook'
    | 'google'
    | 'github'
    | 'twitter'
    | 'white'
    | 'rose'
    | 'danger'
    | 'warning'
    | 'success'
    | 'info'
    | 'inherit'
    | 'primary'
    | 'secondary'
    | 'default'
    | undefined;
  size?: 'small' | 'medium' | 'large' | undefined;
  className?: string;
  round?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  simple?: boolean;
  block?: boolean;
  link?: boolean;
  justIcon?: boolean;
}

const makeComponentStyles = makeStyles(() => ({
  ...buttonStyle,
}));

const RegularButton: React.FC<Props> = ({
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
  className = '',
  ...rest
}) => {
  const classes = makeComponentStyles();

  const btnClasses = classNames({
    [classes.button]: true,
    [getKeyValue(classes)(size as any)]: size,
    [getKeyValue(classes)(color as any)]: color,
    [classes.round]: round,
    [classes.fullWidth]: fullWidth,
    [classes.disabled]: disabled,
    [classes.simple]: simple,
    [classes.block]: block,
    [classes.link]: link,
    [classes.justIcon]: justIcon,
    [className]: className,
  });

  if (rest.href) {
    return (
      <RouterLink href={rest.href}>
        <Button {...rest} className={btnClasses}>
          {children}
        </Button>
      </RouterLink>
    );
  }

  return (
    <Button {...rest} className={btnClasses}>
      {children}
    </Button>
  );
};

export default RegularButton;
