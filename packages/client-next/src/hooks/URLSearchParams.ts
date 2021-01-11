import { useLocation } from 'react-router-dom';

const useURLSearchParams = () => {
  if (typeof window === 'undefined') return new URLSearchParams();
  return new URLSearchParams(); //useLocation().search
};

export default useURLSearchParams;
