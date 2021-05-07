import { useRouter } from 'next/router';

type QueryValue = string | string[] | undefined;

const useQueryState = (
  key: string,
  initialValue?: QueryValue,
): [QueryValue, (value: QueryValue) => void] => {
  const router = useRouter();

  return [
    router?.query[key] || initialValue,
    (value: QueryValue) => {
      router?.push({
        pathname: router.pathname,
        query: { ...router.query, [key]: value },
      });
    },
  ];
};

export default useQueryState;
