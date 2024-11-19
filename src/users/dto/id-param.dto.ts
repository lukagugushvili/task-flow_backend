import { IsMongoId } from 'class-validator';

export class IdParamDto {
  @IsMongoId()
  id: string;
}
