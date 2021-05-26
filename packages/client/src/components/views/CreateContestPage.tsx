import React from 'react';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';

import { useContestCreate } from '../../hooks/api/contest';
import { useCurrentUser } from '../../hooks/api/user';
import ROUTES from '../../utils/routes';

import EditContestPageTemplate from './EditContestPageTemplate';

const CreateContestPage: React.FC = () => {
  const router = useRouter();
  const { isLoading, mutateAsync: createContest } = useContestCreate();
  const onSubmit = async (data) => {
    const { data: contest } = await createContest(data);
    await router.push(`${ROUTES.CONTESTS.INDEX}/${contest.id}`);
  };
  useCurrentUser({ redirectTo: ROUTES.HOME });

  return (
    <>
      <NextSeo title="New contest" />
      <EditContestPageTemplate
        withItemsUpload
        title="Create a new contest"
        submitButtonText="Save"
        onSubmit={onSubmit}
        isLoading={isLoading}
        inputsDefaultValues={{
          title: '',
          excerpt: '',
        }}
      />
    </>
  );
};

export default CreateContestPage;
