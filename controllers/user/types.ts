import { Request, Response } from 'express';
import { ResponseMessage } from '../../types';
import { IUser } from '../../models/User';

type UserFindParams = { username: string };

type ConfirmEmailParams = { token: string };

export interface FindRequest extends Request<UserFindParams> {
  userId: any;
}

export interface ConfirmEmailRequest extends Request<ConfirmEmailParams> {}

export interface RemoveRequest extends Request<UserFindParams> {}

export type LoginResponseBody = {
  userId: any;
  accessToken: string;
  refreshToken?: string;
};

export interface IUserController {
  login(req: Request, res: Response<LoginResponseBody>): Promise<void>;
  register(req: Request, res: Response<ResponseMessage>): Promise<void>;
  forgotPassword(req: Request, res: Response<ResponseMessage>): Promise<void>;
  resetPassword(req: Request, res: Response<ResponseMessage>): Promise<void>;
  refreshToken(req: Request, res: Response<LoginResponseBody>): Promise<void>;
  find(req: FindRequest, res: Response<IUser>): Promise<void>;
  confirmEmail(req: Request<ConfirmEmailParams>, res: Response<ResponseMessage>): Promise<void>;
  remove(req: Request<UserFindParams>, res: Response<ResponseMessage>): Promise<void>;
}