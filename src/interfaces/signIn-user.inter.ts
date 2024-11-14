import { UserIdParamDto } from 'src/users/dto/user-id-param.dto';

export interface ISignInUser {
  success: boolean;
  token: string;
  user: {
    userId: UserIdParamDto;
    email: string;
  };
}
