import { useCallback, useState } from 'react';
import { useSnackbar } from 'notistack';
import { ROUTES } from '@lets-choose/client/utils';
import { CreateContestData } from '@lets-choose/common/dto';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { contestApi, useCurrentUser } from '@lets-choose/client/hooks';
import { useMutation } from '@tanstack/react-query';

import { EditContestPageTemplate } from './EditContestPageTemplate';

export const CreateContestPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const { mutate: createContest, isLoading } = useMutation(contestApi.create, {
    onSuccess: ({ data: contest }) => {
      router.push(`${ROUTES.CONTESTS.INDEX}/${contest.id}`);
      enqueueSnackbar('Contest successfully created', { variant: 'success' });
    },
    onError: (error: Error) => {
      enqueueSnackbar(error.message, { variant: 'error' });
    },
  });
  const onSubmit = (data: unknown) => createContest(data as CreateContestData);

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
