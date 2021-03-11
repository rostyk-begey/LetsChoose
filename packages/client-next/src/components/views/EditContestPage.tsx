import { Contest } from '@lets-choose/common';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import {
  useContestCreate,
  useContestFind,
  useContestUpdate,
} from '../../hooks/api/contest';
import { useCurrentUser } from '../../hooks/api/user';
import ROUTES from '../../utils/routes';
import EditContestPageTemplate from './EditContestPageTemplate';

const EditContestPage: React.FC = () => {
  const {
    query: { contestId },
    ...router
  } = useRouter();

  const { data: contestResponse, isLoading: isContestLoading } = useContestFind(
    contestId as string,
  );
  const { data: { data: user } = {}, isLoading } = useCurrentUser({
    redirectTo: ROUTES.HOME,
  });
  const contest = (contestResponse?.data as Contest) || null;
  const isCurrentUserAuthor = user?._id === contest?.author;

  const { mutateAsync: updateContest } = useContestUpdate(contestId as string);
  const onSubmit = async (data) => {
    await updateContest(data);
    await router.push(`${ROUTES.CONTESTS.INDEX}/${contestId}`);
  };

  useEffect(() => {
    if (
      (user && contest && !isCurrentUserAuthor) ||
      (contestId && !contest && !isContestLoading)
    ) {
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
        title: contest?.title,
        excerpt: contest?.excerpt,
      }}
    />
  );
};

export default EditContestPage;
