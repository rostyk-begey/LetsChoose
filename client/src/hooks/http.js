import { useState, useCallback } from 'react';

const useHttp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(
    async (url, method = 'GET', body = null, headers = {}) => {
      if (body) {
        body = JSON.stringify(body);
        headers['Content-Type'] = 'application/json';
      }

      try {
        setLoading(true);
        const response = await fetch(url, { method, body, headers });
        const data = await response.json();

        if (!response.ok) {
          const { message, errors } = data;
          setError({ message, errors });
          throw new Error(message || `Request to ${url} failed`);
        }
        setLoading(false);
        return data;
      } catch (e) {
        setLoading(false);
        throw e;
      }
    },
    [],
  );

  return { request, loading, error };
};

export default useHttp;
