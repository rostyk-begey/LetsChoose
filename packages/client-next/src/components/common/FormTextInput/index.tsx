import React from 'react';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import { useFormContext, RegisterOptions, Controller } from 'react-hook-form';

export interface FormTextInputProps {
  name: string;
  validation?: RegisterOptions;
  fieldProps?: TextFieldProps;
}

const FormTextInput: React.FC<FormTextInputProps> = ({
  name,
  validation,
  fieldProps,
}) => {
  const {
    errors: { [name]: error = false },
  } = useFormContext();

  return (
    <Controller
      name={name}
      rules={validation}
      render={({ value, onChange }) => (
        <TextField
          size="small"
          name={name}
          defaultValue={value}
          onChange={onChange}
          {...fieldProps}
          error={error}
          helperText={error?.message || fieldProps?.helperText}
        />
      )}
    />
  );
};

export default FormTextInput;
