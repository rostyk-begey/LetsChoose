import React, { useCallback } from 'react';
// @ts-ignore
import { Dimmer, Grid, Loader, Page as TablerPage } from 'tabler-react';
import { useHistory } from 'react-router-dom';
// @ts-ignore
import jsonToFormData from 'json-form-data';

import ROUTES from '../../utils/routes';
import Page from '../../components/Page';
import { useContestCreate } from '../../hooks/api/contest';
import useContestItems from '../../hooks/contestItems';
import EditContestForm from '../../components/ContestEditPage/EditContestForm';
import CreatedContestItem from '../../components/ContestEditPage/EditSingleContestItemForm';
import CreateContestItemForm from '../../components/ContestEditPage/CreateContestItemForm';

import './index.scss';

const CreateContestPage: React.FC = () => {
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
    <Page>
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
                  onUpdate={(item: any) => updateItem(i, item)}
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
