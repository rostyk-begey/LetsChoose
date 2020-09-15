import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Button, Card, Form, Grid } from 'tabler-react';

import FormInput from 'app/components/FormInput';
import DropzoneFileInput from 'app/components/DropzoneFileInput';

import './index.scss';

const CreateContestItemForm = ({ onSubmit, buttonLoading = false }) => {
  const baseClassName = 'create-contest-item-form';
  const form = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });
  const titleInputName = 'title';
  const fileInputName = 'image';
  const { errors, reset, handleSubmit, setValue } = form;
  const submit = (item) => {
    onSubmit(item);
    reset({ [titleInputName]: '' });
    setValue(fileInputName, undefined);
  };

  return (
    <Form className="card" onSubmit={handleSubmit(submit)} title="Add new item">
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <FormProvider {...form}>
        <Card.Body className="p-4 p-md-5 p-xl-6">
          <Grid.Row>
            <Grid.Col width={6} md={6} lg={4}>
              <DropzoneFileInput
                name={fileInputName}
                accept="image/jpeg"
                previewHolderClassName={`${baseClassName}__preview-holder`}
                previewClassName={`${baseClassName}__preview`}
              >
                <h4 className="px-2 m-0 text-center">
                  Drag & drop image here, or click to select image
                </h4>
              </DropzoneFileInput>
            </Grid.Col>
            <Grid.Col
              width={6}
              md={6}
              lg={8}
              className="d-flex flex-column justify-content-center"
            >
              <Card.Title RootComponent="div">Add new item</Card.Title>
              <div className="d-flex flex-column flex-md-row">
                <FormInput
                  name={titleInputName}
                  type="text"
                  placeholder="Title"
                  validation={{ required: 'Please enter title' }}
                  wrapperClassName="mr-0 mr-md-3 mb-4 mb-md-0"
                />
                <Button
                  className="ml-auto"
                  type="submit"
                  color="primary"
                  outline
                  disabled={Object.keys(errors).length || buttonLoading}
                  loading={buttonLoading}
                >
                  Add
                </Button>
              </div>
            </Grid.Col>
          </Grid.Row>
        </Card.Body>
      </FormProvider>
    </Form>
  );
};

export default CreateContestItemForm;
