import { useEffect } from 'react';
import {
  contestApi,
  useContestFind,
  useCurrentUser,
} from '@lets-choose/client/hooks';
import { ROUTES } from '@lets-choose/client/utils';
import { UpdateContestData } from '@lets-choose/common/dto';
import { NextSeo } from 'next-seo';
import { NextRouter, useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useMutation } from '@tanstack/react-query';
import { ContestPageProps } from './ContestPage';
import { EditContestPageTemplate } from './EditContestPageTemplate';

export const EditContestPage = ({ initialContest }: ContestPageProps) => {
  const { query: { contestId = initialContest.id } = {}, ...router } =
    useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const { data: contestResponse } = useContestFind(contestId as string, {
    initialData: initialContest as never,
  });
  const { data: user } = useCurrentUser({
    redirectTo: ROUTES.HOME,
  });
  const contest = contestResponse || initialContest;
  const isCurrentUserAuthor = user?.id === contest?.author;

  const { mutate: updateContest, isLoading } = useMutation(
    (data: UpdateContestData) => contestApi.update(contestId as string, data),
    {
      onSuccess: () => {
        (router as NextRouter).push(`${ROUTES.CONTESTS.INDEX}/${contestId}`);
        enqueueSnackbar('Contest successfully updated', { variant: 'success' });
      },
      onError: (error: Error) => {
        enqueueSnackbar(error.message, { variant: 'error' });
      },
    },
  );
  const onSubmit = (data: unknown) => updateContest(data as UpdateContestData);

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
