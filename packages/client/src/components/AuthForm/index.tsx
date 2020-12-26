import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Button, Card, Form } from 'tabler-react';

import FormInput from '../../components/FormInput';

import './index.scss';

export interface InputElement {
  type: string;
  name: string;
  label: string;
  placeholder: string;
  validation: any;
}

interface Props {
  onSubmit: any;
  inputs: InputElement[];
  title: string;
  buttonText: string;
  buttonLoading: boolean;
  formAfter: any;
}

const AuthForm: React.FC<Props> = ({
  onSubmit,
  inputs,
  title,
  buttonText = 'Submit',
  buttonLoading = false,
  formAfter = '',
}) => {
  const form = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });
  const { handleSubmit, errors } = form;

  return (
    <Form className="card" onSubmit={handleSubmit(onSubmit)} method="POST">
      <Card.Body className="p-6">
        <Card.Title RootComponent="div">{title}</Card.Title>
        <FormProvider {...form}>
          {inputs.map(({ type, name, label, placeholder, validation }, i) => (
            <FormInput
              key={i}
              type={type}
              name={name}
              label={label}
              placeholder={placeholder}
              validation={validation}
            />
          ))}
        </FormProvider>
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
