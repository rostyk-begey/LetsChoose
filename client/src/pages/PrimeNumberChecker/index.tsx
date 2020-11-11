import React from 'react';
import {
  Dimmer,
  Grid,
  Loader,
  Page as TablerPage,
  Form,
  Card,
  Button,
  Table,
  // @ts-ignore
} from 'tabler-react';
import { FormProvider, useForm } from 'react-hook-form';
// @ts-ignore

import Page from '../../components/Page';
import FormInput from '../../components/FormInput';
import { useTaskCreate, useTasksAll } from '../../hooks/api/task';
import Item from './Item';

import './index.scss';

const INPUTS = [
  {
    label: 'Title',
    name: 'title',
    type: 'text',
    placeholder: 'Title',
    validation: {
      required: 'Please enter task title',
      minLength: {
        value: 3,
        message: 'Task title should have at least 3 characters',
      },
    },
  },
  {
    password: true,
    label: 'Secret',
    name: 'secret',
    type: 'password',
    placeholder: 'Secret',
    validation: {
      required: 'Please enter task secret',
    },
  },
  {
    label: 'hardness',
    name: 'hardness',
    type: 'number',
    placeholder: 'Hardness',
    min: 1,
    max: 64,
    validation: {
      required: 'Please enter task hardness',
      min: {
        value: 1,
        message: 'Task hardness should me at least 1',
      },
      max: {
        value: 64,
        message: 'Task hardness less or equal 64',
      },
    },
  },
];

const PrimeNumberChecker: React.FC = () => {
  const baseClassName = 'create-contest-page';
  const { data: { data: tasks = [] } = {}, isSuccess, refetch } = useTasksAll({
    refetchInterval: 5000,
  });
  const [createTask, { isLoading }] = useTaskCreate();
  const form = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      hardness: 8,
    },
  });
  const { handleSubmit } = form;
  const submit = async (task: any) => {
    await createTask(task);
    await refetch();
  };

  // @ts-ignore
  return (
    <Page>
      <Dimmer active={false} loader={<Loader />}>
        <TablerPage.Content>
          <Grid.Row justifyContent="center">
            <Grid.Col width={12}>
              <Form
                autocomplete="off"
                className="card"
                onSubmit={handleSubmit(submit)}
              >
                <FormProvider {...form}>
                  <input type="hidden" value="something" />
                  <Card.Body className="p-4 p-md-5 p-xl-6">
                    <Grid.Row>
                      <Grid.Col
                        width={12}
                        className="d-flex flex-column justify-content-center"
                      >
                        <Card.Title RootComponent="div">
                          Create new task
                        </Card.Title>
                        <div className="d-flex flex-column align-items-start flex-md-row">
                          {INPUTS.map(
                            (
                              { type, name, label, placeholder, validation },
                              i,
                            ) => (
                              <FormInput
                                key={i}
                                type={type}
                                name={name}
                                label={label}
                                placeholder={placeholder}
                                validation={validation}
                                wrapperClassName="mr-0 mr-md-3 mb-4 mb-md-0"
                              />
                            ),
                          )}
                          <Button
                            className="ml-auto"
                            type="submit"
                            color="primary"
                            outline
                          >
                            Create
                          </Button>
                        </div>
                      </Grid.Col>
                    </Grid.Row>
                  </Card.Body>
                </FormProvider>
              </Form>
            </Grid.Col>
          </Grid.Row>
          <Table cards responsive highlightRowOnHover className="table-vcenter">
            <Table.Header>
              <Table.Row>
                <Table.ColHeader>Title</Table.ColHeader>
                <Table.ColHeader>Hardness</Table.ColHeader>
                <Table.ColHeader>Status</Table.ColHeader>
                <Table.ColHeader>Actions</Table.ColHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {isSuccess &&
                tasks.map(({ title, hardness, status, _id }) => (
                  <Item
                    id={_id}
                    key={_id}
                    title={title}
                    hardness={hardness}
                    status={status as any}
                    onDelete={() => refetch()}
                  />
                ))}
            </Table.Body>
          </Table>
        </TablerPage.Content>
      </Dimmer>
    </Page>
  );
};

export default PrimeNumberChecker;
