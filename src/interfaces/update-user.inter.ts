import { UpdateUserDto } from 'src/users/dto/update-user.dto';

export interface IUpdateUser {
  success: boolean;
  message: string;
  user: UpdateUserDto;
}
