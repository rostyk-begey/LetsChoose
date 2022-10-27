import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { oneTapContainerId } from '@lets-choose/client/utils';
import { authApi } from './api/auth';
import { useCurrentUser } from './api/user';

export interface UseGoogleSignInPromptProps {
  enabled: boolean;
}

export const useGoogleSignInPrompt = ({
  enabled,
}: UseGoogleSignInPromptProps) => {
  const { mutate: googleLogin } = useMutation(authApi.loginGoogle, {
    onSuccess: async () => {
      await refetchCurrentUser();
      enqueueSnackbar('Successfully logged in', { variant: 'success' });
    },
    onError: (e: any) => {
      enqueueSnackbar(e.response.data.message, { variant: 'error' });
    },
  });
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
        callback: async ({ credential: token }) => googleLogin({ token }),
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
