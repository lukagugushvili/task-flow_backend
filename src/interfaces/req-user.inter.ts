import { Request } from 'express';

export interface IReqUser extends Request {
  user: {
    userId: string;
    userName: string;
    email: string;
  };
}

export interface IProtectData {
  message: string;
  user: {
    userId: string;
    userName: string;
    email: string;
  };
}
