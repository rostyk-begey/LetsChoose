import React, { useEffect, useContext } from 'react';

import AuthContext from 'app/context/AuthContext';

const Logout = () => {
  const { logout } = useContext(AuthContext);
  useEffect(logout, []);

  return <></>;
};

export default Logout;
