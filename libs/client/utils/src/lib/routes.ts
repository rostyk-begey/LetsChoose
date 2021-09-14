import { API_ROUTES } from '@lets-choose/common/utils';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/password/forgot',
  USERS: '/users',
  SETTINGS: '/settings',
  CONTESTS: {
    INDEX: '/contests',
    NEW: '/contests/new',
  },
  GAMES: {
    INDEX: '/games',
  },
  API: API_ROUTES,
} as const;
