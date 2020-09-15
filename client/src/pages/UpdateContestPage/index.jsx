import React, { useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import jsonToFormData from 'json-form-data';

import { useContestFind, useContestUpdate } from 'app/hooks/api/contest';
import useContestItems from 'app/hooks/contestItems';
import ContestEditPage from 'app/components/ContestEditPage';

const UpdateContestPage = () => {
  const baseClassName = 'create-contest-page';
  const { id: contestId = null } = useParams();
  const {
    data: { data: contest = {} } = {},
    ...getContestQuery
  } = useContestFind(contestId);
  const [updateContest, updateContestQuery] = useContestUpdate();
  const {
    items,
    setItems,
    addItem,
    deleteItem,
    updateItem,
  } = useContestItems();
  const saveContest = useCallback(
    async ({ thumbnail, ...contestData }) => {
      try {
        console.log({
          ...contest,
          ...contestData,
          thumbnail,
          items,
        });
        // await updateContest(
        //   jsonToFormData({
        //     ...contest,
        //     ...contestData,
        //     thumbnail,
        //     items,
        //   }),
        // );
      } catch (e) {
        console.log(e);
      }
    },
    [items, contest],
  );

  useEffect(() => {
    if (!getContestQuery.error && contest !== {}) {
      setItems(contest.items);
    }
  }, [contest]);

  return (
    <ContestEditPage
      isLoading={false}
      save={saveContest}
      contestData={contest}
      items={items}
      addItem={addItem}
      updateItem={updateItem}
      deleteItem={deleteItem}
    />
  );
};

export default UpdateContestPage;
