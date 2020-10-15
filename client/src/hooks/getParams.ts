import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import throttle from 'lodash/throttle';

import useURLSearchParams from 'app/hooks/URLSearchParams';

type InputCallback = (e: React.ChangeEvent<HTMLInputElement>) => void;

const useGetParams = (baseUrl: string, defaultParams: object) => {
  const history = useHistory();
  const query = useURLSearchParams();
  const [params, setParams] = useState<object>(defaultParams);

  // Restore params from URL
  useEffect(() => {
    const newPrams = Object.keys(defaultParams).reduce((acc, key) => {
      const param = query.get(key);
      if (param) acc[key] = param;
      return acc;
    }, {} as any);
    setParams((prevState) => ({
      ...prevState,
      ...newPrams,
    }));
  }, []);

  const updateParam = useCallback<(name: string, value: any) => void>(
    (name, value) => {
      const newParams = {
        ...params,
        [name]: encodeURI(value),
      };
      setParams(newParams);
      const urlParams = Object.entries(newParams).reduce((acc, [key, val]) => {
        if (val) acc.append(key, val);
        return acc;
      }, new URLSearchParams());
      history.push(`${baseUrl}?${urlParams}`);
    },
    [params],
  );
  const onInputChange: InputCallback = ({ target: { name, value } }) =>
    updateParam(name, value);

  const { current: throttled } = useRef(
    throttle(updateParam, 1000, { leading: false }),
  );
  const handleSearch: InputCallback = ({ target: { name, value } }) => throttled(name, value);

  return { params, handleSearch, onInputChange, updateParam };
};

export default useGetParams;