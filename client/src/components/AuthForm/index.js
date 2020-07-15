import React, { useState } from 'react';
import { Button, Icon, TextInput } from 'react-materialize';

import './index.scss';

const AuthForm = ({
  className,
  onChange,
  onSubmit,
  inputs,
  submitText,
  submitIcon,
  buttonDisabled = false,
  formAfter = '',
}) => {
  const baseClassName = 'auth-form';

  return (
    <form className={`${baseClassName} ${className} card-panel hoverable`}>
      {inputs.map(({ icon, ...props }, i) => (
        <TextInput
          tabIndex={i}
          key={props.name}
          onChange={onChange}
          icon={<Icon>{icon}</Icon>}
          /*eslint react/jsx-props-no-spreading:0*/
          {...props}
        />
      ))}
      <Button
        tabIndex={inputs.length}
        node="button"
        type="submit"
        waves="light"
        onClick={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        disabled={buttonDisabled}
      >
        <>
          {submitText}
          {!!submitIcon ?? <Icon right>{submitIcon}</Icon>}
        </>
      </Button>
      {formAfter}
    </form>
  );
};

export default AuthForm;
