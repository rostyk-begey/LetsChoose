import React from 'react';
import { Grid, Page as TablerPage } from 'tabler-react';

import Page from 'app/components/Page';
import EditContestForm from 'app/components/ContestEditPage/EditContestForm';
import CreatedContestItem from 'app/components/ContestEditPage/EditSingleContestItemForm';
import CreateContestItemForm from 'app/components/ContestEditPage/CreateContestItemForm';

import '../../pages/CreateContest/index.scss';

const ContestEditPage = ({
  save,
  items,
  contestData,
  addItem,
  updateItem,
  deleteItem,
}) => {
  const baseClassName = 'create-edit-contest-page';

  return (
    <Page>
      {/*<Prompt message="Are you sure you want to leave?" when={isStarted} />*/}
      <TablerPage.Content>
        <Grid.Row justifyContent="center">
          <Grid.Col width={12}>
            <EditContestForm onSubmit={save} defaultValues={contestData} />
          </Grid.Col>
          <Grid.Col width={12}>
            <CreateContestItemForm onSubmit={addItem} />
          </Grid.Col>
        </Grid.Row>
        {items?.length && (
          <div className={`${baseClassName}__contest-items`}>
            {items.map(({ image, title }, i) => (
              <CreatedContestItem
                key={title}
                image={
                  typeof image === 'string' ? image : URL.createObjectURL(image)
                }
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

export default ContestEditPage;
