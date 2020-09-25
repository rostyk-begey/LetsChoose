export default {
  INDEX: '/',
  HOME: '/',
  LOGIN: '/login',
  LOGOUT: '/logout',
  REGISTER: '/register',
  USERS: '/users',
  CONTESTS: {
    INDEX: '/contests',
    NEW: '/contests/new',
    SINGLE: '/contests/:id',
    UPDATE: '/contests/:id/update',
  },
  API: {
    INDEX: '/api',
    CONTESTS: '/contests',
    USERS: '/users',
    AUTH: {
      INDEX: '/auth',
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      REFRESH_TOKEN: '/auth/refresh_token',
    },
  },
};
