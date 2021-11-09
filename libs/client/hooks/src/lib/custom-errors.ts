import { useState } from 'react';

export const useCustomErrors = <T extends string>() => {
  const [errors, setErrors] = useState<Partial<Record<T, { message: string }>>>(
    {},
  );

  const setError = (name: T, error: { message: string }) => {
    setErrors((errors) => ({
      ...errors,
      [name]: error,
    }));
  };

  const clearError = (name: T) => {
    setErrors((errors) => ({
      ...errors,
      [name]: null,
    }));
  };

  const resetErrors = () => {
    setErrors({});
  };

  return {
    errors,
    setError,
    clearError,
    resetErrors,
  };
};
