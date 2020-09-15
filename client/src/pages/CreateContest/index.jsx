import React, { useEffect, useState, useCallback } from 'react';
import { Grid, Page as TablerPage } from 'tabler-react';
import { Link, Prompt, useParams } from 'react-router-dom';
import jsonToFormData from 'json-form-data';

import Page from 'app/components/Page';
import { useContestCreate, useContestFind } from 'app/hooks/api/contest';
import useContestItems from 'app/hooks/contestItems';
import EditContestForm from 'app/components/ContestEditPage/EditContestForm';
import CreatedContestItem from 'app/components/ContestEditPage/EditSingleContestItemForm';
import CreateContestItemForm from 'app/components/ContestEditPage/EditContestItemForm';

import '../../components/ContestEditPage/index.scss';
import ContestEditPage from 'app/components/ContestEditPage';

const TABS = {
  GENERAL: 'GENERAL',
  STATISTIC: 'STATISTIC',
};

const CreateContestPage = () => {
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
      } catch (e) {
        console.log(e);
      }
    },
    [items],
  );

  return (
    <ContestEditPage
      isLoading={false}
      save={saveContest}
      items={items}
      addItem={addItem}
      updateItem={updateItem}
      deleteItem={deleteItem}
    />
  );
};

export default CreateContestPage;
