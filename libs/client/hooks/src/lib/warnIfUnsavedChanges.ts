import { useRouter } from 'next/router';
import { useEffect } from 'react';

export const useWarnIfUnsavedChanges = (unsavedChanges: boolean) => {
  const message = 'Do you want to leave?';
  const router = useRouter();

  useEffect(() => {
    const routeChangeStart = (url: string) => {
      if (router.asPath !== url && unsavedChanges && !window.confirm(message)) {
        router.events.emit('routeChangeError');
        router.replace(router, router.asPath);
        throw 'Abort route change. Please ignore this error.';
      }
    };

    const beforeunload: EventListenerOrEventListenerObject = (e: Event) => {
      if (unsavedChanges) {
        e.preventDefault();
        return message;
      }
      return;
    };

    window.addEventListener('beforeunload', beforeunload);
    router.events.on('routeChangeStart', routeChangeStart);

    return () => {
      window.removeEventListener('beforeunload', beforeunload);
      router.events.off('routeChangeStart', routeChangeStart);
    };
  }, [unsavedChanges]);
};
