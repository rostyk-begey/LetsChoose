export default {
  INDEX: '/',
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/password/forgot',
  RESET_PASSWORD: '/password/reset/:token',
  CONFIRM_EMAIL: '/email/confirm/:token',
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
      LOGIN: '/login',
      REGISTER: '/register',
      REFRESH_TOKEN: '/refresh_token',
      FORGOT_PASSWORD: '/password/forgot',
      RESET_PASSWORD: '/password/reset',
    },
  },
};
