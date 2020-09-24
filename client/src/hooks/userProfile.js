import { useState, useEffect } from 'react';

const useUserProfile = (token) => {
  const [user, setUser] = useState(null);
  useEffect(() => {}, [token]);
};

export default useUserProfile;
