import { useSnackbar } from 'notistack';
import { useEffect } from 'react';

import { oneTapContainerId } from '@lets-choose/client/utils';
import { authApi, useAxiosMutation } from './api/auth';
import { useCurrentUser } from './api/user';

export interface UseGoogleSignInPromptProps {
  enabled: boolean;
}

export const useGoogleSignInPrompt = ({
  enabled,
}: UseGoogleSignInPromptProps) => {
  const { mutateAsync: googleLogin } = useAxiosMutation(authApi.loginGoogle);
  const { enqueueSnackbar } = useSnackbar();
  const { refetch: refetchCurrentUser } = useCurrentUser({});

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (window?.google?.accounts) {
      if (!enabled) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.google.accounts.id.cancel();
        return;
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const options: google.IdConfiguration = {
        client_id: process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID as string,
        auto_select: false,
        cancel_on_tap_outside: false,
        context: 'signin',
        prompt_parent_id: oneTapContainerId,
        callback: async ({ credential: token }) => {
          try {
            await googleLogin({ token });
            await refetchCurrentUser();
            enqueueSnackbar('Successfully logged in', { variant: 'success' });
          } catch (e: any) {
            enqueueSnackbar(e.response.data.message, { variant: 'error' });
          }
        },
      };

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.google.accounts.id.initialize(options);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.google.accounts.id.prompt();
    }
  }, [enabled, enqueueSnackbar, googleLogin, refetchCurrentUser]);
};
