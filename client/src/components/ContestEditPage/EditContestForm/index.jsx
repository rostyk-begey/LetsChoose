import React, { useState, useEffect, useCallback } from 'react';
import { Button, Card, Form, Grid } from 'tabler-react';
import { useForm, FormProvider } from 'react-hook-form';
import cn from 'classnames';

import FormInput from 'app/components/FormInput';
import DropzoneFileInput from 'app/components/DropzoneFileInput';

import './index.scss';

const EditContestForm = ({
  defaultValues = {},
  onSubmit,
  buttonLoading = false,
}) => {
  const baseClassName = 'create-contest-form';
  const form = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues,
  });
  const { reset, errors, handleSubmit, setValue } = form;
  const fileInputName = 'thumbnail';
  const INPUTS = [
    {
      label: 'Title',
      name: 'title',
      placeholder: 'Title',
      type: 'text',
      validation: { required: 'Please enter title' },
    },
    {
      label: 'Description',
      name: 'excerpt',
      type: 'textarea',
      placeholder: 'Description',
      className: `${baseClassName}__flex-1`,
      wrapperClassName: `d-flex flex-column mb-5 ${baseClassName}__flex-1`,
      validation: { required: 'Please enter description' },
    },
  ];

  return (
    <Form
      className={cn('card', baseClassName)}
      onSubmit={handleSubmit((form) => {
        onSubmit(form);
        // setValue(fileInputName, undefined);
      })}
      errors={[]}
      method="POST"
      title="Create new contest"
    >
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <FormProvider {...form}>
        <Card.Body className="p-4 p-md-5 p-xl-6 d-flex flex-column">
          <Card.Title RootComponent="div">Create new contest</Card.Title>
          <Grid.Row className={`${baseClassName}__flex-1`}>
            <Grid.Col lg={7} width={12} className="mb-4 mb-lg-0">
              <DropzoneFileInput
                name={fileInputName}
                previewDefaultUrl={defaultValues.thumbnail}
                accept="image/jpeg"
                previewHolderClassName={`${baseClassName}__preview-holder`}
                previewClassName={`${baseClassName}__preview`}
              >
                <h3 className="px-2 m-0 text-center">
                  Drag & drop image here, or click to select image
                </h3>
              </DropzoneFileInput>
            </Grid.Col>
            <Grid.Col lg={5} width={12} className="d-flex flex-column">
              {INPUTS.map((input) => (
                <FormInput
                  key={input.name}
                  defaultValue={defaultValues[input.name]}
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...input}
                />
              ))}
              <Button
                type="submit"
                color="primary"
                disabled={Object.keys(errors).length || buttonLoading}
                loading={buttonLoading}
                block
              >
                Save
              </Button>
            </Grid.Col>
          </Grid.Row>
        </Card.Body>
      </FormProvider>
    </Form>
  );
};

export default EditContestForm;
