import { Request } from 'express';

type TokenParam = { token: string };

export type RequestWithTokenParam = Request<TokenParam>;

export type LoginResponseBody = {
  userId: string;
  accessToken: string;
  refreshToken?: string;
};
