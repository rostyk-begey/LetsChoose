import React, { useEffect } from 'react';
import { Contest, UpdateContestData } from '@lets-choose/common/dto';
import { NextSeo } from 'next-seo';
import { NextRouter, useRouter } from 'next/router';

import {
  useContestFind,
  useContestUpdate,
  useCurrentUser,
} from '@lets-choose/client/hooks';
import { ROUTES } from '@lets-choose/client/utils';
import { ContestPageProps } from './ContestPage';
import { EditContestPageTemplate } from './EditContestPageTemplate';

export const EditContestPage: React.FC<ContestPageProps> = ({
  initialContest,
}) => {
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

  const { isLoading, mutateAsync: updateContest } = useContestUpdate(
    contestId as string,
  );
  const onSubmit = async (data: UpdateContestData) => {
    await updateContest(data);
    await (router as NextRouter).push(`${ROUTES.CONTESTS.INDEX}/${contestId}`);
  };

  useEffect(() => {
    if (user && !isCurrentUserAuthor) {
      (router as NextRouter).push(ROUTES.HOME);
    }
  }, [user, contest, isCurrentUserAuthor]);

  return (
    <>
      <NextSeo
        title={initialContest.title}
        description={initialContest.excerpt}
        openGraph={{
          title: initialContest.title,
          ...(initialContest.excerpt && {
            description: initialContest.excerpt,
          }),
          images: [
            {
              url: initialContest.thumbnail,
              alt: initialContest.title,
            },
          ],
        }}
      />
      <EditContestPageTemplate
        isLoading={isLoading}
        title={contest?.title}
        submitButtonText="Save"
        defaultThumbnail={contest?.thumbnail}
        onSubmit={onSubmit}
        inputsDefaultValues={{
          title: initialContest.title,
          excerpt: initialContest.excerpt,
        }}
      />
    </>
  );
};
