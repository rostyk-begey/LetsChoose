import React from 'react';
import { Form } from 'tabler-react';
import { useFormContext } from 'react-hook-form';
import cn from 'classnames';

const FormInput = ({
  type,
  name,
  label,
  placeholder,
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
        placeholder={placeholder}
        ref={register(validation)}
      />
      {error && <span className="invalid-feedback">{error.message}</span>}
    </Form.Group>
  );
};

export default FormInput;
