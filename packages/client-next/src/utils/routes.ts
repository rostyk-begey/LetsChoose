const ROUTES = {
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
  GAMES: {
    INDEX: '/games',
  },
  API: {
    INDEX: '/api',
    CONTESTS: '/contests',
    USERS: '/users',
    GAMES: '/games',
    AUTH: {
      INDEX: '/auth',
      LOGIN: '/auth/login',
      LOGIN_GOOGLE: '/auth/login/google',
      LOGOUT: '/auth/logout',
      REGISTER: '/auth/register',
      REFRESH_TOKEN: '/auth/token',
      CONFIRM_EMAIL: '/auth/email/confirm',
      FORGOT_PASSWORD: '/auth/password/forgot',
      RESET_PASSWORD: '/auth/password/reset',
    },
  },
};

export default ROUTES;
