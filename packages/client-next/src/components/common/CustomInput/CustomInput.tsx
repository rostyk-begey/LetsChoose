import React from 'react';
import FormControl, { FormControlProps } from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import { makeStyles } from '@material-ui/core/styles';
import { InputProps } from '@material-ui/core/Input/Input';
import { InputLabelProps } from '@material-ui/core/InputLabel/InputLabel';
import classNames from 'classnames';

import styles from '../../../assets/jss/material-kit-react/components/customInputStyle';

interface Props {
  formControlProps: FormControlProps;
  labelText?: string;
  id: string;
  labelProps?: InputLabelProps;
  inputProps?: InputProps;
  error?: string;
  white?: string;
  inputRootCustomClasses?: string;
  success?: string;
}

const useStyles = makeStyles(styles);

const CustomInput: React.FC<Props> = ({
  formControlProps,
  labelText,
  id,
  labelProps,
  inputProps,
  error,
  white,
  inputRootCustomClasses = '',
  success,
}) => {
  const classes = useStyles();

  const labelClasses = classNames({
    [' ' + classes.labelRootError]: error,
    [' ' + classes.labelRootSuccess]: success && !error,
  });
  const underlineClasses = classNames({
    [classes.underlineError]: error,
    [classes.underlineSuccess]: success && !error,
    [classes.underline]: true,
    [classes.whiteUnderline]: white,
  });
  const marginTop = classNames({
    [inputRootCustomClasses]: inputRootCustomClasses !== undefined,
  });
  const inputClasses = classNames({
    [classes.input]: true,
    [classes.whiteInput]: white,
  });
  let formControlClasses;
  if (formControlProps !== undefined) {
    formControlClasses = classNames(
      formControlProps.className,
      classes.formControl,
    );
  } else {
    formControlClasses = classes.formControl;
  }
  return (
    <FormControl {...formControlProps} className={formControlClasses}>
      {labelText && (
        <InputLabel
          className={classes.labelRoot + ' ' + labelClasses}
          htmlFor={id}
          {...labelProps}
        >
          {labelText}
        </InputLabel>
      )}
      <Input
        classes={{
          input: inputClasses,
          root: marginTop,
          disabled: classes.disabled,
          underline: underlineClasses,
        }}
        id={id}
        {...inputProps}
      />
    </FormControl>
  );
};

export default CustomInput;
