import React, { useCallback, useEffect, useState } from 'react';
import {
  useContestFind,
  useContestUpdate,
  useCurrentUser,
} from '@lets-choose/client/hooks';
import { ROUTES } from '@lets-choose/client/utils';
import { ContestDto, UpdateContestData } from '@lets-choose/common/dto';
import { AxiosResponse } from '@nestjs/terminus/dist/health-indicator/http/axios.interfaces';
import { NextSeo } from 'next-seo';
import { NextRouter, useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { ContestPageProps } from './ContestPage';
import { EditContestPageTemplate } from './EditContestPageTemplate';

export const EditContestPage: React.FC<ContestPageProps> = ({
  initialContest,
}) => {
  const { query: { contestId = initialContest.id } = {}, ...router } =
    useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const { data: contestResponse } = useContestFind(contestId as string, {
    initialData: { data: initialContest } as AxiosResponse<ContestDto>,
  });
  const { data: { data: user } = {} } = useCurrentUser({
    redirectTo: ROUTES.HOME,
  });
  const contest = (contestResponse?.data as ContestDto) || initialContest;
  const isCurrentUserAuthor = user?.id === contest?.author;

  const { mutateAsync: updateContest } = useContestUpdate(contestId as string);
  const [isLoading, setIsLoading] = useState(false);
  const onSubmit = useCallback(
    async (data: UpdateContestData) => {
      try {
        setIsLoading(true);
        await updateContest(data);
        await (router as NextRouter).push(
          `${ROUTES.CONTESTS.INDEX}/${contestId}`,
        );
        enqueueSnackbar('Contest successfully updated', { variant: 'success' });
      } catch (e: any) {
        enqueueSnackbar(e.message, { variant: 'error' });
      } finally {
        setIsLoading(false);
      }
    },
    [updateContest, router, contestId, enqueueSnackbar],
  );

  useEffect(() => {
    if (user && !isCurrentUserAuthor) {
      (router as NextRouter).push(ROUTES.HOME);
    }
  }, [user, contest, isCurrentUserAuthor, router]);

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
      <EditContestPageTemplate<UpdateContestData>
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
