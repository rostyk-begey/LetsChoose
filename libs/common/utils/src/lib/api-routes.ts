export const API_ROUTES = {
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
    UPDATE_PASSWORD: '/auth/password/update',
  },
  HEALTH: '/health',
} as const;
