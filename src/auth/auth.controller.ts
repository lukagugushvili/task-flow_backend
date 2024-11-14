import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LogInDto } from './dto/login.dto';
import { ISignInUser } from 'src/interfaces/signIn-user.inter';
import { IRegisterUser } from 'src/interfaces/register-user.inter';
import { IReqUser } from 'src/interfaces/req-user.inter';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/users/schema/user.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<IRegisterUser> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async logIn(@Body() logInDto: LogInDto): Promise<ISignInUser> {
    return this.authService.logIn(logInDto);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async profile(@Req() req: IReqUser): Promise<User> {
    console.log(req.user);
    return this.authService.profile(req.user.email);
  }
}
