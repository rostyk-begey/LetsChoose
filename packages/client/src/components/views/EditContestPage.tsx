import { Contest } from '@lets-choose/common';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import { useContestFind, useContestUpdate } from '../../hooks/api/contest';
import { useCurrentUser } from '../../hooks/api/user';
import ROUTES from '../../utils/routes';
import { ContestPageProps } from './ContestPage/ContestPage';
import EditContestPageTemplate from './EditContestPageTemplate';

const EditContestPage: React.FC<ContestPageProps> = ({ initialContest }) => {
  const { query: { contestId = initialContest.id } = {}, ...router } =
    useRouter() || {};

  const { data: contestResponse } = useContestFind(contestId as string, {
    initialData: { data: initialContest } as any,
  });
  const { data: { data: user } = {} } = useCurrentUser({
    redirectTo: ROUTES.HOME,
  });
  const contest = (contestResponse?.data as Contest) || initialContest;
  const isCurrentUserAuthor = user?._id === contest?.author;

  const { mutateAsync: updateContest } = useContestUpdate(contestId as string);
  const onSubmit = async (data) => {
    await updateContest(data);
    await router.push(`${ROUTES.CONTESTS.INDEX}/${contestId}`);
  };

  useEffect(() => {
    if (user && !isCurrentUserAuthor) {
      router.push(ROUTES.HOME);
    }
  }, [user, contest, isCurrentUserAuthor]);

  return (
    <EditContestPageTemplate
      title={contest?.title}
      submitButtonText="Save"
      defaultThumbnail={contest?.thumbnail}
      onSubmit={onSubmit}
      inputsDefaultValues={{
        title: initialContest.title,
        excerpt: initialContest.excerpt,
      }}
    />
  );
};

export default EditContestPage;
