import { IsMongoId } from 'class-validator';

export class UserIdParamDto {
  @IsMongoId()
  id: string;
}
