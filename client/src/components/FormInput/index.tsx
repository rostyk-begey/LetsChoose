import React from 'react';
// @ts-ignore
import { Form } from 'tabler-react';
import { useFormContext } from 'react-hook-form';
import cn from 'classnames';

interface Props {
  type: string;
  name: string;
  label: string;
  placeholder: string;
  defaultValue?: string;
  validation: any;
  wrapperClassName?: string;
  className?: string;
}

const FormInput: React.FC<Props> = ({
  type,
  name,
  label,
  placeholder,
  defaultValue,
  validation,
  wrapperClassName = '',
  className = '',
}) => {
  const {
    errors: { [name]: error = false },
    register,
  } = useFormContext();
  const Input = type === 'textarea' ? 'textarea' : 'input';

  return (
    <Form.Group label={label} className={wrapperClassName}>
      <Input
        className={cn('form-control', className, { 'is-invalid': error })}
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        // @ts-ignore
        ref={register(validation)}
      />
      {error && <span className="invalid-feedback">{error.message}</span>}
    </Form.Group>
  );
};

export default FormInput;
