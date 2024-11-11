import { User } from 'src/users/schema/user.schema';

export interface IDeleteUser {
  success: boolean;
  message: string;
  user: User;
}
