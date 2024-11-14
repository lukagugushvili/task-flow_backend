import { Request } from 'express';

export interface IReqUser extends Request {
  user: {
    userId: string;
    userName: string;
    email: string;
  };
}

export interface IReqUserPromise {
  userId: string;
  userName: string;
  email: string;
}
