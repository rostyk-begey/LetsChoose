import jsonToFormData from 'json-form-data';
import React, { useCallback, useState } from 'react';
import { useSnackbar } from 'notistack';
import { ROUTES } from '@lets-choose/client/utils';
import { CreateContestData } from '@lets-choose/common/dto';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { useContestCreate, useCurrentUser } from '@lets-choose/client/hooks';

import { EditContestPageTemplate } from './EditContestPageTemplate';

export const CreateContestPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const { mutateAsync: createContest } = useContestCreate();
  const onSubmit = useCallback(
    async (data: CreateContestData) => {
      try {
        setIsLoading(true);
        const { data: contest } = await createContest(data);
        await router.push(`${ROUTES.CONTESTS.INDEX}/${contest.id}`);
        enqueueSnackbar('Contest successfully created', { variant: 'success' });
      } catch (e: any) {
        enqueueSnackbar(e.message, { variant: 'error' });
      } finally {
        setIsLoading(false);
      }
    },
    [createContest, router, enqueueSnackbar],
  );
  useCurrentUser({ redirectTo: ROUTES.HOME });

  return (
    <>
      <NextSeo title="New contest" />
      <EditContestPageTemplate<CreateContestData>
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
