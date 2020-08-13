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
      <FormProvider {...form}>
        <Card.Body className="p-6 row">
          <Grid.Col lg={4}>
            <DropzoneFileInput
              name={fileInputName}
              accept="image/jpeg"
              previewHolderClassName={`${baseClassName}__preview-holder`}
              previewClassName={`${baseClassName}__preview`}
            />
          </Grid.Col>
          <Grid.Col lg={8}>
            <Card.Title RootComponent="div">Add new item</Card.Title>
            <div className="d-flex">
              <FormInput
                name={titleInputName}
                type="text"
                placeholder="Title"
                validation={{ required: 'Please enter title' }}
                wrapperClassName="mr-3 mb-0"
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
        </Card.Body>
      </FormProvider>
    </Form>
  );
};

export default CreateContestItemForm;
