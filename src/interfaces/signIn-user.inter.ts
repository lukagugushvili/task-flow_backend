import { IdParamDto } from 'src/users/dto/id-param.dto';

export interface ISignInUser {
  success: boolean;
  token: string;
  user: {
    userId: IdParamDto;
    email: string;
  };
}
