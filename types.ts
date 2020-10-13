import { Request } from 'express';

export interface ResponseMessage {
  message: string;
}

export type RequestWithUserId<P = any, ReqBody = any, ReqQuery = any> = {
  userId: string | undefined;
} & Request<P, any, ReqBody, ReqQuery>;
