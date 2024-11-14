import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LogInDto } from './dto/login.dto';
import { IRegisterUser } from 'src/interfaces/register-user.inter';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ISignInUser } from 'src/interfaces/signIn-user.inter';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<IRegisterUser> {
    const { email } = registerDto;

    const emailInUse = await this.usersService.findFieldsForAuth(email);

    if (emailInUse) throw new BadRequestException('Email already in use');

    try {
      const createUser = await this.usersService.createUser(registerDto);

      return { success: true, message: 'User created successfully' };
    } catch (error) {
      console.error('Error during user registration:', error.message);
      throw new BadRequestException('User registration failed');
    }
  }

  async logIn(logInDto: LogInDto): Promise<ISignInUser> {
    const { userName, email, password } = logInDto;

    const user = await this.usersService.findFieldsForAuth(email);

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const arePasswordEqual = await bcrypt.compare(password, user.password);

    if (!arePasswordEqual) {
      throw new UnauthorizedException('Invalid credentials');
    }

    try {
      const jwtPayLoad = { userName, email, userId: user.id };
      const access_token = await this.jwtService.sign(jwtPayLoad);

      return {
        success: true,
        token: access_token,
        user: { userId: user.id, email },
      };
    } catch (error) {
      console.error('Error generating JWT token during login:', error.message);
      throw new UnauthorizedException('User login failed');
    }
  }

  async profile(email: string) {
    const user = this.usersService.findFieldsForProfile(email);
    return user;
  }
}
