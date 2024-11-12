export interface IRegisterUser {
  success: boolean;
  message: string;
}

export interface ICurrentUser {
  user: {
    userId: string;
    userName: string;
    email: string;
  };
}
