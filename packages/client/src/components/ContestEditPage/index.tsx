import React from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Grid, Page as TablerPage } from 'tabler-react';

import Page from '../../components/Page';
import EditContestForm from '../../components/ContestEditPage/EditContestForm';
import CreatedContestItem from '../../components/ContestEditPage/EditSingleContestItemForm';
import CreateContestItemForm from '../../components/ContestEditPage/CreateContestItemForm';

import '../../pages/CreateContest/index.scss';

interface Props {
  save: any;
  items: [];
  contestData: any;
  addItem: any;
  updateItem: any;
  deleteItem: any;
}

const ContestEditPage: React.FC<Props> = ({
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
                onUpdate={(item: any) => updateItem(i, item)}
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
