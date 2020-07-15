import { useState, useCallback } from 'react';

const useForm = (initialState = {}) => {
  const [form, setForm] = useState(initialState);
  const onChange = useCallback(
    ({ target: { name, value } }) => setForm({ ...form, [name]: value }),
    [form],
  );
  return { form, setForm, onChange };
};

export default useForm;
