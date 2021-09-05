import React from 'react';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import { useFormContext, RegisterOptions, Controller } from 'react-hook-form';

export interface FormTextInputProps {
  name: string;
  validation?: RegisterOptions;
  fieldProps?: TextFieldProps;
}

export const FormTextInput: React.FC<FormTextInputProps> = ({
  name,
  validation,
  fieldProps = {},
}) => {
  const {
    formState: {
      errors: { [name]: error = false },
    },
  } = useFormContext();

  return (
    <Controller
      name={name}
      rules={validation}
      render={({ field }) => (
        <TextField
          size="small"
          {...field}
          {...fieldProps}
          error={error}
          helperText={error?.message || fieldProps?.helperText}
        />
      )}
    />
  );
};

export default FormTextInput;
