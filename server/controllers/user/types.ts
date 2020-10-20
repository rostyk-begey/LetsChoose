export type UserFindParams = { username: string };

export type LoginResponseBody = {
  userId: string;
  accessToken: string;
  refreshToken?: string;
};
