import React, { useState, useCallback } from 'react';
import { Grid, Page as TablerPage } from 'tabler-react';
import { Link, Prompt, useParams } from 'react-router-dom';
import jsonToFormData from 'json-form-data';

import Page from 'app/components/Page';
import { useContestCreate } from 'app/hooks/api/contest';
import CreateContestForm from 'app/pages/CreateContest/CreateContestForm';
import CreatedContestItem from 'app/pages/CreateContest/CreatedContestItem';
import CreateContestItemForm from 'app/pages/CreateContest/CreateContestItemForm';

import './index.scss';

const TABS = {
  GENERAL: 'GENERAL',
  STATISTIC: 'STATISTIC',
};

const CreateContestPage = () => {
  const baseClassName = 'create-contest-page';
  const [createContest, { state, error, isLoading }] = useContestCreate();
  const [items, setItems] = useState([]);
  const saveContest = useCallback(
    async ({ thumbnail, ...contestData }) => {
      try {
        await createContest(
          jsonToFormData({
            ...contestData,
            thumbnail,
            items,
          }),
        );
      } catch (e) {
        console.log(e);
      }
    },
    [items],
  );
  const addItem = useCallback((item) => setItems([...items, item]), [items]);
  const updateItem = useCallback(
    (index, updatedItem) =>
      setItems(
        items.map((item, i) =>
          i === index ? { ...item, ...updatedItem } : item,
        ),
      ),
    [items],
  );
  const deleteItem = useCallback(
    (index) => setItems(items.filter((_, i) => index !== i)),
    [items],
  );

  return (
    <Page>
      {/*<Prompt message="Are you sure you want to leave?" when={isStarted} />*/}
      <TablerPage.Content>
        <Grid.Row justifyContent="center">
          <Grid.Col width={12}>
            <CreateContestForm onSubmit={saveContest} />
          </Grid.Col>
          <Grid.Col width={12}>
            <CreateContestItemForm onSubmit={addItem} />
          </Grid.Col>
        </Grid.Row>
        {!!items.length && (
          <div className={`${baseClassName}__contest-items`}>
            {items.map(({ image, title }, i) => (
              <CreatedContestItem
                key={title}
                image={image}
                title={title}
                onUpdate={(item) => updateItem(i, item)}
                onDelete={() => deleteItem(i)}
              />
            ))}
          </div>
        )}
      </TablerPage.Content>
    </Page>
  );
};

export default CreateContestPage;
