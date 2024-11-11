import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Username is required' })
  @Length(3, 20, {
    message: 'Username must be between 3 and 20 characters',
  })
  userName: string;

  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @Length(8, 32, {
    message: 'Password must be between 8 and 32 characters',
  })
  password: string;
}
