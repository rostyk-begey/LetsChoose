import { Request, RequestHandler } from 'express';

export interface ResponseMessage {
  message: string;
}

export interface IMiddleware {
  handle: RequestHandler;
}

export type RequestWithUserId<P = any, ReqBody = any, ReqQuery = any> = {
  userId: string | undefined;
} & Request<P, any, ReqBody, ReqQuery>;
