import React from 'react';
import { useForm } from 'react-hook-form';
import { Button, Card, Form } from 'tabler-react';
import cn from 'classnames';

import './index.scss';

const AuthForm = ({
  onSubmit,
  inputs,
  title,
  buttonText = 'Submit',
  buttonLoading = false,
  formAfter = '',
}) => {
  const { register, handleSubmit, errors } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  return (
    <Form
      className="card"
      onSubmit={handleSubmit(onSubmit)}
      errors={errors}
      method="POST"
      title="Register new account"
    >
      <Card.Body className="p-6">
        <Card.Title RootComponent="div">{title}</Card.Title>
        {inputs.map(({ type, name, label, placeholder, validation }, i) => (
          <Form.Group key={label} label={label}>
            <input
              className={cn('form-control', { 'is-invalid': errors[name] })}
              tabIndex={i}
              name={name}
              type={type}
              placeholder={placeholder}
              ref={register(validation)}
            />
            {errors[name] && (
              <span className="invalid-feedback">{errors[name].message}</span>
            )}
          </Form.Group>
        ))}
        <Form.Footer>
          <Button
            type="submit"
            color="primary"
            disabled={Object.keys(errors).length || buttonLoading}
            loading={buttonLoading}
            block
          >
            {buttonText}
          </Button>
          {formAfter}
        </Form.Footer>
      </Card.Body>
    </Form>
  );
};

export default AuthForm;
