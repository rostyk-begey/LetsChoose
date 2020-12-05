import React, { useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
// @ts-ignore
import jsonToFormData from 'json-form-data';
// @ts-ignore
import { Dimmer, Grid, Loader, Page as TablerPage } from 'tabler-react';

import ROUTES from '../../utils/routes';
import Page from '../../components/Page';
import EditContestForm from '../../components/ContestEditPage/EditContestForm';
import { useContestFind, useContestUpdate } from '../../hooks/api/contest';

const UpdateContestPage = () => {
  const { id: contestId = '' } = useParams<{ id: string }>();
  const history = useHistory();
  if (!contestId) history.push(ROUTES.HOME);
  const { data: { data: contest = {} } = {} }: any = useContestFind(contestId);
  const [updateContest, updateContestQuery] = useContestUpdate(contestId);
  const saveContest = useCallback(
    async ({ thumbnail, ...contestData }) => {
      try {
        await updateContest(
          jsonToFormData({
            title: contest.title,
            excerpt: contest.excerpt,
            ...contestData,
            thumbnail,
          }),
        );
        history.push(`${ROUTES.CONTESTS.INDEX}/${contestId}`);
      } catch (e) {
        console.log(e);
      }
    },
    [contest],
  );

  return (
    <Page>
      <Dimmer active={updateContestQuery.isLoading} loader={<Loader />}>
        {/*<Prompt message="Are you sure you want to leave?" when={isStarted} />*/}
        <TablerPage.Content>
          <Grid.Row justifyContent="center">
            <Grid.Col width={12}>
              <EditContestForm onSubmit={saveContest} defaultValues={contest} />
            </Grid.Col>
          </Grid.Row>
        </TablerPage.Content>
      </Dimmer>
    </Page>
  );
};

export default UpdateContestPage;
