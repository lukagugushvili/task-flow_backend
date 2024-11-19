import { UpdateTaskDto } from 'src/task/dto/update-task.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';

export interface IUpdateUser {
  success: boolean;
  message: string;
  user: UpdateUserDto;
}

export interface IUpdateTaskRes {
  success: boolean;
  message: string;
  task: UpdateTaskDto;
}
