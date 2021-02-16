import React, { useState } from 'react';
import { InputAdornment } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import FormTextInput, { FormTextInputProps } from './FormTextInput';

const PasswordTextInput: React.FC<FormTextInputProps> = ({
  fieldProps,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const handleClickShowPassword = () => {
    setShowPassword((value) => !value);
  };
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  return (
    <FormTextInput
      {...{
        ...props,
        fieldProps: {
          ...fieldProps,
          type: showPassword ? 'text' : 'password',
          InputProps: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          },
        },
      }}
    />
  );
};

export default PasswordTextInput;
