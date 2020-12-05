import { useLocation } from 'react-router-dom';

const useURLSearchParams = () => new URLSearchParams(useLocation().search);

export default useURLSearchParams;
