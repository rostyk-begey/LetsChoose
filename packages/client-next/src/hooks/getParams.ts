import { useRouter } from 'next/router';

type QueryValue = string | string[] | undefined;

const useQueryState = (
  key: string,
  initialValue?: QueryValue,
): [QueryValue, (value: QueryValue) => void] => {
  const { push, pathname, query } = useRouter();

  return [
    query[key] || initialValue,
    (value: QueryValue) => {
      push({ pathname, query: { ...query, [key]: value } });
    },
  ];
};

export default useQueryState;
