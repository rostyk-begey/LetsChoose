import React, { useCallback } from 'react';
import { Dimmer, Grid, Loader, Page as TablerPage } from 'tabler-react';
import { Prompt, useHistory } from 'react-router-dom';
import jsonToFormData from 'json-form-data';

import ROUTES from 'app/utils/routes';
import Page from 'app/components/Page';
import { useContestCreate } from 'app/hooks/api/contest';
import useContestItems from 'app/hooks/contestItems';
import EditContestForm from 'app/components/ContestEditPage/EditContestForm';
import CreatedContestItem from 'app/components/ContestEditPage/EditSingleContestItemForm';
import CreateContestItemForm from 'app/components/ContestEditPage/CreateContestItemForm';

import './index.scss';

const CreateContestPage = () => {
  const baseClassName = 'create-contest-page';
  const history = useHistory();
  const [createContest, createContestQuery] = useContestCreate();
  const { items, addItem, deleteItem, updateItem } = useContestItems();
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
        history.push(ROUTES.HOME);
      } catch (e) {
        console.log(e);
      }
    },
    [items],
  );

  return (
    <Page isPrivate>
      {/*<Prompt message="Are you sure you want to leave?" when={isStarted} />*/}
      <Dimmer active={createContestQuery.isLoading} loader={<Loader />}>
        <TablerPage.Content>
          <Grid.Row justifyContent="center">
            <Grid.Col width={12}>
              <EditContestForm onSubmit={saveContest} />
            </Grid.Col>
            <Grid.Col width={12}>
              <CreateContestItemForm onSubmit={addItem} />
            </Grid.Col>
          </Grid.Row>
          {!!items?.length && (
            <div className={`${baseClassName}__contest-items`}>
              {items.map(({ image, title }, i) => (
                <CreatedContestItem
                  key={title}
                  image={URL.createObjectURL(image)}
                  title={title}
                  onUpdate={(item) => updateItem(i, item)}
                  onDelete={() => deleteItem(i)}
                />
              ))}
            </div>
          )}
        </TablerPage.Content>
      </Dimmer>
    </Page>
  );
};

export default CreateContestPage;
