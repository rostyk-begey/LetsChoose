import Router from 'next/router';
import { useEffect } from 'react';

export const useWarnIfUnsavedChanges = (unsavedChanges: boolean) => {
  const message = 'Do you want to leave?';

  useEffect(() => {
    const routeChangeStart = (url: string) => {
      if (Router.asPath !== url && unsavedChanges && !window.confirm(message)) {
        Router.events.emit('routeChangeError');
        Router.replace(Router, Router.asPath);
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
    Router.events.on('routeChangeStart', routeChangeStart);

    return () => {
      window.removeEventListener('beforeunload', beforeunload);
      Router.events.off('routeChangeStart', routeChangeStart);
    };
  }, [unsavedChanges]);
};
