import { useState, useEffect, useCallback, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { throttle } from 'lodash';

import useURLSearchParams from 'app/hooks/URLSearchParams';

const useGetParams = (baseUrl, defaultParams) => {
  const history = useHistory();
  const query = useURLSearchParams();
  const [params, setParams] = useState(defaultParams);

  // Restore params from URL
  useEffect(() => {
    const newPrams = Object.keys(defaultParams).reduce((acc, key) => {
      const param = query.get(key);
      if (param) acc[key] = param;
      return acc;
    }, {});
    setParams((prevState) => ({
      ...prevState,
      ...newPrams,
    }));
  }, []);

  const updateParam = useCallback(
    (name, value) => {
      const newParams = {
        ...params,
        [name]: value,
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
  const onInputChange = ({ target: { name, value } }) =>
    updateParam(name, value);

  const { current: throttled } = useRef(
    throttle(updateParam, 1000, { leading: false }),
  );
  const handleSearch = ({ target: { name, value } }) => throttled(name, value);

  return { params, handleSearch, onInputChange };
};

export default useGetParams;
