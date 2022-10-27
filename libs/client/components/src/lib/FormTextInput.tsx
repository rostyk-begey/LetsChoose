import TextField, { TextFieldProps } from '@mui/material/TextField';
import { useFormContext, RegisterOptions, Controller } from 'react-hook-form';

export interface FormTextInputProps {
  name: string;
  validation?: RegisterOptions;
  fieldProps?: TextFieldProps;
}

export const FormTextInput = ({
  name,
  validation,
  fieldProps = {},
}: FormTextInputProps) => {
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
