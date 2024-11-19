import { Task } from 'src/task/schema/task.schema';
import { User } from 'src/users/schema/user.schema';

export interface IDeleteUser {
  success: boolean;
  message: string;
  user: User;
}

export interface IDeleteTaskRes {
  success: boolean;
  message: string;
  task: Task;
}
