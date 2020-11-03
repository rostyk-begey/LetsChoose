import React, { useCallback, useState } from 'react';
import {
  Dimmer,
  Grid,
  Loader,
  Page as TablerPage,
  Form,
  Card,
  Button,
  // @ts-ignore
} from 'tabler-react';
import { useHistory } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
// @ts-ignore

import ROUTES from '../../utils/routes';
import Page from '../../components/Page';
import FormInput from '../../components/FormInput';
import Item from './Item';

import './index.scss';

const PrimeNumberChecker: React.FC = () => {
  const baseClassName = 'create-contest-page';
  const [items, setItems] = useState<number[]>([]);
  const form = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });
  const onSubmit = useCallback(
    (item: number): void => {
      setItems([item, ...items]);
    },
    [items],
  );
  const titleInputName = 'title';
  const { errors, reset, handleSubmit } = form;
  const submit = ({ title }: any) => {
    onSubmit(+title);
    reset({ [titleInputName]: '' });
  };

  // @ts-ignore
  return (
    <Page>
      <Dimmer active={false} loader={<Loader />}>
        <TablerPage.Content>
          <Grid.Row justifyContent="center">
            <Grid.Col width={12}>
              <Form className="card" onSubmit={handleSubmit(submit)}>
                <FormProvider {...form}>
                  <Card.Body className="p-4 p-md-5 p-xl-6">
                    <Grid.Row>
                      <Grid.Col
                        width={6}
                        md={6}
                        lg={8}
                        className="d-flex flex-column justify-content-center"
                      >
                        <Card.Title RootComponent="div">
                          Check if number is a prime number
                        </Card.Title>
                        <div className="d-flex flex-column align-items-start flex-md-row">
                          <FormInput
                            name={titleInputName}
                            type="number"
                            placeholder="Number"
                            validation={{ required: 'Please enter number' }}
                            wrapperClassName="mr-0 mr-md-3 mb-4 mb-md-0"
                          />
                          <Button
                            className="ml-auto"
                            type="submit"
                            color="primary"
                            outline
                          >
                            Check
                          </Button>
                        </div>
                      </Grid.Col>
                    </Grid.Row>
                  </Card.Body>
                </FormProvider>
              </Form>
            </Grid.Col>
          </Grid.Row>
          {!!items?.length && (
            <div className={`${baseClassName}__contest-items`}>
              {items.map((item, i) => (
                <Item
                  key={`${item}${items.length - i - 1}`}
                  title={item}
                  onDelete={() => setItems(items.filter((_, idx) => i !== idx))}
                />
              ))}
            </div>
          )}
        </TablerPage.Content>
      </Dimmer>
    </Page>
  );
};

export default PrimeNumberChecker;
