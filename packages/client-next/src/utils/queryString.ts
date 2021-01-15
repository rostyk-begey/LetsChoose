import { stringify, parse } from 'query-string';

const setQueryStringWithoutPageReload = (qsValue: string) => {
  const newurl =
    window.location.protocol +
    '//' +
    window.location.host +
    window.location.pathname +
    qsValue;
  window.history.pushState({ path: newurl }, '', newurl);
};

export const getQueryStringValue = (
  key: string,
  queryString = '',
): string[] | string | null => {
  let query = queryString;
  if (typeof window !== 'undefined') {
    query = window.location.search;
  }
  const values = parse(query);
  return values[key];
};

export const setQueryStringValue = (
  key: string,
  value: string,
  queryString: string = window.location.search,
) => {
  const values = parse(queryString);
  const newQsValue = stringify({
    ...values,
    [key]: value,
  });
  setQueryStringWithoutPageReload(`?${newQsValue}`);
};
